const batchSheetName = 'BATCHS';
const invSheetNameRe = new RegExp(/^Inv#(\d+)$/);
const soldSheetNameRe = new RegExp(/^Inv#(\d+)_SOLD$/);
const retSheetNameRe = new RegExp(/^Inv#(\d+)_RETURN$/);

export { batchSheetName, invSheetNameRe, soldSheetNameRe, retSheetNameRe };
