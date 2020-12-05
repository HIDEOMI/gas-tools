///////////////////////////////////////////////////////////////////
///////   関数や変数を作成した際には必ず説明補足等を乗せること！   ///////
///////////////////////////////////////////////////////////////////
/** GID付きのURLからスプレッドシートのシートを取得する関数
 * @param  {[URL]} sheetURL : 取得したいシートのURL
 * @return {[Sheet] targetSheet (GIDから取得したスプシ内のシート)}
**/
function getSheetForURL (sheetURL) {
  var vals = sheetURL.split('/edit#gid=');        /// URLを "/edit#gid=" で前後に分割
  var targetGID = vals[1];                        /// 後ろ部分がGID
  var valsIncledeSSKey = vals[0].split('/');      /// スプシのキーを含む前半部分を更に '/' で分割
  var SSKey = valsIncledeSSKey.pop();             /// 分割した文字配列の最後の要素がスプシのキー
  var targetSS = SpreadsheetApp.openById(SSKey);  /// キーからスプシを取得
  var sheets = targetSS.getSheets();              /// スプシ内のシートを全て取得
  for (var i in sheets) {                          /// シートを順番に回す
    var sheetGID = sheets[i].getSheetId();        /// シートのGIDを取得
    if (sheetGID == targetGID) {                  /// もし対象のGIDだった場合
      var targetSheet = sheets[i];
      return targetSheet;                          /// シートを返す
    }
  }
}
/** 指定したスプレッドシートに含まれるシート名の一覧を取得して配列として返す関数
 * @param  {[Spreadsheet]} targetSS : 指定したスプレッドシート
 * @return {[values] valueSheetNames (シート名の一覧を格納した1次元配列)}
**/
function getSheetNames (targetSS) {
  var sheets = targetSS.getSheets();
  var valueSheetNames = [];
  if (sheets.length >= 1) {
    for (var i = 0; i < sheets.length; i++) {
      valueSheetNames.push(sheets[i].getName());
    }
  }
  return valueSheetNames;
}