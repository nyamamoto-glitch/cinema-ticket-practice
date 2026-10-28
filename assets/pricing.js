/*
 * さくらシネマ チケット料金計算ロジック（テスト演習用）
 *
 * calculatePrice(input, bugs) の bugs に { B1: true, ... } を渡すと、
 * 対応するバグが有効になります。正常版は bugs を空にして呼び出します。
 * 各バグの内容は docs/answers.md を参照してください。
 */
(function (global) {
  'use strict';

  var BUG_IDS = ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8'];

  var MEMBER_ALIASES = {
    none: 'none', 'なし': 'none', '': 'none',
    regular: 'regular', '一般会員': 'regular', '一般': 'regular',
    premium: 'premium', 'プレミアム会員': 'premium', 'プレミアム': 'premium'
  };

  var THREE_D_ALIASES = {
    yes: true, true: true, '1': true, 'する': true, 'あり': true, '有': true, 'on': true,
    no: false, false: false, '0': false, 'しない': false, 'なし': false, '無': false, 'off': false, '': false
  };

  function str(v) {
    return v === undefined || v === null ? '' : String(v).trim();
  }

  function parseIntStrict(v) {
    var s = str(v);
    if (!/^\d+$/.test(s)) return NaN;
    return parseInt(s, 10);
  }

  // "YYYY-MM-DD" を検証して Date（ローカル時刻）を返す。不正なら null
  function parseDate(v) {
    var m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(str(v).replace(/\//g, '-'));
    if (!m) return null;
    var y = +m[1], mo = +m[2], d = +m[3];
    var date = new Date(y, mo - 1, d);
    if (date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== d) return null;
    return date;
  }

  // "HH:MM" を検証して 0時からの分数を返す。不正なら NaN
  function parseTime(v) {
    var m = /^(\d{1,2}):(\d{2})$/.exec(str(v));
    if (!m) return NaN;
    var h = +m[1], mi = +m[2];
    if (h > 23 || mi > 59) return NaN;
    return h * 60 + mi;
  }

  function calculatePrice(input, bugs) {
    bugs = bugs || {};
    input = input || {};
    var errors = [];

    // ---- 入力チェック ----
    var age = parseIntStrict(input.age);
    if (isNaN(age) || age < 0 || age > 120) {
      errors.push('年齢は0〜120の整数で入力してください。');
    }

    var date = parseDate(input.date);
    if (!date) {
      errors.push('鑑賞日を正しく入力してください。');
    }

    var time = parseTime(input.time);
    if (isNaN(time) || time < 9 * 60 || time > 23 * 60) {
      errors.push('上映開始時刻は09:00〜23:00の範囲で入力してください。');
    }

    var memberKey = str(input.member).toLowerCase();
    var member = Object.prototype.hasOwnProperty.call(MEMBER_ALIASES, memberKey) ? MEMBER_ALIASES[memberKey] : null;
    if (member === null) {
      errors.push('会員区分を選択してください。');
    }

    var is3dKey = str(input.is3d).toLowerCase();
    var is3d = Object.prototype.hasOwnProperty.call(THREE_D_ALIASES, is3dKey) ? THREE_D_ALIASES[is3dKey] : null;
    if (is3d === null) {
      errors.push('3D上映の指定が正しくありません。');
    }

    var count = parseIntStrict(input.count);
    var countMax = bugs.B3 ? 9 : 10; // B3
    if (isNaN(count) || count < 1 || count > countMax) {
      errors.push('枚数は1〜10の整数で入力してください。');
    }

    if (errors.length > 0) {
      return { ok: false, errors: errors };
    }

    // ---- 2-1. 年齢区分による基本料金 ----
    var childMax = bugs.B1 ? 11 : 12; // B1
    var category, base;
    if (age <= 2) { category = '幼児'; base = 0; }
    else if (age <= childMax) { category = '子ども'; base = 1000; }
    else if (age <= 17) { category = '中高生'; base = 1400; }
    else if (age <= 64) { category = '一般'; base = 2000; }
    else { category = 'シニア'; base = 1300; }

    var unit;
    if (category === '幼児') {
      // 幼児は常に無料
      unit = 0;
      if (bugs.B6 && is3d) unit = 400; // B6
    } else {
      // ---- 2-2. 特別料金 ----
      var isMovieDay = bugs.B8
        ? date.getDay() === 1   // B8
        : date.getDate() === 1;
      var lateStart = 20 * 60;
      var isLate = bugs.B2 ? time > lateStart : time >= lateStart; // B2

      unit = base;
      if (isMovieDay) unit = Math.min(unit, 1200);
      if (bugs.B4) {
        // B4
        if (isLate) unit = 1500;
      } else {
        if (isLate && category === '一般') unit = Math.min(unit, 1500);
      }

      // ---- 2-3. 会員割引 ----
      var dow = date.getDay(); // 0=日 ... 6=土
      var lastWeekday = bugs.B5 ? 6 : 5; // B5
      var isWeekday = dow >= 1 && dow <= lastWeekday;
      var memberDiscount = 0;
      if (member === 'premium') memberDiscount = 300;
      if (member === 'regular' && isWeekday) memberDiscount = 200;
      if (bugs.B7 && isMovieDay) memberDiscount = 0; // B7
      unit = Math.max(0, unit - memberDiscount);

      // ---- 2-4. 3D上映料金 ----
      if (is3d) unit += 400;
    }

    // ---- 2-5. 合計金額 ----
    var total = unit * count;
    if (count >= 5) total = Math.floor(total * 9 / 10);

    return { ok: true, unitPrice: unit, total: total, category: category };
  }

  var api = { calculatePrice: calculatePrice, BUG_IDS: BUG_IDS };
  global.CinemaPricing = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : this);
