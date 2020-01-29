import { batchSheetName } from './constants';

function pushBatch(data, batch) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  let batchSheet = ss.getSheetByName(batchSheetName);
  if (!batchSheet) {
    batchSheet = ss.insertSheet(batchSheetName);
  }
  batchSheet.appendRow(['BATCH#', batch]);

  Object.keys(data).forEach(sheetName => {
    if (data[sheetName].length === 0) return;

    const sheet = ss.getSheetByName(sheetName);
    const retSheetName = `${sheetName}_RETURN`;
    const soldSheetName = `${sheetName}_SOLD`;

    let retSheet = ss.getSheetByName(retSheetName);
    if (!retSheet) {
      retSheet = ss.insertSheet(retSheetName);
      sheet.getRange(1, 1, 3, sheet.getLastColumn()).copyTo(retSheet.getRange(1, 1));
      //   set return sheet head
      retSheet
        .getRange(2, 1, 1, retSheet.getLastColumn())
        .merge()
        .setValue('RETURN');

      // init formula row
      const retLastRow = retSheet.getLastRow();
      retSheet.getRange(retLastRow + 1, 1).setValue('Nb PCS');
      retSheet.getRange(retLastRow + 1, 3).setValue('Total');
    }

    let soldSheet = ss.getSheetByName(soldSheetName);
    if (!soldSheet) {
      soldSheet = sheet.copyTo(ss).setName(soldSheetName);
      //   set return sold head
      soldSheet
        .getRange(2, 1, 1, soldSheet.getLastColumn())
        .merge()
        .setValue('SOLD');

      // init formula row
      soldSheet.getRange(soldSheet.getLastRow() + 1, 1).setValue('Nb PCS');
    }

    const retLastRow = retSheet.getLastRow();
    const batLastRow = batchSheet.getLastRow();

    retSheet.insertRowsBefore(retLastRow, data[sheetName].length);
    // batchSheet.insertRows(batLastRow, data[sheetName].length);

    data[sheetName].forEach((rowNo, i) => {
      const row = sheet.getRange(rowNo, 1, 1, sheet.getLastColumn());

      row.copyTo(retSheet.getRange(retLastRow + i, 1, 1, sheet.getLastColumn()));
      row.copyTo(batchSheet.getRange(batLastRow + i + 1, 1, 1, sheet.getLastColumn()));

      soldSheet.deleteRow(
        soldSheet
          .getRange(`A4:A${soldSheet.getLastRow()}`)
          .createTextFinder(row.getValues()[0][0])
          .findNext()
          .getRow()
      );
    });
  });

  batchSheet.appendRow(['nb item']);
}

export default pushBatch;
