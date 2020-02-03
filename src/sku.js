import { batchSheetName, invSheetNameRe, retSheetNameRe, soldSheetNameRe } from './constants';

function getData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets();

  const data = {
    inv: {},
    sold: {},
    ret: {}
  };
  const sheetMap = {};
  sheets.forEach(sheet => {
    const sheetName = sheet.getName();

    if (invSheetNameRe.test(sheetName)) {
      data.inv[sheetName] = sheet.getDataRange().getValues();
      sheetMap[sheetName] = sheet;
    } else if (soldSheetNameRe.test(sheetName)) {
      if (sheet.getLastRow() > 4) {
        data.sold[sheetName] = sheet
          .getRange(4, 1, sheet.getLastRow() - 4, sheet.getLastColumn())
          .getValues();
      } else {
        data.sold[sheetName] = [];
      }
    } else if (retSheetNameRe.test(sheetName)) {
      if (sheet.getLastRow() > 4) {
        data.ret[sheetName] = sheet
          .getRange(4, 1, sheet.getLastRow() - 4, sheet.getLastColumn())
          .getValues();
      } else {
        data.ret[sheetName] = [];
      }
    } else if (sheetName === batchSheetName) {
      if (sheet.getLastRow() > 2) {
        data.batched = sheet.getDataRange().getValues();
      } else {
        data.batched = [];
      }
    }
  });

  Object.keys(data.inv).forEach(invSheetName => {
    const invSheet = sheetMap[invSheetName];
    const soldSheetName = `${invSheetName}_SOLD`;
    const retSheetName = `${invSheetName}_RETURN`;

    if (!data.sold[soldSheetName]) {
      // duplicate inv sheet to sold sheet
      const soldSheet = ss.insertSheet(soldSheetName);
      invSheet
        .getRange(1, 1, invSheet.getLastRow() - 1, invSheet.getMaxColumns())
        .copyTo(soldSheet.getRange(1, 1));
      // const soldSheet = invSheet.copyTo(ss).setName(soldSheetName);
      soldSheet
        .getRange(2, 1, 1, soldSheet.getLastColumn())
        .merge()
        .setValue('SOLD');

      const lR = soldSheet.getLastRow() + 1;
      soldSheet.insertRows(lR, 1);
      soldSheet.getRange(lR, 1).setValue('nb item');
      soldSheet.getRange(lR, 2).setFormula('=COUNTA(INDIRECT("B4:"&ADDRESS(ROW()-1,COLUMN(),4)))');
      soldSheet.getRange(lR, 3).setValue('TOTAL');
      soldSheet.getRange(lR, 4).setFormula('=SUM(INDIRECT("D4:"&ADDRESS(ROW()-1,COLUMN(),4)))');

      data.sold[soldSheetName] = soldSheet
        .getRange(4, 1, soldSheet.getLastRow() - 4, soldSheet.getLastColumn())
        .getValues();
    }
    if (!data.ret[retSheetName]) {
      // initiate return sheet
      const retSheet = ss.insertSheet(retSheetName);
      invSheet.getRange(1, 1, 3, invSheet.getMaxColumns()).copyTo(retSheet.getRange(1, 1));
      retSheet
        .getRange(2, 1, 1, retSheet.getLastColumn())
        .merge()
        .setValue('RETURN');
      retSheet.insertRows(4, 1);
      retSheet.getRange(4, 1).setValue('nb item');
      retSheet.getRange(4, 2).setFormula('=COUNTA(INDIRECT("B4:"&ADDRESS(ROW()-1,COLUMN(),4)))');
      retSheet.getRange(4, 3).setValue('TOTAL');
      retSheet.getRange(4, 4).setFormula('=SUM(INDIRECT("D4:"&ADDRESS(ROW()-1,COLUMN(),4)))');
      // data.ret[retSheetName] = retSheet
      //   .insertRowAfter(3)
      //   .getRange(4, 1, retSheet.getLastRow() - 3, retSheet.getLastColumn())
      //   .getValues();
      data.ret[retSheetName] = [];
    }
    if (!data.batched) {
      // const batSheet = ss.insertSheet(batchSheetName);
      ss.insertSheet(batchSheetName);
      // data.batched = batSheet.getDataRange().getValues();
      data.batched = [];
    }
  });
  return data;
}

function sku(batch) {
  const htmlTemplate = HtmlService.createTemplateFromFile('sku');
  // all repeated data gets gzipped anyway  ¯\_(ツ)_/¯
  htmlTemplate.data = getData();
  htmlTemplate.batch = batch;
  const html = htmlTemplate
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setWidth(800)
    .setHeight(300);
  SpreadsheetApp.getUi().showModalDialog(html, `Batch #: ${batch}`);
}

export default sku;
