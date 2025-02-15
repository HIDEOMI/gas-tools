////////////////////////////////////////////////////////////////////
///////   関数や変数を作成編集した際には必ず説明補足等を乗せること！   ///////
////////////////////////////////////////////////////////////////////
/** slackへメッセージ送信するための関数
 * @param {string} text 送信するメッセージ
 * @param {string} channel 送信するチャンネル
 * @param {string} URLWebhook Webhook URL
 * @return {void}
**/
function postSlack(text, channel, URLWebhook) {
  if (text.indexOf('\\n') !== -1) {  // 改行コード変更
    text.replace('\\n', '\n');
  }
  // payloadの設定
  const payload = {
    'username': "Notification",
    'text': text,
    'channel': channel,
    'icon_emoji': ":ghost:"
  };
  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload),
  };
  // Webhook URL
  const url = URLWebhook;
  UrlFetchApp.fetch(url, options);
}
