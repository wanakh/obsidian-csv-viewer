import {
	FileView,
	Plugin,
	TFile,
	WorkspaceLeaf,
	moment,
} from 'obsidian';
import {
	DEFAULT_SETTINGS,
	MyPluginSettings,
	SampleSettingTab,
} from './settings';

const VIEW_TYPE_CSV = 'csv-viewer';

function t(
	english: string,
	japanese: string,
): string {
	return moment.locale().toLowerCase().startsWith('ja')
		? japanese
		: english;
}

export default class MyPlugin extends Plugin {
	settings!: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		this.registerView(
			VIEW_TYPE_CSV,
			(leaf) => new CsvView(leaf, this),
		);

		this.registerExtensions(['csv'], VIEW_TYPE_CSV);

		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<MyPluginSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class CsvView extends FileView {
	plugin: MyPlugin;
	data: string[][] = [];
	searchQuery = '';
	currentPage = 0;

	constructor(leaf: WorkspaceLeaf, plugin: MyPlugin) {
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

		this.render();
	}

	async onUnloadFile(_file: TFile): Promise<void> {
		this.data = [];
		this.contentEl.empty();

		await super.onUnloadFile(_file);
	}

	private getColumnNames(value: string): Set<string> {
	return new Set(
		value
			.split(',')
			.map((name) => name.trim())
			.filter((name) => name !== ''),
	);
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

	const rows = this.data
		.slice(1)
		.map((row, index) => ({
			row,
			originalIndex: index + 1,
		}));

	const query = this.searchQuery.trim().toLowerCase();

	const filteredRows = query === ''
		? rows
		: rows.filter(({ row }) =>
			row.some((value) =>
				value.toLowerCase().includes(query),
			),
		);

	const totalItems = filteredRows.length;

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
	const pageRows = filteredRows.slice(start, end);

	const info = this.contentEl.createDiv();
	info.addClass('csv-viewer-info');
	info.setText(
	t(
		`${totalItems} items: ${start + 1}–${end}`,
		`全 ${totalItems} 件中 ${start + 1}–${end} 件を表示`,
	),
);

	const table = this.contentEl.createEl('table');

	const thead = table.createEl('thead');
	const headerRow = thead.createEl('tr');

	for (const column of header) {
		headerRow.createEl('th', {
			text: column,
		});
	}

	const tbody = table.createEl('tbody');

	for (const item of pageRows) {
		const tr = tbody.createEl('tr');
		const row = item.row;
		const originalIndex = item.originalIndex;

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
	private renderLinkCell(
	td: HTMLTableCellElement,
	value: string,
): void {
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

	td.empty();

	const input = td.createEl('input');
	input.type = 'text';
	input.value = currentValue;
	input.size = Math.max(currentValue.length + 2, 12);

	input.addEventListener('keydown', async (event) => {
		if (event.key === 'Enter') {
			await this.saveCell(input, rowIndex, columnIndex);
		}

		if (event.key === 'Escape') {
			td.setText(currentValue);
		}
	});

	input.addEventListener('blur', async () => {
		await this.saveCell(input, rowIndex, columnIndex);
	});

	input.focus();
	input.select();
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

	this.data[rowIndex][columnIndex] = newValue;

	await this.saveCsv();

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