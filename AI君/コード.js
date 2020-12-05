///////////////////////////////////////////////////////////////////
///////   関数や変数を作成した際には必ず説明補足等を乗せること！   ///////
///////////////////////////////////////////////////////////////////
/////////   定数の定義   /////////
const inf = {
  "アクセストークン": "****",
  "スプシURL": "****",
};

/////////   基本的な関数の定義   /////////
function getMsg(userMsg) {
  console.log("=== メッセージを取得します ===");
  const ss = SpreadsheetApp.openByUrl(inf["スプシURL"]);
  const sheet = ss.getSheetByName("log");
  const valsMsg = sheet.getRange("A2:B").getValues();
  let postMsg = "";
  let num = 2;
  for (const i in valsMsg) {
    const msg = {
      "元": valsMsg[i][0],
      "対応": valsMsg[i][1],
    };
    if(msg["対応"] == "") {
      postMsg = "なるほど";
      sheet.getRange(num, 2).setValue(userMsg);
      break;
    } else if (msg["元"] == userMsg) {
      postMsg = msg["対応"];
      // sheet.getRange(num, 2).clearContent();
      break;
    }
    num++;
  }
  if (postMsg == "") {
    postMsg = "初めて聞いた言葉です";
    sheet.getRange(num, 1).setValue(userMsg);
  }
  return postMsg;
}


/////////   メイン関数の定義   /////////
/** 受信したメッセージをそのまま送信する関数 */
function replyMsg(e) {
  console.log("=== 受信したメッセージをそのまま送信します ===");
  const userMsg = e.message.text;
  const replyToken = e.replyToken;

  const postMsg = getMsg(userMsg);

  /// アクセス先 ///
  const accessURL = "https://api.line.me/v2/bot/message/reply";
  /// アクセストークン ///
  const accessToken = inf["アクセストークン"];
  /// リクエストヘッダ ///
  const headers = {
    'Authorization': 'Bearer ' + accessToken,
    'Content-Type': 'application/json',
  };
  /// POSTデータ ///
  const postData = {
    'replyToken': replyToken,
    'messages': [{
      'type': 'text',
      'text': postMsg,
    }],
  };
  /// オプション ///
  const options = {
    method: "POST",
    headers: headers,
    payload: JSON.stringify(postData),
  };
  /// POSTリクエスト ///
  const response = UrlFetchApp.fetch(accessURL, options);
  // const objContent = Utilities.jsonParse(response);
}