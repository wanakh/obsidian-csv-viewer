import { App, PluginSettingTab, Setting, moment } from 'obsidian';
import CsvViewerPlugin from './main';

export interface MyPluginSettings {
	pageSize: number;
	dateColumns: string;
	linkColumns: string;
	linkSeparator: string;
}

export const DEFAULT_SETTINGS: MyPluginSettings = {
	pageSize: 100,
	dateColumns: 'date',
	linkColumns: 'notes',
	linkSeparator: ';',
};

function t(
	english: string,
	japanese: string,
): string {
	return moment.locale().toLowerCase().startsWith('ja')
		? japanese
		: english;
}

export class CsvViewerSettingTab extends PluginSettingTab {
	plugin: CsvViewerPlugin;

	constructor(app: App, plugin: CsvViewerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName(t('Rows per page', '1ページあたりの行数'))
			.setDesc(
				t(
					'Number of CSV rows displayed on each page.',
					'1ページに表示するCSVの行数。',
				),
			)
			.addText((text) =>
				text
					.setPlaceholder('100')
					.setValue(String(this.plugin.settings.pageSize))
					.onChange(async (value) => {
						const pageSize = Number(value);

						if (
							Number.isInteger(pageSize) &&
							pageSize > 0
						) {
							this.plugin.settings.pageSize = pageSize;
							await this.plugin.saveSettings();
						}
					}),
			);

		new Setting(containerEl)
			.setName(t('Date columns', '日付カラム'))
			.setDesc(
				t(
					'Comma-separated column names to treat as dates.',
					'日付として扱うカラム名をカンマ区切りで指定します。',
				),
			)
			.addText((text) =>
				text
					.setPlaceholder('date')
					.setValue(this.plugin.settings.dateColumns)
					.onChange(async (value) => {
						this.plugin.settings.dateColumns = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName(t('Link columns', 'リンクカラム'))
			.setDesc(
				t(
					'Comma-separated column names to treat as internal links.',
					'内部リンクとして扱うカラム名をカンマ区切りで指定します。',
				),
			)
			.addText((text) =>
				text
					.setPlaceholder('notes')
					.setValue(this.plugin.settings.linkColumns)
					.onChange(async (value) => {
						this.plugin.settings.linkColumns = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName(t('Link separator', 'リンク区切り文字'))
			.setDesc(
				t(
					'Separator used between multiple links in a link column.',
					'リンクカラム内で複数のリンクを区切る文字です。',
				),
			)
			.addDropdown((dropdown) =>
				dropdown
					.addOption(';', ';')
					.addOption('.', '.')
					.addOption(':', ':')
					.addOption('/', '/')
					.setValue(this.plugin.settings.linkSeparator)
					.onChange(async (value) => {
						this.plugin.settings.linkSeparator = value;
						await this.plugin.saveSettings();
					}),
			);
	}
}