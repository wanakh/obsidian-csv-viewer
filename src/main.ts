import { FileView, Plugin, TFile, WorkspaceLeaf, moment } from 'obsidian';
import {
	DEFAULT_SETTINGS,
	CsvViewerSettings,
	CsvViewerSettingTab,
} from './settings';

const VIEW_TYPE_CSV = 'csv-viewer';

type RowOrder = 'original' | 'reverse';

function t(english: string, japanese: string): string {
	return moment.locale().toLowerCase().startsWith('ja') ? japanese : english;
}

export default class CsvViewerPlugin extends Plugin {
	settings!: CsvViewerSettings;

	async onload() {
		await this.loadSettings();

		this.registerView(VIEW_TYPE_CSV, (leaf) => new CsvView(leaf, this));

		this.registerExtensions(['csv'], VIEW_TYPE_CSV);

		this.addSettingTab(new CsvViewerSettingTab(this.app, this));
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<CsvViewerSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class CsvView extends FileView {
	plugin: CsvViewerPlugin;
	data: string[][] = [];
	searchQuery = '';
	currentPage = 0;
	rowOrder: RowOrder = 'original';
	keepHeaderOnTop = true;

	private history: string[][][] = [];
	private historyIndex = 0;
	private readonly maxHistory = 11;

	private linkSuggestionFiles: TFile[] = [];
	private linkSuggestionsLoaded = false;

	constructor(leaf: WorkspaceLeaf, plugin: CsvViewerPlugin) {
		super(leaf);
		this.plugin = plugin;
		this.contentEl.addClass('csv-viewer');
	}

	getViewType(): string {
		return VIEW_TYPE_CSV;
	}

	getDisplayText(): string {
		return this.file?.basename ?? 'CSV Viewer';
	}

	getIcon(): string {
		return 'table';
	}

	async onLoadFile(file: TFile): Promise<void> {
		await super.onLoadFile(file);

		const text = await this.app.vault.read(file);
		this.data = parseCsv(text);
		this.currentPage = 0;

		this.history = [this.cloneData()];
		this.historyIndex = 0;

		this.linkSuggestionFiles = [];
		this.linkSuggestionsLoaded = false;

		this.render();
	}

	async onUnloadFile(_file: TFile): Promise<void> {
		this.data = [];
		this.linkSuggestionFiles = [];
		this.linkSuggestionsLoaded = false;
		this.contentEl.empty();

		await super.onUnloadFile(_file);
	}

	private render(): void {
		this.contentEl.empty();

		if (this.data.length === 0) {
			this.contentEl.createEl('p', {
				text: t('CSV is empty.', 'CSVは空です。'),
			});
			return;
		}

		const header = this.data[0];

		if (!header) {
			this.contentEl.createEl('p', {
				text: t('CSV is empty.', 'CSVは空です。'),
			});
			return;
		}

		this.renderToolbar();

		const searchContainer = this.contentEl.createDiv();
		searchContainer.addClass('csv-viewer-search');

		const searchInput = searchContainer.createEl('input');
		searchInput.type = 'search';
		searchInput.placeholder = t('Search...', '検索...');
		searchInput.value = this.searchQuery;

		searchInput.addEventListener('input', () => {
			this.searchQuery = searchInput.value;
			this.currentPage = 0;
			this.renderTable(header);
		});

		this.renderTable(header);
	}

	private renderToolbar(): void {
		const toolbar = this.contentEl.createDiv();
		toolbar.addClass('csv-viewer-toolbar');

		const orderButton = toolbar.createEl('button');

		orderButton.setText(
			this.rowOrder === 'original'
				? t('Original order', '元の順番')
				: t('Reverse order', '逆順'),
		);

		orderButton.addEventListener('click', () => {
			this.rowOrder =
				this.rowOrder === 'original' ? 'reverse' : 'original';

			this.currentPage = 0;
			this.render();
		});

		const headerButton = toolbar.createEl('button');

		headerButton.setText(
			this.keepHeaderOnTop
				? t('Header fixed', '1行目を固定')
				: t('Header not fixed', '1行目を固定しない'),
		);

		headerButton.addClass(
			this.keepHeaderOnTop
				? 'csv-viewer-toggle-active'
				: 'csv-viewer-toggle-inactive',
		);

		headerButton.addEventListener('click', () => {
			this.keepHeaderOnTop = !this.keepHeaderOnTop;
			this.currentPage = 0;
			this.render();
		});

		const undoButton = toolbar.createEl('button');
		undoButton.setText('←');
		undoButton.setAttribute('aria-label', t('Undo', '元に戻す'));
		undoButton.disabled = this.historyIndex === 0;

		undoButton.addEventListener('click', () => {
			void this.undo().catch((error) => {
				console.error('Failed to undo CSV edit', error);
			});
		});

		const redoButton = toolbar.createEl('button');
		redoButton.setText('→');
		redoButton.setAttribute('aria-label', t('Redo', 'やり直す'));
		redoButton.disabled = this.historyIndex >= this.history.length - 1;

		redoButton.addEventListener('click', () => {
			void this.redo().catch((error) => {
				console.error('Failed to redo CSV edit', error);
			});
		});
	}

	private renderTable(header: string[]): void {
		const oldTable = this.contentEl.querySelector('table');
		const oldPagination = this.contentEl.querySelector(
			'.csv-viewer-pagination',
		);
		const oldInfo = this.contentEl.querySelector('.csv-viewer-info');
		const oldEmpty = this.contentEl.querySelector('.csv-viewer-empty');

		oldTable?.remove();
		oldPagination?.remove();
		oldInfo?.remove();
		oldEmpty?.remove();

		const dateColumns = this.getColumnNames(
			this.plugin.settings.dateColumns,
		);

		const linkColumns = this.getColumnNames(
			this.plugin.settings.linkColumns,
		);

		let rows = this.getDisplayRows();

		const query = this.searchQuery.trim().toLowerCase();

		if (query !== '') {
			rows = rows.filter(({ row }) =>
				row.some((value) => value.toLowerCase().includes(query)),
			);
		}

		const totalItems = rows.length;

		if (totalItems === 0) {
			const empty = this.contentEl.createEl('p', {
				text: t('No matching data.', '一致するデータがありません。'),
			});
			empty.addClass('csv-viewer-empty');
			return;
		}

		const pageSize = this.plugin.settings.pageSize;
		const totalPages = Math.ceil(totalItems / pageSize);

		if (this.currentPage >= totalPages) {
			this.currentPage = totalPages - 1;
		}

		const start = this.currentPage * pageSize;
		const end = Math.min(start + pageSize, totalItems);
		const pageRows = rows.slice(start, end);

		const info = this.contentEl.createDiv();
		info.addClass('csv-viewer-info');
		info.setText(
			t(
				`${totalItems} items: ${start + 1}–${end}`,
				`全 ${totalItems} 件中 ${start + 1}–${end} 件を表示`,
			),
		);

		const table = this.contentEl.createEl('table');

		if (this.keepHeaderOnTop) {
			const thead = table.createEl('thead');
			const headerRow = thead.createEl('tr');
			headerRow.addClass('csv-viewer-sticky-header');

			headerRow.createEl('th');

			for (const column of header) {
				headerRow.createEl('th', {
					text: column,
				});
			}
		}

		const tbody = table.createEl('tbody');

		for (const item of pageRows) {
			const tr = tbody.createEl('tr');

			const row = item.row;
			const originalIndex = item.originalIndex;

			const actionCell = tr.createEl('td');
			actionCell.addClass('csv-viewer-row-actions');

			const actionButton = actionCell.createEl('button');
			actionButton.setText('⋮');
			actionButton.setAttribute(
				'aria-label',
				t('Row actions', '行の操作'),
			);

			actionButton.addEventListener('click', (event) => {
				event.stopPropagation();

				this.showRowMenu(actionButton, originalIndex);
			});

			for (
				let columnIndex = 0;
				columnIndex < header.length;
				columnIndex++
			) {
				const td = tr.createEl('td');
				const value = row[columnIndex] ?? '';
				const columnName = header[columnIndex] ?? '';

				const isDateColumn = dateColumns.has(columnName);
				const isLinkColumn = linkColumns.has(columnName);

				if (isLinkColumn) {
					this.renderLinkCell(td, value);
				} else if (isDateColumn) {
					td.setText(value);
				} else {
					td.setText(value);
				}

				td.addEventListener('click', (event) => {
					if ((event.target as HTMLElement).tagName === 'A') {
						return;
					}

					this.editCell(td, originalIndex, columnIndex);
				});
			}
		}

		const pagination = this.contentEl.createDiv();
		pagination.addClass('csv-viewer-pagination');

		const previousButton = pagination.createEl('button', {
			text: t('Previous', '前へ'),
		});

		previousButton.disabled = this.currentPage === 0;

		previousButton.addEventListener('click', () => {
			if (this.currentPage > 0) {
				this.currentPage--;
				this.renderTable(header);
			}
		});

		pagination.createSpan({
			text: t(
				` Page ${this.currentPage + 1} / ${totalPages} `,
				` ${this.currentPage + 1} / ${totalPages} ページ `,
			),
		});

		const nextButton = pagination.createEl('button', {
			text: t('Next', '次へ'),
		});

		nextButton.disabled = this.currentPage >= totalPages - 1;

		nextButton.addEventListener('click', () => {
			if (this.currentPage < totalPages - 1) {
				this.currentPage++;
				this.renderTable(header);
			}
		});
	}

	private showRowMenu(
		button: HTMLButtonElement,
		originalIndex: number,
	): void {
		const existingMenu = this.contentEl.querySelector(
			'.csv-viewer-row-menu',
		);

		existingMenu?.remove();

		const menu = this.contentEl.createDiv();
		menu.addClass('csv-viewer-row-menu');

		const addAboveButton = menu.createEl('button', {
			text: t('Insert row above', '上に行を追加'),
		});

		addAboveButton.addEventListener('click', () => {
			void this.insertRow(originalIndex, 'above').catch((error) => {
				console.error('Failed to insert CSV row', error);
			});

			menu.remove();
		});

		const addBelowButton = menu.createEl('button', {
			text: t('Insert row below', '下に行を追加'),
		});

		addBelowButton.addEventListener('click', () => {
			void this.insertRow(originalIndex, 'below').catch((error) => {
				console.error('Failed to insert CSV row', error);
			});

			menu.remove();
		});

		const deleteButton = menu.createEl('button', {
			text: t('Delete row', 'この行を削除'),
		});

		deleteButton.addClass('csv-viewer-row-menu-delete');

		deleteButton.addEventListener('click', () => {
			void this.deleteRow(originalIndex).catch((error) => {
				console.error('Failed to delete CSV row', error);
			});

			menu.remove();
		});

		const rect = button.getBoundingClientRect();

		menu.addClass('csv-viewer-row-menu-positioned');
		menu.setCssProps({
			'--csv-viewer-menu-left': `${rect.right + 4}px`,
			'--csv-viewer-menu-top': `${rect.top}px`,
		});
	}

	private getDisplayRows(): {
		row: string[];
		originalIndex: number;
	}[] {
		const rows: {
			row: string[];
			originalIndex: number;
		}[] = [];

		const startIndex = this.keepHeaderOnTop ? 1 : 0;

		for (let i = startIndex; i < this.data.length; i++) {
			const row = this.data[i];

			if (row) {
				rows.push({
					row,
					originalIndex: i,
				});
			}
		}

		if (this.rowOrder === 'reverse') {
			rows.reverse();
		}

		return rows;
	}

	private async insertRow(
		originalIndex: number,
		position: 'above' | 'below',
	): Promise<void> {
		const newRowLength = this.data[0]?.length ?? 1;

		const newRow: string[] = Array.from({ length: newRowLength }, () => '');

		let insertIndex: number;

		if (this.rowOrder === 'original') {
			insertIndex =
				position === 'above' ? originalIndex : originalIndex + 1;
		} else {
			insertIndex =
				position === 'above' ? originalIndex + 1 : originalIndex;
		}

		this.data.splice(insertIndex, 0, newRow);

		await this.saveCsv();
		this.addHistory();

		this.render();
	}

	private async deleteRow(originalIndex: number): Promise<void> {
		if (this.keepHeaderOnTop && originalIndex === 0) {
			return;
		}

		const confirmed = window.confirm(
			t('Delete this row?', 'この行を削除しますか？'),
		);

		if (!confirmed) {
			return;
		}

		this.data.splice(originalIndex, 1);

		if (this.data.length === 0) {
			this.data = [[]];
		}

		await this.saveCsv();
		this.addHistory();

		const totalRows = this.getDisplayRows().length;
		const pageSize = this.plugin.settings.pageSize;
		const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));

		if (this.currentPage >= totalPages) {
			this.currentPage = totalPages - 1;
		}

		this.render();
	}

	private getColumnNames(value: string): Set<string> {
		return new Set(
			value
				.split(',')
				.map((name) => name.trim())
				.filter((name) => name !== ''),
		);
	}

	private renderLinkCell(td: HTMLTableCellElement, value: string): void {
		td.empty();

		const separator = this.plugin.settings.linkSeparator;

		const values = value
			.split(separator)
			.map((item) => item.trim())
			.filter((item) => item !== '');

		for (let i = 0; i < values.length; i++) {
			const linkValue = values[i];

			if (!linkValue) {
				continue;
			}

			const wikiLinkMatch = linkValue.match(/^\[\[([^\]]+)\]\]$/);

			const markdownLinkMatch = linkValue.match(
				/^\[([^\]]+)\]\(([^)]+)\)$/,
			);

			if (wikiLinkMatch) {
				const linkTarget = wikiLinkMatch[1] ?? '';

				const link = td.createEl('a', {
					text: linkTarget,
				});

				link.href = '#';

				link.addEventListener('click', (event) => {
					event.preventDefault();

					void this.app.workspace.openLinkText(
						linkTarget,
						this.file?.path ?? '',
						false,
					);
				});
			} else if (markdownLinkMatch) {
				const linkText = markdownLinkMatch[1] ?? '';
				const linkTarget = markdownLinkMatch[2] ?? '';

				const link = td.createEl('a', {
					text: linkText,
				});

				link.href = '#';

				link.addEventListener('click', (event) => {
					event.preventDefault();

					void this.app.workspace.openLinkText(
						linkTarget,
						this.file?.path ?? '',
						false,
					);
				});
			} else {
				td.createSpan({
					text: linkValue,
				});
			}

			if (i < values.length - 1) {
				td.createSpan({
					text: ` ${separator} `,
				});
			}
		}
	}

	private editCell(
		td: HTMLTableCellElement,
		rowIndex: number,
		columnIndex: number,
	): void {
		if (td.querySelector('input')) {
			return;
		}

		const currentValue = this.data[rowIndex]?.[columnIndex] ?? '';

		const header = this.data[0] ?? [];
		const columnName = header[columnIndex] ?? '';

		const linkColumns = this.getColumnNames(
			this.plugin.settings.linkColumns,
		);

		const isLinkColumn = linkColumns.has(columnName);

		td.empty();

		const input = td.createEl('input');
		input.type = 'text';
		input.value = currentValue;
		input.size = Math.max(currentValue.length + 2, 12);

		let saved = false;

		const save = () => {
			if (saved) {
				return;
			}

			saved = true;

			void this.saveCell(input, rowIndex, columnIndex).catch((error) => {
				console.error('Failed to save CSV cell', error);
			});
		};

		input.addEventListener('keydown', (event) => {
			if (event.key === 'Enter') {
				event.preventDefault();
				save();
			}

			if (event.key === 'Escape') {
				saved = true;
				this.removeLinkSuggestions();
				td.setText(currentValue);
			}
		});

		input.addEventListener('blur', () => {
			save();
		});

		input.focus();
		input.select();

		if (isLinkColumn && this.plugin.settings.enableLinkSuggestions) {
			this.loadLinkSuggestionFiles();

			this.showLinkSuggestions(input, rowIndex, columnIndex);
		}
	}

	private loadLinkSuggestionFiles(): void {
		if (this.linkSuggestionsLoaded) {
			return;
		}

		this.linkSuggestionFiles = this.app.vault
			.getMarkdownFiles()
			.sort((a, b) => a.path.localeCompare(b.path));

		this.linkSuggestionsLoaded = true;
	}

	private showLinkSuggestions(
		input: HTMLInputElement,
		_rowIndex: number,
		_columnIndex: number,
	): void {
		if (!this.plugin.settings.enableLinkSuggestions) {
			return;
		}

		const files = this.linkSuggestionFiles;

		const updateSuggestions = (): void => {
			this.removeLinkSuggestions();

			const currentSegment = this.getCurrentLinkSegment(input.value);

			const trimmedSegment = currentSegment.trim();

			// [ または [[ から入力している場合だけ候補を表示
			if (!trimmedSegment.startsWith('[')) {
				return;
			}

			const query =
				this.getLinkSuggestionQuery(trimmedSegment).toLowerCase();

			const candidates = files
				.filter((file) => {
					if (query === '') {
						return true;
					}

					return (
						file.basename.toLowerCase().includes(query) ||
						file.path.toLowerCase().includes(query)
					);
				})
				.slice(0, 10);

			if (candidates.length === 0) {
				return;
			}

			const popup = document.body.createDiv();
			popup.addClass('csv-viewer-link-suggestions');

			const rect = input.getBoundingClientRect();

			popup.addClass('csv-viewer-link-suggestions-positioned');

			popup.setCssProps({
				'--csv-viewer-suggestions-left': `${rect.left}px`,
				'--csv-viewer-suggestions-top': `${rect.bottom + 2}px`,
				'--csv-viewer-suggestions-width': `${Math.max(rect.width, 260)}px`,
			});

			for (const file of candidates) {
				const button = popup.createEl('button');
				button.addClass('csv-viewer-link-suggestion');

				const title = button.createDiv();
				title.setText(file.basename);

				const path = button.createDiv();
				path.addClass('csv-viewer-link-suggestion-path');
				path.setText(file.path);

				button.addEventListener('mousedown', (event) => {
					event.preventDefault();

					const newLink = this.createLinkValue(file, trimmedSegment);

					input.value = this.replaceCurrentLinkSegment(
						input.value,
						newLink,
					);

					this.removeLinkSuggestions();
					input.focus();
				});
			}
		};

		input.addEventListener('input', updateSuggestions);

		input.addEventListener('keydown', (event) => {
			if (event.key === 'Escape') {
				this.removeLinkSuggestions();
			}
		});

		updateSuggestions();
	}

	private removeLinkSuggestions(): void {
		const suggestions = document.querySelector(
			'.csv-viewer-link-suggestions',
		);

		suggestions?.remove();
	}

	private getLinkSuggestionQuery(value: string): string {
		return value
			.trim()
			.replace(/^\[\[/, '')
			.replace(/^\[/, '')
			.replace(/\]\]$/, '')
			.replace(/\].*$/, '');
	}

	private getCurrentLinkSegment(value: string): string {
		const separator = this.plugin.settings.linkSeparator;

		const lastSeparator = value.lastIndexOf(separator);

		if (lastSeparator === -1) {
			return value;
		}

		return value.slice(lastSeparator + separator.length);
	}

	private replaceCurrentLinkSegment(value: string, newLink: string): string {
		const separator = this.plugin.settings.linkSeparator;

		const lastSeparator = value.lastIndexOf(separator);

		if (lastSeparator === -1) {
			return newLink;
		}

		return value.slice(0, lastSeparator + separator.length) + newLink;
	}

	private createLinkValue(file: TFile, currentValue: string): string {
		const trimmed = currentValue.trim();

		if (trimmed.startsWith('[[')) {
			return `[[${file.path.replace(/\.md$/, '')}]]`;
		}

		if (trimmed.startsWith('[')) {
			return `[${file.basename}](${file.path})`;
		}

		return `[[${file.path.replace(/\.md$/, '')}]]`;
	}

	private async saveCell(
		input: HTMLInputElement,
		rowIndex: number,
		columnIndex: number,
	): Promise<void> {
		const newValue = input.value;

		if (!this.data[rowIndex]) {
			return;
		}

		this.removeLinkSuggestions();

		this.data[rowIndex][columnIndex] = newValue;

		await this.saveCsv();
		this.addHistory();

		this.render();
	}

	private async saveCsv(): Promise<void> {
		if (!this.file) {
			return;
		}

		const csvText = this.data
			.map((row) => row.map(escapeCsvValue).join(','))
			.join('\n');

		await this.app.vault.modify(this.file, csvText);
	}

	private cloneData(): string[][] {
		return this.data.map((row) => [...row]);
	}

	private addHistory(): void {
		this.history = this.history.slice(0, this.historyIndex + 1);

		this.history.push(this.cloneData());

		if (this.history.length > this.maxHistory) {
			this.history.shift();
		} else {
			this.historyIndex++;
		}
	}

	private async undo(): Promise<void> {
		if (this.historyIndex === 0) {
			return;
		}

		this.historyIndex--;

		const state = this.history[this.historyIndex];

		if (!state) {
			return;
		}

		this.data = state.map((row) => [...row]);

		await this.saveCsv();
		this.render();
	}

	private async redo(): Promise<void> {
		if (this.historyIndex >= this.history.length - 1) {
			return;
		}

		this.historyIndex++;

		const state = this.history[this.historyIndex];

		if (!state) {
			return;
		}

		this.data = state.map((row) => [...row]);

		await this.saveCsv();
		this.render();
	}
}

function parseCsv(text: string): string[][] {
	const rows: string[][] = [];
	let row: string[] = [];
	let value = '';
	let inQuotes = false;

	for (let i = 0; i < text.length; i++) {
		const char = text[i];

		if (inQuotes) {
			if (char === '"') {
				if (text[i + 1] === '"') {
					value += '"';
					i++;
				} else {
					inQuotes = false;
				}
			} else {
				value += char;
			}
		} else {
			if (char === '"') {
				inQuotes = true;
			} else if (char === ',') {
				row.push(value);
				value = '';
			} else if (char === '\n') {
				row.push(value);
				rows.push(row);
				row = [];
				value = '';
			} else if (char === '\r') {
				if (text[i + 1] === '\n') {
					i++;
				}

				row.push(value);
				rows.push(row);
				row = [];
				value = '';
			} else {
				value += char;
			}
		}
	}

	if (value !== '' || row.length > 0) {
		row.push(value);
		rows.push(row);
	}

	return rows;
}

function escapeCsvValue(value: string): string {
	if (
		value.includes(',') ||
		value.includes('"') ||
		value.includes('\n') ||
		value.includes('\r')
	) {
		return `"${value.replace(/"/g, '""')}"`;
	}

	return value;
}
