(function () {
  function findSectionByTitle(titleText) {
    // מחפש אלמנט שמכיל את הטקסט של הכותרת, ואז מטפס לבלוק סקשן
    var candidates = Array.from(document.querySelectorAll("body *"))
      .filter(el => (el.innerText || "").trim() === titleText);

    for (var i = 0; i < candidates.length; i++) {
      var el = candidates[i];
      var block = el;
      for (var up = 0; up < 10 && block; up++) {
        // בלוק סקשן בד"כ מכיל לפחות שדה אחד
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
    var a = findSectionByTitle("אורך שיבוץ");
    var b = findSectionByTitle("פרטי השיבוץ");

    if (!a || !b) return false;

    // אם כבר עטוף – לא לעשות שוב
    if (a.closest(".km-two-col") || b.closest(".km-two-col")) return true;

    // עוטפים אותם יחד בקונטיינר אחד
    var wrap = document.createElement("div");
    wrap.className = "km-two-col";

    // נכניס את ה-wrapper לפני הראשון מביניהם לפי סדר הופעה ב-DOM
    var parent = a.parentNode;
    parent.insertBefore(wrap, a);

    wrap.appendChild(a);
    wrap.appendChild(b);

    return true;
  }

  // אוריגמי נטען דינמית, אז ננסה כמה פעמים
  var tries = 0;
  var timer = setInterval(function () {
    tries++;
    var ok = wrapTwoSectionsSideBySide();
    if (ok || tries > 60) clearInterval(timer);
  }, 250);
})();
