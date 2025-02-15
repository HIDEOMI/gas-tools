/////////////////////////////////////////////////////////////////
///////   関数や変数を作成した際には必ず説明補足等を乗せること！   ///////
/////////////////////////////////////////////////////////////////
/** "Shift-JIS"形式でCSVファイルを作成する関数
 *  @param  {[ID]} saveFolderID : ファイルを保存するフォルダのID
 *  @param  {[fileName]} fileName : 作成するCSVのファイル名
 *  @param  {[values]} vals : 二次元配列
 *  @return {[ID] "folderID"内に作成された"Shift-JIS"形式のCSVファイルのID}
**/
function createCSVFileAsShiftJIS(saveFolderID, fileName, vals) {
  let csv = '';
  vals.forEach(function (val) {
    csv += val.join(',') + "\r\n";
  });
  const contentType = 'text/csv';
  const charset = 'Shift-JIS';
  // Blob を作成する
  const blob = Utilities.newBlob('', contentType, fileName).setDataFromString(csv, charset);
  const saveFolder = DriveApp.getFolderById(saveFolderID);   // IDからフォルダを取得
  const newFile = saveFolder.createFile(blob);   // 変数folderで取得した場所に、指定名称でファイル作成
  const newFileID = newFile.getId();
  return newFileID;
}
/** "UTF-8"形式でCSVファイルを作成する関数
 *  @param  {[ID]} saveFolderID : ファイルを保存するフォルダのID
 *  @param  {[fileName]} fileName : 作成するCSVのファイル名
 *  @param  {[values]} vals : 二次元配列
 *  @return {[ID] "folderID"内に作成された"UTF-8"形式のCSVファイルのID}
**/
function createCSVFileAsUTF8(saveFolderID, fileName, vals) {
  let csv = '';
  vals.forEach(function (val) {
    csv += val.join(',') + "\r\n";
  });
  const contentType = 'text/csv';
  const charset = 'utf-8';
  // Blob を作成する
  const blob = Utilities.newBlob('', contentType, fileName).setDataFromString(csv, charset);
  const saveFolder = DriveApp.getFolderById(saveFolderID);   // IDからフォルダを取得
  const newFile = saveFolder.createFile(blob);   // 変数folderで取得した場所に、指定名称でファイル作成
  const newFileID = newFile.getId();
  return newFileID;
}
/** TSVファイル(タブ区切りのテキストファイル)を作成する関数
 *  @param  {[ID]} saveFolderID : ファイルを保存するフォルダのID
 *  @param  {[fileName]} fileName : 作成するTSVのファイル名
 *  @param  {[values]} vals : 二次元配列
 *  @return {[void] "folderID"内に"fileName","vals"の内容を持つTSVファイルが作成される}
**/
function createTSVFile(saveFolderID, fileName, vals) {
  let tsv = '';
  vals.forEach(function (val) {
    tsv += val.join('\t') + "\r\n";
  });
  const contentType = 'text/tsv';
  const charset = 'utf-8';
  // Blob を作成する
  const blob = Utilities.newBlob('', contentType, fileName).setDataFromString(tsv, charset);
  const saveFolder = DriveApp.getFolderById(saveFolderID);   // IDからフォルダを取得
  const newFile = saveFolder.createFile(blob);   // 変数folderで取得した場所に、指定名称でファイル作成
  const newFileID = newFile.getId();
  return newFileID;
}
