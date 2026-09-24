# CSV Viewer

A CSV viewer and editor plugin for [Obsidian](https://obsidian.md/).

CSV files can be opened directly in Obsidian, viewed as tables, edited, and saved back to the original CSV file.

---

## Features

* View CSV files as tables directly inside Obsidian
* Open CSV files from the Obsidian file explorer
* Edit cell values
* Save changes to the original CSV file
* Insert rows above or below existing rows
* Delete rows
* Undo and redo recent edits
* Search and filter rows
* Display search result counts
* Pagination for large CSV files
* Reverse display order
* Optionally keep the first row fixed when reversing the display order
* Display Obsidian internal links in CSV cells
* Support multiple links in a single cell
* Support both Wiki links and Markdown links
* Autocomplete links using Markdown files in the vault
* Configure which columns contain links
* Configure which columns contain dates
* Configure the separator used for multiple links
* English and Japanese user interface

---

## Usage

### Open a CSV file

Open a `.csv` file from the Obsidian file explorer.

The CSV file is displayed as a table in the CSV Viewer.

### Edit a cell

Click a cell to edit its value.

Press **Enter** or move focus away from the cell to save the change.

Changes are saved to the original CSV file.

### Insert a row

Use the row action button at the left side of a row to insert a new row above or below an existing row.

When a search filter is active, the new row is inserted according to the original CSV row order rather than the filtered display order.

After inserting a row while searching, the search field is cleared so that the newly inserted row can be displayed and edited.

### Delete a row

Use the row action button to delete a row.

The row is removed from the original CSV data and the change is saved immediately.

### Search

Enter text in the search field to filter the displayed rows.

The search is performed while typing.

The number of matching rows and the currently displayed range are shown.

For example:

```text
250 items: 1–100
```

Clearing the search field returns the full table.

### Pagination

Large CSV files are displayed using pagination.

The number of rows displayed per page can be configured in the settings.

The default is:

```text
100
```

### Undo and Redo

Use the **← Undo** and **→ Redo** buttons to move through recent edits.

The buttons are disabled when there is no available history in that direction.

The viewer keeps a limited number of recent states rather than an unlimited edit history.

---

## Display Order

The table can be displayed in either:

* Original CSV order
* Reverse order

These controls are available directly in the CSV viewer and do not change the order of rows stored in the CSV file.

### Keep the first row fixed

The first row can optionally be kept fixed at the top of the table.

This is useful when the first row is used as a header or title row.

When enabled, the first row is not included in the normal row-order reversal.

---

## Obsidian Internal Links

Cells in configured link columns can contain Obsidian internal links.

The following formats are supported:

### Wiki links

```text
[[Note]]
```

### Markdown links

```text
[Note](Note.md)
```

Multiple links can be stored in the same cell.

For example:

```text
[[Book A]]; [[Book B]]; [[Book C]]
```
---

## Link Editing and Autocomplete

Link columns provide special editing behavior.

When link suggestions are enabled, the viewer can obtain the Markdown files in the current Obsidian vault and display matching files while editing a link cell.

The suggestions are based on:

* File title
* File path

Only a limited number of matching results are displayed at a time in a small suggestion list.

Selecting a suggestion automatically inserts an internal link.

### Link format

The link format is determined by how the user starts entering the link.

Enter:

```text
[
```

to begin a Markdown link.

Enter:

```text
[[
```

to begin a Wiki link.

For example:

```text
[Book
```

will use Markdown link syntax when a file is selected:

```text
[Book](Book.md)
```

Whereas:

```text
[[Book
```

will use Wiki link syntax:

```text
[[Book]]
```

This allows the user to choose the link format naturally while editing without requiring a separate format setting.

### Multiple links

Autocomplete also works after the configured link separator.

For example, when `;` is the separator:

```text
[[Book A]]; [[Book
```

the second link can be completed independently.

The link format is determined from the link currently being edited, rather than only from the beginning of the entire cell.

---

## Link Storage

CSV Viewer stores links as text in the original CSV file.

For example:

```text
notes
[[Book A]]; [[Book B]]
```

or:

```text
notes
[Book A](Book A.md); [Book B](Book B.md)
```

The plugin does not convert all links in a column to a single global format.

Wiki links and Markdown links can therefore be stored according to the format used when entering each link.

The configured link separator is used only to identify separate links within the same cell. It does not change the link syntax itself.

---

## Settings

Open:

**Settings → Community plugins → CSV Viewer**

### Rows per page

Sets the number of CSV rows displayed on each page.

Default:

```text
100
```

### Date columns

Specify the column names that should be treated as date columns.

Multiple column names can be specified, separated by commas.

Default:

```text
date
```

### Link columns

Specify the column names that contain Obsidian internal links.

Multiple column names can be specified, separated by commas.

Default:

```text
notes
```

### Link suggestions

When enabled, CSV Viewer can use Markdown files in the current vault as link completion candidates while editing configured link columns.

The suggestions use file titles and paths to find matching notes.

The files themselves are not inserted into the CSV. Only the selected link text is written to the CSV cell.

---

## Language

The plugin interface uses English by default.

When Obsidian is set to Japanese, the plugin interface is displayed in Japanese.

---

## CSV Format

CSV Viewer reads standard comma-separated CSV data.

Values containing commas, quotation marks, or line breaks are written using CSV quoting rules.

For example:

```text
"Example, value"
```

When editing a cell, CSV Viewer automatically escapes values when necessary before saving them to the original CSV file.

---

## Installation

### Community Plugins

1. Open **Settings → Community plugins**
2. Select **Browse**
3. Search for **CSV Viewer**
4. Install the plugin
5. Enable the plugin

### BRAT

CSV Viewer can also be installed using the **BRAT** plugin.

1. Install **BRAT**
2. Add the CSV Viewer GitHub repository to BRAT
3. Install the plugin
4. Enable **CSV Viewer** in Community plugins

### Manual Installation

1. Download the latest release files.
2. Create the following folder in your vault:

```text
.obsidian/plugins/csv-viewer/
```

3. Copy the following files into the folder:

```text
main.js
manifest.json
styles.css
```

4. Restart Obsidian or reload the plugins.
5. Enable **CSV Viewer** in Community plugins.

---

## Requirements

* Obsidian 1.13.7 or later

---

## Development

Clone the repository and install dependencies:

```bash
npm install
```

Build the plugin:

```bash
npm run build
```

Run the linter:

```bash
npm run lint
```

---

## License

MIT License

---

# CSV Viewer

[Obsidian](https://obsidian.md/) 用のCSVビューアー・編集プラグインです。

CSVファイルをObsidian上で直接開いて、表形式で表示・編集し、元のCSVファイルに保存できます。

---

## 機能

* CSVファイルをObsidian上で表形式表示
* ObsidianのファイルエクスプローラーからCSVを開く
* セルの編集
* 元のCSVファイルへの保存
* 行の追加
* 行の削除
* 編集履歴のUndo / Redo
* 検索・絞り込み
* 検索結果件数の表示
* 大きなCSVに対応したページネーション
* 表示順の反転
* 先頭行を固定した表示
* Obsidian内部リンクの表示
* 1つのセルに複数のリンクを設定
* WikiリンクとMarkdownリンクに対応
* Vault内のMarkdownファイルを利用したリンク候補表示
* リンクとして扱う列を設定
* 日付列を設定
* 複数リンクの区切り文字を設定
* 英語・日本語のUIに対応

---

## 使い方

### CSVファイルを開く

Obsidianのファイルエクスプローラーから `.csv` ファイルを開きます。

CSV ViewerでCSVの内容が表形式で表示されます。

### セルを編集する

セルをクリックすると編集できます。

**Enter** を押すか、セルからフォーカスを外すと変更が保存されます。

変更内容は元のCSVファイルに保存されます。

### 行を追加する

行の左側にある操作ボタンから、既存の行の上または下に新しい行を追加できます。

検索で絞り込んでいる状態で行を追加した場合も、元のCSVの行順を基準に追加されます。

行を追加すると検索欄がクリアされ、新しく追加した行を確認・編集できます。

### 行を削除する

行の操作ボタンから行を削除できます。

削除した内容は元のCSVファイルに保存されます。

### 検索

検索欄に文字を入力すると、入力中もリアルタイムで検索されます。

検索中は、一致した件数と現在表示している範囲が表示されます。

例：

```text
250 items: 1–100
```

検索欄を空にすると、すべてのデータが表示されます。

### ページネーション

行数の多いCSVはページ単位で表示されます。

1ページあたりの表示行数は設定から変更できます。

初期値：

```text
100
```

### Undo / Redo

**← Undo** と **→ Redo** ボタンを使って、直前の編集操作を戻したり、やり直したりできます。

戻せる履歴がない場合、またはやり直せる履歴がない場合は、それぞれのボタンが無効になります。

履歴は無制限には保持せず、直近の編集状態のみを保持します。

---

## 表示順

CSVの表示順を以下から切り替えられます。

* CSVの元の順序
* 逆順

これは表示方法だけを変更するもので、CSVファイル内の行順は変更しません。

### 先頭行を固定

先頭行を表の上部に固定できます。

CSVの1行目をタイトルやヘッダーとして使用する場合に利用できます。

固定を有効にした場合、先頭行は通常の行順反転の対象には含まれません。

---

## Obsidian内部リンク

設定したリンク列では、Obsidian内部リンクを表示できます。

### Wikiリンク

```text
[[Note]]
```

### Markdownリンク

```text
[Note](Note.md)
```

1つのセルに複数のリンクを設定することもできます。

例えば：

```text
[[Book A]]; [[Book B]]; [[Book C]]
```
---

## リンク編集と自動補完

リンク列を編集している場合、設定でリンク候補を有効にすると、Vault内のMarkdownファイルを候補として表示できます。

候補の検索には以下を使用します。

* ファイルタイトル
* ファイルパス

候補はすべて一度に表示するのではなく、小さな候補リストとして表示されます。

候補を選択すると、CSVのセルに内部リンクが自動的に入力されます。

### リンク形式

リンク形式は、入力を開始した方法によって判定されます。

```text
[
```

から入力を開始すると、Markdownリンクとして扱います。

```text
[[
```

から入力を開始すると、Wikiリンクとして扱います。

例えば、

```text
[Book
```

と入力してファイルを選択すると、

```text
[Book](Book.md)
```

の形式で保存されます。

一方、

```text
[[Book
```

と入力した場合は、

```text
[[Book]]
```

の形式で保存されます。

これにより、WikiリンクとMarkdownリンクのどちらを使うかを別の設定で指定する必要はありません。

### 複数リンクの自動補完

自分で設定した区切り文字の後から入力を始めた場合も、自動補完の対象になります。

例えば区切り文字が `;` の場合、

```text
[[Book A]]; [[Book
```

と入力すると、2つ目のリンクについて候補を表示できます。

つまり、セル全体の先頭だけではなく、**区切り文字で分割された現在のリンク部分**を基準にリンク形式を判定します。

---

## リンクの保存形式

CSV Viewerは、リンクを通常の文字列として元のCSVファイルに保存します。

例えばWikiリンクの場合：

```text
notes
[[Book A]]; [[Book B]]
```

Markdownリンクの場合：

```text
notes
[Book A](Book A.md); [Book B](Book B.md)
```

リンク列全体を一つの形式に変換することはありません。

そのため、セル内ではWikiリンクとMarkdownリンクを混在させることもできます。

例えば：

```text
[[Book A]] [Book B](Book B.md)
```

のような形式も保存できます。

---

## 設定

**設定 → コミュニティプラグイン → CSV Viewer**

から設定できます。

### Rows per page

1ページに表示するCSVの行数を設定します。

初期値：

```text
100
```

### Date columns

日付として扱う列名を指定します。

複数の列名をカンマ区切りで指定できます。

初期値：

```text
date
```

### Link columns

Obsidian内部リンクを含む列名を指定します。

複数の列名をカンマ区切りで指定できます。

初期値：

```text
notes
```

### Link suggestions

リンク列の編集時に、Vault内のMarkdownファイルをリンク候補として表示する機能です。

有効にすると、ファイルタイトルとファイルパスを利用して候補を検索できます。

候補として表示されたファイルを選択すると、CSVにはリンク文字列だけが保存されます。

MarkdownファイルそのものをCSV内に保存するわけではありません。

---

## Language

プラグインのUIはデフォルトで英語です。

Obsidianが日本語に設定されている場合は、日本語のUIが表示されます。

---

## CSV形式

CSV Viewerはカンマ区切りのCSVデータを読み込みます。

カンマ、ダブルクォート、改行を含む値は、必要に応じてCSVの引用ルールに従って保存されます。

例えば、

```text
"Example, value"
```

のような値は、CSVとして正しく保存されます。

セルを編集した場合も、必要に応じて自動的にエスケープしてから元のCSVファイルへ保存します。

---

## インストール

### Community Plugins

1. **設定 → コミュニティプラグイン**を開く
2. **閲覧**を選択
3. **CSV Viewer**を検索
4. インストール
5. プラグインを有効化

### BRAT

**BRAT**を使用してインストールすることもできます。

1. **BRAT**をインストール
2. BRATにCSV ViewerのGitHubリポジトリを追加
3. プラグインをインストール
4. コミュニティプラグインから**CSV Viewer**を有効化

### 手動インストール

1. 最新リリースのファイルをダウンロードします。
2. Vault内に以下のフォルダを作成します。

```text
.obsidian/plugins/csv-viewer/
```

3. 以下のファイルをフォルダにコピーします。

```text
main.js
manifest.json
styles.css
```

4. Obsidianを再起動するか、プラグインを再読み込みします。
5. コミュニティプラグインから**CSV Viewer**を有効化します。

---

## 必要環境

* Obsidian 1.13.7 以降

---

## 開発

リポジトリをクローンして依存関係をインストールします。

```bash
npm install
```

ビルド：

```bash
npm run build
```

Lint：

```bash
npm run lint
```

---

## License

MIT License

