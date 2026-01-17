(function () {
  function findSectionByTitle(titleText) {
    var all = Array.from(document.querySelectorAll("body *"));
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      if (((el.innerText || "").trim()) === titleText) {
        var block = el;
        for (var up = 0; up < 12 && block; up++) {
          if ((block.tagName === "DIV" || block.tagName === "SECTION") &&
              block.querySelectorAll("input, select, textarea, button, [role='combobox']").length >= 1) {
            return block;
          }
          block = block.parentElement;
        }
      }
    }
    return null;
  }

  function ensureTwoColWrap() {
    var details = findSectionByTitle("פרטי השיבוץ");
    var length = findSectionByTitle("אורך שיבוץ");
    if (!details || !length) return false;

    details.classList.add("km-section-details");
    length.classList.add("km-section-length");

    if (details.closest(".km-two-col") || length.closest(".km-two-col")) return true;

    var wrap = document.createElement("div");
    wrap.className = "km-two-col";

    // אורך שיבוץ ימני, פרטי השיבוץ שמאלי (RTL)
    var parent = details.parentNode;
    parent.insertBefore(wrap, details);
    wrap.appendChild(length);
    wrap.appendChild(details);

    return true;
  }

  function wrapFirstTwoFieldsInLength() {
    var length = document.querySelector(".km-section-length");
    if (!length) return false;

    // מוצאים "שדות בחירה": select או combobox
    var controls = Array.from(length.querySelectorAll("select, [role='combobox']"));
    if (controls.length < 2) return false;

    function fieldContainer(ctrl) {
      // מטפסים למעלה עד בלוק שמכיל את השדה ואת ה-label שלו
      var cur = ctrl;
      for (var up = 0; up < 10 && cur && cur !== length; up++) {
        if ((cur.tagName === "DIV" || cur.tagName === "SECTION")) {
          // אם יש פה label + control, זה כמעט תמיד ה"field wrapper"
          var hasLabel = cur.querySelector("label") || cur.querySelector("[class*='label']") || cur.querySelector("span");
          var hasControl = cur.querySelector("select, [role='combobox']");
          if (hasControl && hasLabel) return cur;
        }
        cur = cur.parentElement;
      }
      return ctrl.parentElement || ctrl;
    }

    var f1 = fieldContainer(controls[0]);
    var f2 = fieldContainer(controls[1]);

    // אם כבר עטוף — לא לעשות שוב
    if (f1.parentElement && f1.parentElement.classList && f1.parentElement.classList.contains("km-length-stack")) {
      return true;
    }

    // יוצרים עטיפה חדשה ומכניסים את שני השדות לתוכה
    var wrap = document.createElement("div");
    wrap.className = "km-length-stack";

    // נכניס לפני הראשון ב-DOM
    f1.parentNode.insertBefore(wrap, f1);
    wrap.appendChild(f1);
    wrap.appendChild(f2);

    return true;
  }

  var tries = 0;
  var timer = setInterval(function () {
    tries++;
    var ok1 = ensureTwoColWrap();
    var ok2 = wrapFirstTwoFieldsInLength();
    if ((ok1 && ok2) || tries > 160) clearInterval(timer);
  }, 250);
})();
