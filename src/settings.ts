import { App, PluginSettingTab, Setting, getLanguage } from 'obsidian';
import CsvViewerPlugin from './main';

export interface CsvViewerSettings {
	pageSize: number;
	dateColumns: string;
	enableLinkSuggestions: boolean;
}

export const DEFAULT_SETTINGS: CsvViewerSettings = {
	pageSize: 100,
	dateColumns: 'date',
	enableLinkSuggestions: false,
};

function t(english: string, japanese: string): string {
	return getLanguage().toLowerCase().startsWith('ja') ? japanese : english;
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

						if (Number.isInteger(pageSize) && pageSize > 0) {
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
					.setPlaceholder('Date')
					.setValue(this.plugin.settings.dateColumns)
					.onChange(async (value) => {
						this.plugin.settings.dateColumns = value;
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName(t('Link suggestions', 'リンク候補'))
			.setDesc(
				t(
					'Show Markdown file names from your vault when editing link columns.',
					'リンクカラムの編集時に、Vault内のMarkdownファイル名を候補として表示します。',
				),
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.enableLinkSuggestions)
					.onChange(async (value) => {
						this.plugin.settings.enableLinkSuggestions = value;
						await this.plugin.saveSettings();
					}),
			);
	}
}
