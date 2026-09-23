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

Use the row action buttons to insert a new row above or below an existing row.

When a search filter is active, inserting a row uses the original CSV row order. The search field is cleared after inserting the row so that the new row can be displayed and edited.

### Delete a row

Use the row action button to delete a row.

### Search

Enter text in the search field to filter the displayed rows.

The number of matching rows is shown while searching.

Clearing the search field returns the full table.

### Pagination

Large CSV files are displayed using pagination.

The number of rows displayed per page can be configured in the settings.

### Undo and Redo

Use the **Undo** and **Redo** buttons to move through recent edits.

---

## Display Order

The table can be displayed in either:

* Original CSV order
* Reverse order

These options affect only how the data is displayed. They do not change the order of rows in the CSV file.

### Keep the first row fixed

When reverse display order is enabled, the first row can optionally remain fixed at the top of the table.

This is useful when the first row is used as a header or title row.

---

## Obsidian Internal Links

Cells in configured link columns can contain Obsidian internal links.

Supported formats include:

```text
[[Note]]
```

and

```text
[Note](Note.md)
```

Multiple links can be placed in the same cell.

For example:

```text
[[Book A]]; [[Book B]]; [[Book C]]
```

The separator can be configured in the plugin settings.

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

Specify the column names that contain date values.

Multiple column names can be specified if needed.

Default:

```text
date
```

### Link columns

Specify the column names that contain Obsidian links.

Multiple column names can be specified if needed.

Default:

```text
notes
```

### Link separator

Specifies the separator used when multiple links are stored in one cell.

Default:

```text
;
```

Available separators include:

```text
;
.
:
/
```

### Language

The plugin interface uses English by default.

When Obsidian is set to Japanese, the plugin interface is displayed in Japanese.

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

3. Copy the plugin files into the folder:

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

## MIT License

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

行の操作ボタンから、既存の行の上または下に新しい行を追加できます。

検索で絞り込んでいる状態で行を追加した場合も、元のCSVの行順を基準に追加されます。

行を追加すると検索欄がクリアされ、新しく追加した行を確認・編集できます。

### 行を削除する

行の操作ボタンから行を削除できます。

### 検索

検索欄に文字を入力すると、条件に一致する行だけが表示されます。

検索中は一致した行数も表示されます。

検索欄を空にすると、すべてのデータが表示されます。

### ページネーション

行数の多いCSVはページ単位で表示されます。

1ページあたりの表示行数は設定から変更できます。

### Undo / Redo

**Undo** と **Redo** ボタンを使って、直前の編集操作を戻したり、やり直したりできます。

---

## 表示順

CSVの表示順を以下から切り替えられます。

* CSVの元の順序
* 逆順

この設定は表示方法だけを変更するもので、CSVファイル内の行順は変更しません。

### 先頭行を固定

逆順表示を有効にした場合、先頭行を表の上部に固定できます。

先頭行をタイトルやヘッダーとして使用する場合に利用できます。

---

## Obsidian内部リンク

設定したリンク列では、Obsidian内部リンクを表示できます。

対応している形式：

```text
[[Note]]
```

```text
[Note](Note.md)
```

1つのセルに複数のリンクを設定することもできます。

例：

```text
[[Book A]]; [[Book B]]; [[Book C]]
```

複数リンクに使用する区切り文字は、設定から変更できます。

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

必要に応じて複数の列名を指定できます。

初期値：

```text
date
```

### Link columns

Obsidianリンクを含む列名を指定します。

必要に応じて複数の列名を指定できます。

初期値：

```text
notes
```

### Link separator

1つのセルに複数のリンクを記述する場合の区切り文字を設定します。

初期値：

```text
;
```

使用できる区切り文字：

```text
;
.
:
/
```

### Language

プラグインのUIはデフォルトで英語です。

Obsidianが日本語に設定されている場合は、日本語のUIが表示されます。

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

