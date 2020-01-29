import { batchSheetName, invSheetNameRe } from './constants';

function getInvSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets();

  // Filter Only the input files
  const filteredDataSheets = sheets.filter(sheet => {
    return invSheetNameRe.test(sheet.getName());
  });
  return filteredDataSheets.map(sheet => {
    const name = sheet.getName();
    return { name, data: sheet.getDataRange().getValues() };
  });
}

function getBatched() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const batchSheet = ss.getSheetByName(batchSheetName);

  if (!batchSheet) {
    return [[]];
    // batchSheet = ss.insertSheet(batchSheetName);
  }

  return batchSheet.getDataRange().getValues();
}

function sku(batch) {
  const htmlTemplate = HtmlService.createTemplateFromFile('skuForm');
  htmlTemplate.data = { batch, sheets: getInvSheets(), batched: getBatched() };
  const html = htmlTemplate
    .evaluate()
    .setSandboxMode(HtmlService.SandboxMode.IFRAME)
    .setWidth(800)
    .setHeight(800);
  SpreadsheetApp.getUi().showModalDialog(html, `Batch #: ${batch}`);
}

export default sku;
