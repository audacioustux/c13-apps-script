import { batchSheetName } from './constants';

function pushChanges(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  Object.keys(data.inv).forEach(invSheetName => {
    const soldSheetName = `${invSheetName}_SOLD`;
    const soldSheet = ss.getSheetByName(soldSheetName);
    const soldSheetData = data.sold[soldSheetName];
    if (soldSheetData.length) {
      soldSheet
        .getRange(4, 1, soldSheet.getLastRow() - 4, soldSheet.getLastColumn())
        .deleteCells(SpreadsheetApp.Dimension.ROWS);
      soldSheet.insertRowsAfter(3, soldSheetData.length);
      soldSheet
        .getRange(4, 1, soldSheetData.length, soldSheetData[0].length)
        .setValues(soldSheetData);
    }

    const retSheetName = `${invSheetName}_RETURN`;
    const retSheet = ss.getSheetByName(retSheetName);
    const retSheetData = data.ret[retSheetName];
    if (retSheetData.length) {
      retSheet
        .insertRowAfter(3)
        .getRange(4, 1, retSheet.getLastRow() - 4, retSheet.getLastColumn())
        .deleteCells(SpreadsheetApp.Dimension.ROWS);
      retSheet.insertRowsAfter(3, retSheetData.length);
      retSheet.getRange(4, 1, retSheetData.length, retSheetData[0].length).setValues(retSheetData);
    }

    const batSheet = ss.getSheetByName(batchSheetName);
    const batSheetData = data.batched;

    if (batSheetData.length) {
      batSheet.getRange(1, 1, batSheetData.length, batSheetData[0].length).setValues(batSheetData);
    }
  });
}

export default pushChanges;
