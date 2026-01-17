(function () {
  function findSectionByTitle(titleText) {
    var candidates = Array.from(document.querySelectorAll("body *"))
      .filter(el => (el.innerText || "").trim() === titleText);

    for (var i = 0; i < candidates.length; i++) {
      var el = candidates[i];
      var block = el;
      for (var up = 0; up < 10 && block; up++) {
        if ((block.tagName === "DIV" || block.tagName === "SECTION") &&
            block.querySelectorAll("input, select, textarea, button").length >= 1) {
          return block;
        }
        block = block.parentElement;
      }
    }
    return null;
  }

  function wrapTwoSectionsSideBySide() {
    var details = findSectionByTitle("פרטי השיבוץ");
    var length = findSectionByTitle("אורך שיבוץ");
    if (!details || !length) return false;

    details.classList.add("km-section-details");
    length.classList.add("km-section-length");

    if (!details.closest(".km-two-col") && !length.closest(".km-two-col")) {
      var wrap = document.createElement("div");
      wrap.className = "km-two-col";
      var parent = details.parentNode;
      parent.insertBefore(wrap, details);
      wrap.appendChild(details);
      wrap.appendChild(length);
    }
    return true;
  }

  function forceLengthSelectsStack() {
    var length = document.querySelector(".km-section-length");
    if (!length) return false;

    // מצא את שני ה-selects בכרטיס "אורך שיבוץ"
    var selects = Array.from(length.querySelectorAll("select"));
    if (selects.length < 2) return false;

    // קח את שני הראשונים (אלה של "שעת התחלה" ו"אורך שיבוץ")
    var s1 = selects[0];
    var s2 = selects[1];

    // מצא את ההורה המשותף הקרוב שלהם
    function commonAncestor(a, b) {
      var set = new Set();
      var cur = a;
      while (cur) { set.add(cur); cur = cur.parentElement; }
      cur = b;
      while (cur) { if (set.has(cur)) return cur; cur = cur.parentElement; }
      return null;
    }

    var ca = commonAncestor(s1, s2);
    if (!ca) return false;

    // נעלה עוד קצת כדי להגיע ל"רואו" שמחזיק אותם (לא הכרטיס כולו)
    var row = ca;
    for (var up = 0; up < 6 && row && row !== length; up++) {
      // אם בתוך האלמנט יש בדיוק 2 selects (או 2-3 שדות), זה כנראה הרואו הנכון
      var count = row.querySelectorAll("select").length;
      if (count === 2 || count === 3) break;
      row = row.parentElement;
    }

    if (!row || row === length) return false;

    // סמן את הרואו כדי שה-CSS יפעל
    row.classList.add("km-length-stack");
    return true;
  }

  var tries = 0;
  var timer = setInterval(function () {
    tries++;

    var ok1 = wrapTwoSectionsSideBySide();
    var ok2 = forceLengthSelectsStack();

    if ((ok1 && ok2) || tries > 80) clearInterval(timer);
  }, 250);
})();
