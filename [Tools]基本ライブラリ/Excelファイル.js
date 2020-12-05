///////   ExcelファイルからSpreadsheetへ変換したコピーファイルを同フォルダ内に出力する関数   ///////
/**
*** @param {[ID]} IDXlsFile : ExcelファイルのファイルID
*** @return {[ID] res.id : 変換シートのID(スプレッドシートが同フォルダに作成される)}
**/
function convertEXCEL2Spreadsheet(IDXlsFile) {
  var xlsFile = DriveApp.getFileById(IDXlsFile);
  var xlsBlob = xlsFile.getBlob();
  var xlsFileName = xlsFile.getName();
  var destFolder = getParentsID(IDXlsFile);  /// xlsxファイルがあるカレントフォルダを取得する

  var files = {
    title: xlsFileName,
    mimeType: MimeType.GOOGLE_SHEETS,
    parents: [{ id: destFolder }],
  };
  ///////   拡張機能のDrive APIを有効にしているかどうか確認   ///////
  var res = Drive.Files.insert(files, xlsBlob);  /// Drive APIで変換
  ///////   拡張機能のDrive APIを有効にしているかどうか確認   ///////
  return res.id;  /// 変換シートのIDを返す
  //getSheetData(ss);  /// 変換したファイルからデータを取得する
}