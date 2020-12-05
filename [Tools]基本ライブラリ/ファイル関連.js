/** "Shift-JIS"形式でCSVファイルを作成する関数
 *  @param  {[ID]} saveFolderID : ファイルを保存するフォルダのID
 *  @param  {[fileName]} fileName : 作成するCSVのファイル名
 *  @param  {[values]} vals : 二次元配列
 *  @return {[ID] "folderID"内に作成された"Shift-JIS"形式のCSVファイルのID}
**/
function createCSVFileAsShiftJIS (saveFolderID, fileName, vals) {
	var csv = '';
	vals.forEach(function(val){
		csv += val.join(',') + "\r\n";
	});
	var contentType = 'text/csv';
	var charset = 'Shift-JIS';
	// Blob を作成する
	var blob = Utilities.newBlob('', contentType, fileName).setDataFromString(csv, charset);
	var saveFolder = DriveApp.getFolderById(saveFolderID);   /// IDからフォルダを取得
  var newFile = saveFolder.createFile(blob);   /// 変数folderで取得した場所に、指定名称でファイル作成
  var newFileID = newFile.getId();
  return newFileID;
}
/** "UTF-8"形式でCSVファイルを作成する関数
 *  @param  {[ID]} saveFolderID : ファイルを保存するフォルダのID
 *  @param  {[fileName]} fileName : 作成するCSVのファイル名
 *  @param  {[values]} vals : 二次元配列
 *  @return {[ID] "folderID"内に作成された"UTF-8"形式のCSVファイルのID}
**/
function createCSVFileAsUTF8 (saveFolderID, fileName, vals) {
  var csv = '';
  vals.forEach(function(val){
    csv += val.join(',') + "\r\n";
  });
  var contentType = 'text/csv';
  var charset = 'utf-8';
  // Blob を作成する
  var blob = Utilities.newBlob('', contentType, fileName).setDataFromString(csv, charset);
  var saveFolder = DriveApp.getFolderById(saveFolderID);   /// IDからフォルダを取得
  var newFile = saveFolder.createFile(blob);   /// 変数folderで取得した場所に、指定名称でファイル作成
  var newFileID = newFile.getId();
  return newFileID;
}
/** TSVファイル(タブ区切りのテキストファイル)を作成する関数
 *  @param  {[ID]} saveFolderID : ファイルを保存するフォルダのID
 *  @param  {[fileName]} fileName : 作成するTSVのファイル名
 *  @param  {[values]} vals : 二次元配列
 *  @return {[void] "folderID"内に"fileName","vals"の内容を持つTSVファイルが作成される}
**/
function createTSVFile (saveFolderID, fileName, vals) {
  var tsv = '';
  vals.forEach(function(val){
    tsv += val.join('\t') + "\r\n";
  });
  var contentType = 'text/tsv';
  var charset = 'utf-8';
  // Blob を作成する
  var blob = Utilities.newBlob('', contentType, fileName).setDataFromString(tsv, charset);
	var saveFolder = DriveApp.getFolderById(saveFolderID);   /// IDからフォルダを取得
	var newFile = saveFolder.createFile(blob);   /// 変数folderで取得した場所に、指定名称でファイル作成
	var newFileID = newFile.getId();
  return newFileID;
}