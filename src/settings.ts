import { App, PluginSettingTab, Setting, moment } from 'obsidian';
import MyPlugin from './main';

function t(
	english: string,
	japanese: string,
): string {
	return moment.locale().toLowerCase().startsWith('ja')
		? japanese
		: english;
}

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
export class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName(t('Rows per page', '1ページあたりの行数'))
			.setDesc(t(
				'Number of CSV rows displayed on each page.',
				'1ページに表示するCSVの行数。',
			))
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
			.setName(t('Date columns', '日付の列'))
			.setDesc(t(
				'Comma-separated column names to treat as dates.',
				'コンマで複数のタイトルを指定できます。',
			))
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
			.setName(t('Link columns', 'リンクの列'))
			.setDesc(t('Comma-separated column names to treat as internal links.',
				'コンマで複数のタイトルを指定できます。',)
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
	.setName(t('Link separator','リンクの区切れ目'))
	.setDesc(t('Separator used between multiple links in a link column.',
		'複数の内部リンクの区切りに利用する記号。')
	)
	.addDropdown((dropdown) =>
		dropdown
			.addOption(';', ';')
			.addOption(':', ':')
			.setValue(this.plugin.settings.linkSeparator)
			.onChange(async (value) => {
				this.plugin.settings.linkSeparator = value;
				await this.plugin.saveSettings();
			}),
	);
	}
}