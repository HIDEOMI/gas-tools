///////////////////////////////////////////////////////////////////
///////   関数や変数を作成した際には必ず説明補足等を乗せること！   ///////
///////////////////////////////////////////////////////////////////
///   一般的な型の種類   ///
/// 文字列：{[string]}
/// 数値：{[number]}
/// 真偽値：{[boolean]}
/// 配列：{[values]}
/// シート：{[sheet]}
/// オブジェクト：{[Object]}
/// オブジェクトの配列：{[Object[]]}
/** 〇〇する関数
 *  @param  {[型名]} 変数名 : 説明
 *  @param  {[〇〇]} 〇〇 : 〇〇
 *  @return {[型名] 変数名 (説明)}
**/

/** 指定したシートの指定した列の最終入力行を返す関数
 *  @param  {[sheet]} targetSh : 指定したシート
 *  @param  {[number]} col : 指定したカラム列
 *  @return {[number] lastRow (最終入力行)}
**/
function lastRow(targetSh, col) {
  const range = targetSh.getRange(targetSh.getMaxRows(), col);
  let lastRow = 0;
  if (range.getValue() != "") {  /// 有効表示の最終行が空欄でない場合、シートの最終行がそのまま最終入力行になる
    lastRow = range.getRow();
  } else {
    lastRow = range.getNextDataCell(SpreadsheetApp.Direction.UP).getRow();
  }
  return lastRow;
}
/** 指定したシートの指定した行の最終入力列を返す関数
 *  @param  {[sheet]} targetSh : 指定したシート
 *  @param  {[number]} row : 指定したカラム列
 *  @return {[number] lastCol (最終入力行)}
**/
function lastCol(targetSh, row) {
  const range = targetSh.getRange(row, targetSh.getMaxColumns());
  let lastCol = 0;
  if (range.getValue() != "") {
    lastCol = range.getColumn();
  } else {
    lastCol = range.getNextDataCell(SpreadsheetApp.Direction.PREVIOUS).getColumn();
  }
  return lastCol;
}
/** 指定したシートに入力されたすべての値を配列として取得する関数
 *  @param  {[sheet]} targetSh : 指定したシート
 *  @return {[values] values (シートに入力された値を格納した２次元配列)}
**/
function getSheetValues(targetSh) {
  const values = targetSh.getDataRange().getValues();
  return values;
}
/** 指定したシートに入力された全ての値を別のシートにコピーする関数
 *  @param  {[sheet]} originalSheet : コピー元のシート
 *  @param  {[sheet]} targetSheet : コピー先のシート
 *  @return {[void] シートの値のみがコピーされる)}
**/
function copyOnlyContentsSh2Sh(originalSheet, targetSheet) {
  const rangeOriginal = originalSheet.getDataRange();
  const rangeTarget = targetSheet.getRange(1, 1, rangeOriginal.getHeight(), rangeOriginal.getWidth());
  targetSheet.clearContents();
  rangeOriginal.copyTo(rangeTarget, { contentsOnly: true });
}
/** 指定したシートの始点と終点のセルを２次元配列として取得する関数
 *  @param  {[sheet]} targetSh : 指定したシート
 *  @param  {[cell]} pointStart : 始点セル[row, col]
 *  @param  {[cell]} pointEnd : 終点セル[row, col]
 *  @return {[values] values (始点と終点のセル内の値を格納した２次元配列)}
**/
function getRangeValues(targetSh, pointStart, pointEnd) {
  const values = targetSh.getRange(pointStart[0], pointStart[1], 1 + pointEnd[0] - pointStart[0], 1 + pointEnd[1] - pointStart[1]).getValues();
  return values;
}
/** 指定したシートに始点セルを起点として指定した２次元配列の値を入力する関数
 *  @param  {[sheet]} targetSh : 指定したシート
 *  @param  {[cell]} pointStart : 始点セル[row, col]
 *  @param  {[values]} values : 入力したい値を格納した"２次元"配列
 *  @return {[void] 指定したシートに値が入力される}
**/
function setValues2Cells(targetSh, pointStart, values) {
  if (values == "") {
    Logger.log("setValues2Cells：エラー");
    return;
  } else if (values[0][0] == undefined) {
    Logger.log("setValues2Cells：エラー");
    return;
  }
  targetSh.getRange(pointStart[0], pointStart[1], values.length, values[0].length).setValues(values);
}

/** 指定したシートに指定した２次元配列の値を始点セルを起点として"一列"に入力する関数
 *  @param  {[sheet]} targetSh : 指定したシート
 *  @param  {[cell]} pointStart : 始点セル[row, col]
 *  @param  {[values]} values : 入力したい値を格納した"２次元"配列
 *  @return {[void] 指定したシートに値が入力される}
**/
function setValuesAsALine(targetSh, pointStart, values) {
  if (values[0] == undefined || values == []) {
    return;
  }
  let linedValues = [];
  linedValues.push([]);
  values.forEach(function (line) {
    line.forEach(function (val) {
      linedValues[0].push(val);
    });
  });
  targetSh.getRange(pointStart[0], pointStart[1], 1, linedValues[0].length).setValues(linedValues);
}
/** CSVファイルの内容を、指定したスプレッドシートのシートにコピーする関数
 *  @param  {[ID]} IDCSV : 指定したCSVファイルのID
 *  @param  {[sheet]} targetSh : コピー先のスプシ内のシート
 *  @return {[void] CSVファイルの内容がシートに出力される}
**/
function importCSV2SheetAsShiftJIS(IDCSV, targetSh) {
  const file = DriveApp.getFileById(IDCSV);
  const data = file.getBlob().getDataAsString("Shift_JIS");
  const valsCSV = Utilities.parseCsv(data);
  targetSh.getRange(1, 1, valsCSV.length, valsCSV[0].length).setValues(valsCSV);
  //  Browser.msgBox(file.getName());
}
/** 指定したシートの指定した列を非表示にするビュー切替の関数
 *  @param  {[sheet]} targetSheet : 指定したシート
 *  @param  {[range]} strRange : 非表示に関わる範囲 "A1:W9"
 *  @param  {[values]} valsCol : 非表示にしたい列と列数をセットとして格納した"２次元"配列
 *  @return {[void] 指定したシートに値が入力される}
**/
function changeViewFor(targetSheet, strRange, valsCol) {
  /// 対象のシートレンジを取得 ///
  const targetRange = targetSheet.getRange(strRange);
  /// 範囲を全て表示する ///
  targetSheet.unhideColumn(targetRange);
  /// 表示した範囲の中から繰り返し列を非表示にする ///
  valsCol.forEach(function (valCol) {
    targetSheet.hideColumns(valCol[0], valCol[1]);
  });
}
/** 指定したシートのフィルタを解除する関数
 *  @param  {[sheet]} targetSheet : 指定したシート
 *  @return {[void] 指定したシートにフィルタがある場合、解除される}
**/
function removeFilter(targetSheet) {
  try {
    targetSheet.getFilter().remove();
  }
  catch (e) {
    console.log("（...シートのフィルタの解除を試みましたが、もともとかかってなかったみたいです）")
  }
}