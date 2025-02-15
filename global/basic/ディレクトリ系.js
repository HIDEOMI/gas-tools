/////////////////////////////////////////////////////////////////
///////   関数や変数を作成した際には必ず説明補足等を乗せること！   ///////
/////////////////////////////////////////////////////////////////
/** フォルダやファイルのURLからIDを抜き出す関数
 *  @param  {[URL]} targetURL : 対象のURL
 *  @return {[ID] ID (TRUE 抜き出されたID, FALSE "")}
**/
function URL2ID (targetURL) {
  var aryURL = targetURL.split('/');
  var ID = "";
  /// スプレッドシートのURLの場合 ///
  var numIndex = aryURL.indexOf("spreadsheets");
  if (numIndex != -1) {
    ID = aryURL[numIndex + 2];
    return ID;
  }
  /// GドライブフォルダのURLの場合 ///
  numIndex = aryURL.indexOf("folders");
  if (numIndex != -1) {
    ID = aryURL[numIndex + 1];
    ID = ID.replace("?ogsrc=32", "");
    return ID;
  }
  /// どちらにも当てはまらない場合 ///
  return ID;
}
/** IDで指定されるフォルダに対象のフォルダ名があるか検索する関数
 *  @param  {[folderID]} folderID : 検索対象のフォルダID
 *  @param  {[folderName]} searchFolderName : 検索するフォルダ名
 *  @return {[ID] ansID (TRUE 検索対象名に一致するフォルダのIDを返す, FALSE ""を返す)}
**/
function searchAndGetFolderID (folderID, searchFolderName) {
  var folder = DriveApp.getFolderById(folderID);
  var chldFolder = folder.getFolders();   /// 子フォルダの一覧を取得
  var ansID = "";
  while (chldFolder.hasNext()) {   /// 子フォルダを回す
    var targetFolderName = chldFolder.next();   /// 名前を取得
    if (targetFolderName == searchFolderName) {
      /// 検索したいフォルダ名と一致した場合
      ansID = targetFolderName.getId();   /// フォルダIDを取得
      break;
    }
  }
  return ansID;
}
/** IDで指定されるフォルダに対象のファイル名があるか検索する関数
 *  @param  {[folderID]} folderID : 検索対象のフォルダID
 *  @param  {[fileName]} searchFileName : 検索するファイル名
 *  @return {[ID] ansID (TRUE 検索対象名に一致するファイルのIDを返す, FALSE 0を返す)}
**/
function searchAndGetFileID (folderID, searchFileName) {
  var folder = DriveApp.getFolderById(folderID);
  var chldFile = folder.getFiles();   /// 子ファイルの一覧を取得
  var ansID = "";
  while (chldFile.hasNext()) {   /// 子ファイルを回す
    var targetFileName = chldFile.next();   /// 名前を取得
    if (targetFileName == searchFileName) {
      /// 検索したいファイル名と一致した場合
      ansID = targetFileName.getId();   /// ファイルIDを取得
      break;
    }
  }
  return ansID;
}
/** 指定したフォルダにテキストファイルを作成する関数
 *  @param  {[ID]} saveFolderID : フォルダを保存するフォルダのID
 *  @param  {[fileName]} fileName : 作成するファイル名
 *  @param  {[string]} content : ファイルの内容
 *  @return {[ID]] newFileID (ファイルが作成された　TRUE：作成ファイルのID, FALSE)}
**/
function createTextFile (saveFolderID, fileName, content) {
  var contentType = 'text/plain';
  var charset = 'utf-8';
  // Blob を作成する
  var blob = Utilities.newBlob('', contentType, fileName).setDataFromString(content, charset);
  var saveFolder = DriveApp.getFolderById(saveFolderID);　/// IDからフォルダを取得
  var newFile = saveFolder.createFile(blob);  /// 変数folderで取得した場所に、指定名称でファイル作成
  var newFileID = newFile.getId();
  return newFileID;
}
/** 指定したフォルダ内のファイルの一覧を取得し、ファイル名とIDを配列として返す関数
 *  @param  {[ID]} searchFolderID : 検索するフォルダのID
 *  @return {[values]] valuesFile (一覧が取得できた　TRUE：フォルダの[[名前], [ID]], FALSE：空の配列を返す)}
**/
function getFileNamesAndIDs (searchFolderID) {
　var valuesFile = [];
  var searchFolder = DriveApp.getFolderById(searchFolderID);   /// IDから検索対象のフォルダを取得
  var chldFile = searchFolder.getFiles();   /// 子ファイルの一覧を取得
  while (chldFile.hasNext()) {   /// 子ファイルを回す
    var chldFileName = chldFile.next();   /// 名前を取得
    var chldFileID = chldFileName.getId();   /// IDを取得
    valuesFile.push( [chldFileName, chldFileID] );
  }
  return valuesFile;
}
/** 指定したファイルの親フォルダのIDを返す関数
 *  @param  {[ID]} targetID : 対象のファイル(フォルダ)ID
 *  @return {[ID]] parentID (対象のフォルダの親フォルダID)}
**/
function getParentsID(targetID) {
  var parentsFolder = DriveApp.getFileById(targetID).getParents();
  while (parentsFolder.hasNext()) {
   var folder = parentsFolder.next();
   var parentID = folder.getId();
   return parentID;
 }
}
