////////////////////////////////////////////////////////////////////
///////   関数や変数を作成編集した際には必ず説明補足等を乗せること！   ///////
////////////////////////////////////////////////////////////////////
/** ExcelファイルからSpreadsheetへ変換したコピーファイルを同フォルダ内に出力する関数
 * @param  {[ID]} IDXlsFile : 変換したいExcelファイルのID
 * @return {[ID]} res.id : 変換したSpreadsheetのID
**/
function convertEXCEL2Spreadsheet(IDXlsFile) {
  const xlsFile = DriveApp.getFileById(IDXlsFile);
  const xlsBlob = xlsFile.getBlob();
  const xlsFileName = xlsFile.getName();
  const destFolder = getParentsID(IDXlsFile);  // xlsxファイルがあるカレントフォルダを取得する

  const files = {
    title: xlsFileName,
    mimeType: MimeType.GOOGLE_SHEETS,
    parents: [{ id: destFolder }],
  };
  ///////   拡張機能のDrive APIを有効にしているかどうか確認   ///////
  const res = Drive.Files.insert(files, xlsBlob);  // Drive APIで変換
  ///////   拡張機能のDrive APIを有効にしているかどうか確認   ///////
  return res.id;  // 変換シートのIDを返す
  //getSheetData(ss);  // 変換したファイルからデータを取得する
}
