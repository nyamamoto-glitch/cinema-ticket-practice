// 料金計算画面の制御（演習版・正常版で共通）
// ページ側で window.APP_BUGS を定義してから読み込みます。
(function () {
  'use strict';
  var bugs = window.APP_BUGS || {};
  var form = document.getElementById('ticket-form');
  var result = document.getElementById('result');

  function yen(n) {
    return n.toLocaleString('ja-JP') + '円';
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var input = {
      age: form.age.value,
      date: form.date.value,
      time: form.time.value,
      member: form.member.value,
      is3d: form.is3d.checked ? 'yes' : 'no',
      count: form.count.value
    };
    var r = window.CinemaPricing.calculatePrice(input, bugs);
    if (r.ok) {
      result.className = 'result ok';
      result.innerHTML =
        '<div>1枚あたりの料金：<strong>' + yen(r.unitPrice) + '</strong></div>' +
        '<div>合計金額：<span class="price">' + yen(r.total) + '</span></div>';
    } else {
      result.className = 'result ng';
      result.innerHTML = '<ul>' + r.errors.map(function (m) {
        return '<li>' + escapeHtml(m) + '</li>';
      }).join('') + '</ul>';
    }
  });

  form.addEventListener('reset', function () {
    result.className = 'result';
    result.innerHTML = '';
  });
})();
