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

  function ensureTwoColWrap() {
    var details = findSectionByTitle("פרטי השיבוץ");
    var length = findSectionByTitle("אורך שיבוץ");
    if (!details || !length) return false;

    details.classList.add("km-section-details");
    length.classList.add("km-section-length");

    if (!details.closest(".km-two-col") && !length.closest(".km-two-col")) {
      var wrap = document.createElement("div");
      wrap.className = "km-two-col";
      var parent = details.parentNode;

      // keep original DOM order: details first, length second
      parent.insertBefore(wrap, details);
      wrap.appendChild(details);
      wrap.appendChild(length);
    }
    return true;
  }

  function markLengthRowToStack() {
    var length = document.querySelector(".km-section-length");
    if (!length) return false;

    var selects = Array.from(length.querySelectorAll("select"));
    if (selects.length < 2) return false;

    // find a container that holds exactly 2 selects and looks like a "row"
    function findRow(el) {
      var cur = el;
      for (var up = 0; up < 10 && cur && cur !== length; up++) {
        var selCount = cur.querySelectorAll("select").length;
        var directBlocks = Array.from(cur.children).filter(c => c.offsetParent !== null);
        if (selCount === 2 && directBlocks.length >= 2) return cur;
        cur = cur.parentElement;
      }
      return null;
    }

    var row = findRow(selects[0]) || findRow(selects[1]);
    if (!row) return false;

    row.classList.add("km-length-stack");
    return true;
  }

  var tries = 0;
  var timer = setInterval(function () {
    tries++;
    var ok1 = ensureTwoColWrap();
    var ok2 = markLengthRowToStack();
    if ((ok1 && ok2) || tries > 80) clearInterval(timer);
  }, 250);
})();
