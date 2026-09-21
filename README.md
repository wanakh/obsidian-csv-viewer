# CSV Viewer

**CSV Viewer** is an Obsidian plugin for viewing and editing CSV files directly inside Obsidian.

It provides a simple table-based interface for CSV files, with support for editing cells, searching data, pagination, and displaying Obsidian internal links as clickable links.

## Features

* View CSV files as tables in Obsidian
* Edit CSV cells directly
* Save changes back to the original CSV file
* Search CSV data
* Pagination for large CSV files
* Display Obsidian internal links as clickable links
* Support multiple links in a single cell
* Recognize both Wiki-style links and Markdown links
* Configure date columns
* Configure link columns
* Configure the separator used for multiple links
* English and Japanese UI support

### Obsidian Internal Links

One of the main features of CSV Viewer is its support for Obsidian links inside CSV files.

For example:

```csv
date,notes
2026-09-21,"[[Book Notes]]"
2026-09-22,"[[Project A]]"
```

Links are displayed as clickable Obsidian links in the table.

Multiple links can also be stored in a single cell:

```csv
date,notes
2026-09-21,"[[Book A]];[[Book B]];[[Book C]]"
```

The link separator can be configured in the plugin settings.

The plugin recognizes both:

```text
[[Note Name]]
```

and:

```text
[Note Name](Note%20Name)
```

## Settings

CSV Viewer currently provides the following settings.

### Rows per page

Controls the number of CSV rows displayed on each page.

The default value is:

```text
100
```

### Date columns

Specify which columns should be treated as date columns.

Multiple columns can be specified by separating their names with commas.

Example:

```text
date,created,updated
```

The default column is:

```text
date
```

### Link columns

Specify which columns should be treated as columns containing Obsidian links.

Multiple columns can be specified by separating their names with commas.

Example:

```text
notes,source,related
```

The default column is:

```text
notes
```

### Link separator

Specifies the separator used when multiple links are stored in one cell.

Available separators:

* `;`
* `.`
* `:`
* `/`

The default separator is:

```text
;
```

For example:

```text
[[Book A]];[[Book B]];[[Book C]]
```

## Requirements

CSV Viewer has been tested with:

* Obsidian 1.13.7

Other Obsidian versions have not been fully tested.

## Installation

### Manual installation

The current version can be installed manually.

1. Download the plugin files from the GitHub Releases page.
2. Create the following directory in your Obsidian vault:

```text
.obsidian/plugins/csv-viewer/
```

3. Copy the following files into that directory:

```text
main.js
manifest.json
styles.css
```

4. Open Obsidian.
5. Go to **Settings → Community plugins**.
6. Enable **CSV Viewer**.

### BRAT

CSV Viewer can also be installed using **BRAT (Beta Reviewer's Auto-update Tool)** once a public GitHub repository and release are available.

BRAT does not require the plugin to be officially listed in the Obsidian Community Plugins directory.

To install a beta version with BRAT:

1. Install BRAT from Obsidian Community Plugins.
2. Open BRAT settings.
3. Choose **Add Beta Plugin**.
4. Enter the GitHub repository URL for CSV Viewer.
5. Install and enable CSV Viewer from Obsidian's Community Plugins settings.

BRAT can be useful for testing new releases before the plugin is submitted to the official Community Plugins directory.

## Development

Clone the repository and install the dependencies:

```bash
npm install
```

Build the plugin:

```bash
npm run build
```

For development with automatic rebuilding:

```bash
npm run dev
```

The generated files are:

```text
main.js
manifest.json
styles.css
```

These files can be copied to:

```text
.obsidian/plugins/csv-viewer/
```

inside an Obsidian vault for local testing.

## Project Structure

The main source files are:

```text
src/
├── main.ts
└── settings.ts

styles.css
manifest.json
package.json
```

## Current Limitations

CSV Viewer is currently a relatively simple CSV viewer/editor.

The following areas may be improved in future versions:

* More robust CSV parsing and writing
* More sophisticated handling of quoted fields
* Column sorting
* Improved table layout
* Additional CSV formatting options
* More advanced link parsing
* Improved handling of large CSV files
* Additional localization

## Roadmap

Possible future improvements include:

* Date-based sorting
* Column sorting
* Improved CSV parsing
* Better handling of CSV files with complex quoting
* More table display options
* Additional Obsidian integration
* Improved settings and customization
* Additional language support

The roadmap may change as development continues.

## License

CSV Viewer is released under the **MIT License**.

See [LICENSE](LICENSE) for the full license text.

---

# 日本語

# CSV Viewer

**CSV Viewer** は、Obsidian内でCSVファイルを閲覧・編集するためのプラグインです。

CSVファイルを表形式で表示し、セルの編集、検索、ページング、Obsidian内部リンクの表示などを行えます。

## 主な機能

* CSVファイルをObsidian内で表形式で表示
* セルを直接編集
* 編集内容を元のCSVファイルへ保存
* CSVデータを検索
* 大きなCSVファイル向けのページング
* Obsidian内部リンクをクリック可能なリンクとして表示
* 1つのセルに複数のリンクを設定
* Wiki形式とMarkdown形式のリンクに対応
* 日付カラムを設定
* リンクカラムを設定
* 複数リンクの区切り文字を設定
* 英語・日本語のUIに対応

### Obsidian内部リンク

CSV Viewerの特徴の一つが、CSV内に記述されたObsidianリンクを扱えることです。

例えば、次のようなCSVを使用できます。

```csv
date,notes
2026-09-21,"[[読書メモ]]"
2026-09-22,"[[プロジェクトA]]"
```

リンクは表の中でクリック可能なObsidianリンクとして表示されます。

1つのセルに複数のリンクを記述することもできます。

```csv
date,notes
2026-09-21,"[[本A]];[[本B]];[[本C]]"
```

複数リンクの区切り文字は設定画面から変更できます。

以下の2種類のリンクを認識します。

```text
[[ノート名]]
```

および

```text
[ノート名](ノート名)
```

## 設定

現在、以下の設定を利用できます。

### 1ページあたりの行数

1ページに表示するCSVの行数を設定します。

デフォルト値：

```text
100
```

### 日付カラム

日付として扱うカラム名を指定します。

複数のカラムを指定する場合は、カンマで区切ります。

例：

```text
date,created,updated
```

デフォルト：

```text
date
```

### リンクカラム

Obsidianリンクを含むカラム名を指定します。

複数のカラムを指定する場合は、カンマで区切ります。

例：

```text
notes,source,related
```

デフォルト：

```text
notes
```

### リンク区切り文字

1つのセルに複数のリンクを記述する場合の区切り文字を指定します。

使用できる区切り文字：

* `;`
* `.`
* `:`
* `/`

デフォルト：

```text
;
```

例えば、

```text
[[本A]];[[本B]];[[本C]]
```

のように記述できます。

## 動作環境

以下の環境で動作確認しています。

* Obsidian 1.13.7

その他のObsidianバージョンについては、十分な動作確認を行っていません。

## インストール

### 手動インストール

現在のバージョンは手動でインストールできます。

1. GitHubのReleasesページからプラグインファイルをダウンロードします。
2. Obsidian Vault内に以下のフォルダを作成します。

```text
.obsidian/plugins/csv-viewer/
```

3. 以下の3ファイルをフォルダにコピーします。

```text
main.js
manifest.json
styles.css
```

4. Obsidianを開きます。
5. **設定 → コミュニティプラグイン**を開きます。
6. **CSV Viewer**を有効にします。

### BRAT

公開GitHubリポジトリとReleaseが用意された後は、**BRAT (Beta Reviewer's Auto-update Tool)** を利用してインストールすることもできます。


BRATを利用する場合：

1. ObsidianのCommunity PluginsからBRATをインストールします。
2. BRATの設定を開きます。
3. **Add Beta Plugin**を選択します。
4. CSV ViewerのGitHubリポジトリURLを入力します。
5. インストール後、Obsidianのコミュニティプラグイン設定からCSV Viewerを有効にします。

公式Community Pluginsへの登録前に、開発中のバージョンをテストしてもらう用途などに利用できます。

## 開発

リポジトリをクローンして依存関係をインストールします。

```bash
npm install
```

ビルド：

```bash
npm run build
```

開発中に自動ビルドする場合：

```bash
npm run dev
```

生成される主なファイル：

```text
main.js
manifest.json
styles.css
```

これらをObsidian Vaultの以下のフォルダにコピーすると、ローカル環境でテストできます。

```text
.obsidian/plugins/csv-viewer/
```

## プロジェクト構成

主なソースファイル：

```text
src/
├── main.ts
└── settings.ts

styles.css
manifest.json
package.json
```

## 現在の制限事項

CSV Viewerは現在、比較的シンプルなCSVビューア・エディタです。

今後、以下の点を改善する可能性があります。

* CSVの解析・書き込み処理の強化
* クォートされたフィールドのより高度な処理
* カラムのソート
* テーブルレイアウトの改善
* CSV表示形式の追加
* リンク解析の強化
* 大きなCSVファイルへの対応改善
* 多言語対応の拡充

## 今後の予定

今後、以下の機能を追加する可能性があります。

* 日付によるソート
* カラムのソート
* CSV解析処理の改善
* 複雑なクォートを含むCSVへの対応改善
* テーブル表示設定の追加
* Obsidianとの連携強化
* 設定項目・カスタマイズ機能の拡充
* 対応言語の追加

今後の開発状況によってロードマップは変更される場合があります。

## ライセンス

CSV Viewerは**MIT License**の下で公開します。

ライセンスの全文は[LICENSE](LICENSE)を参照してください。

