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

    // mark them so CSS can target specifically
    details.classList.add("km-section-details");
    length.classList.add("km-section-length");

    if (details.closest(".km-two-col") || length.closest(".km-two-col")) return true;

    var wrap = document.createElement("div");
    wrap.className = "km-two-col";

    var parent = details.parentNode;
    parent.insertBefore(wrap, details);

    wrap.appendChild(details);
    wrap.appendChild(length);

    return true;
  }

  var tries = 0;
  var timer = setInterval(function () {
    tries++;
    var ok = wrapTwoSectionsSideBySide();
    if (ok || tries > 60) clearInterval(timer);
  }, 250);
})();
