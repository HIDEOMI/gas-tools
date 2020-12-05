/** 配列を連想配列にして返す関数
 *  @param  {[values]} values : 連想配列にしたい2次元配列(1列目のみ連想配列にする)
 *  @return {[hash] 連想配列 ⇒ key:values[i][0] values:i
**/
function makeHash (values) {
	var targetHash = [];
	for (var i in values) {
		targetHash[values[i][0]] = i;
	}
  return targetHash;
}