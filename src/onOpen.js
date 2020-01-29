function onOpen() {
  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
    .createMenu('Scripts')
    .addItem('c13', 'init')
    .addToUi();
}

export default onOpen;
