// 予定の追加・管理・取得をするカレンダーID
var CALENDER_ID = "【※2】";
// グルチャのグループID
var GROUP_ID = "【※３】";

var dateExp = /(\d{2})\/(\d{2})\s(\d{2}):(\d{2})/;
var dayExp = /(\d+)[\/月](\d+)/;
var hourMinExp = /(\d+)[:時](\d+)*/;

/*
 * ボットにイベントが発生したときの（メイン）処理
 */
function doPost(e) {
  var replyToken = JSON.parse(e.postData.contents).events[0].replyToken;
  var lineType = JSON.parse(e.postData.contents).events[0].type
  var userMessage = JSON.parse(e.postData.contents).events[0].message.text;  
  // フォロー、アンフォローイベントは今回無視
  if (typeof replyToken === "undefined" || lineType === "follow" || lineType === "unfollow") {
    return;
  }
  // ボットの状態遷移をtypeという名のキャッシュで管理
  var cache = CacheService.getScriptCache();
  var type = cache.get("type");

  // 状態なし
  if (type === null) {
    // 「予定の追加」メッセージを受け取ったとき
    if (userMessage === "予定の追加") {
      cache.put("type", 1);
      reply(replyToken, "予定の日付を教えてください！\n形式指定：『1/23』『1月23日』\nキャンセル：『やめる』と入力");
    // 「匿名で投稿」メッセージを受け取ったとき
    } else if (userMessage === "匿名で投稿") {
      cache.put("type", 10);
      reply(replyToken, "グルチャに匿名でラインします！投稿内容を教えてください！\nキャンセル：『やめる』と入力");
    // メッセージの投稿に必要なグループIDの取得（後準備で説明）
    } else if (userMessage === "getGroupId") {
      // reply(replyToken, JSON.parse(e.postData.contents).events[0].source.groupId);
    }
  // 状態あり
  } else {
    if (userMessage === "やめる") {
      cache.remove("type");
      reply(replyToken, "キャンセルしました");
      return;
    }

    // 状態1～5は予定の追加、状態10～11は匿名で投稿
    switch(type) {
      // 予定の日付
      case "1":
        var [matched, month, day] = userMessage.match(dayExp);
        cache.put("type", 2);
        cache.put("month", month);
        cache.put("day", day);
        reply(replyToken, "次に開始時刻を教えてください！\n形式指定：『1:23』『12時』『12時34分』\nキャンセル：『やめる』と入力");
        break;
      // 予定の開始時刻
      case "2":
        var [matched, startHour, startMin] = userMessage.match(hourMinExp);
        cache.put("type", 3);
        cache.put("start_hour", startHour);
        if (startMin == null) startMin = "00";
        cache.put("start_min", startMin);
        reply(replyToken, "次に終了時刻を教えてください！\n形式指定：『1:23』『12時』『12時34分』\n\キャンセル：『やめる』と入力");
        break;
      // 予定の終了時刻
      case "3":
        var [matched, endHour, endMin] = userMessage.match(hourMinExp);
        cache.put("type", 4);
        cache.put("end_hour", endHour);
        if (endMin == null) endMin = "00";
        cache.put("end_min", endMin);
        reply(replyToken, "最後に予定の名前を教えてください！\nキャンセル：『やめる』と入力");
        break;
      // 予定の名前
      case "4":
        cache.put("type", 5);
        cache.put("title", userMessage);
        var [title, startDate, endDate] = createEventData(cache);
        reply(replyToken, toEventFormat(title, startDate, endDate) + "\n\nで間違いないでしょうか？よろしければ『はい』を、やり直す場合は『いいえ』と入力してください！");
        break;
      // 予定の確認
      case "5":
        cache.remove("type");
        if (userMessage === "はい") {
          var [title, startDate, endDate] = createEventData(cache);
          CalendarApp.getCalendarById(CALENDER_ID).createEvent(title, startDate, endDate);
          reply(replyToken, "予定を追加しました！");
        } else {
          reply(replyToken, "お手数ですが最初からやり直してください");
        }
        break;

      // 匿名で投稿する内容
      case "10":
        cache.put("type", 11);
        cache.put("post", userMessage);
        var post = createPost(cache);
        reply(replyToken, post + "\n\nで間違いないでしょうか？よろしければ『はい』を、やり直す場合は『いいえ』と入力してください！\nいたずらや誹謗中傷は絶対にやめてください");
        break;
      // 投稿する内容の確認
      case "11":
        cache.remove("type");
        if (userMessage === "はい") {
          var post = createPost(cache);
          pushPost("匿名投稿：\n" + post);
        } else {
          reply(replyToken, "お手数ですが最初からやり直してください");
        }
        cache.remove("post");
        break;
    }
  }
}

/*
 * 追加する予定の日付、開始時刻、終了時刻、名前の作成・保管
 */
function createEventData(cache) {
  var year = new Date().getFullYear();
  var title = cache.get("title");
  var startDate = new Date(year, cache.get("month") - 1, cache.get("day"), cache.get("start_hour"), cache.get("start_min"));
  var endDate = new Date(year, cache.get("month") - 1, cache.get("day"), cache.get("end_hour"), cache.get("end_min"));
  return [title, startDate, endDate];
}

/*
 * 追加する予定の確認のためのフォーマット作成
 */
function toEventFormat(title, startDate, endDate) {
  var start = Utilities.formatDate(startDate, "JST", "MM/dd HH:mm");
  var end = Utilities.formatDate(endDate, "JST", "MM/dd HH:mm");
  var str = title + ": " + start + " ~ " + end;
  return str;
}

/*
 * 匿名で投稿する内容の作成・保管
 */
function createPost(cache){
  var post = cache.get("post");
  return post;
}

/*
 * ボットのメッセージ応答
 */
function reply(replyToken, message) {
  var url = "https://api.line.me/v2/bot/message/reply";
  UrlFetchApp.fetch(url, {
    "headers": {
      "Content-Type": "application/json; charset=UTF-8",
      "Authorization": "Bearer " + CHANNEL_ACCESS_TOKEN,
    },
    "method": "post",
    "payload": JSON.stringify({
      "replyToken": replyToken,
      "messages": [{
        "type": "text",
        "text": message,
      }],
    }),
  });
  return ContentService.createTextOutput(JSON.stringify({"content": "post ok"})).setMimeType(ContentService.MimeType.JSON);
}

/*
 * ボットからのポスト処理
 */
function pushPost(body){
  var url = 'https://api.line.me/v2/bot/message/push';

  // 指定のグルチャにPOSTする
  UrlFetchApp.fetch(url, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'to': GROUP_ID,
      'messages':[{
        'type': 'text',
        'text': body,
      }]
     })
   })
}

/*
 * 通知する予定の取得
 */
function getEvents() {
  var date = new Date();
  date.setDate(date.getDate() + 1);
  var events = CalendarApp.getCalendarById(CALENDER_ID).getEventsForDay(date);

  if (events.length !== 0) {
    var body = "明日の予定は\n";
    events.forEach(function(event) {
      var title = event.getTitle();
      var start = toHHmm(event.getStartTime());
      var end = toHHmm(event.getEndTime());
      body += "＊" + title + ": " + start + " ~ " + end + "\n";
    });
    body += "です！";

    pushPost(body);
  }
}

/*
 * 時刻フォーマットの作成
 */
function toHHmm(date){
  return Utilities.formatDate(date, "JST", "HH:mm");
}