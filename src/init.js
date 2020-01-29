function init() {
  const html = HtmlService.createHtmlOutputFromFile('index')
    .setWidth(800)
    .setHeight(200);
  SpreadsheetApp.getUi().showModalDialog(html, 'Enter The Batch #: ');
}

export default init;
