(function () {
  document.documentElement.setAttribute("data-km-js", "on");

  function findSectionByTitle(titleText) {
    var candidates = Array.from(document.querySelectorAll("body *"))
      .filter(el => (el.innerText || "").trim() === titleText);

    for (var i = 0; i < candidates.length; i++) {
      var el = candidates[i];
      var block = el;
      for (var up = 0; up < 12 && block; up++) {
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

    // wrapper already exists?
    if (details.closest(".km-two-col") || length.closest(".km-two-col")) return true;

    var wrap = document.createElement("div");
    wrap.className = "km-two-col";

    // IMPORTANT: keep original order like you asked:
    // "אורך שיבוץ" on the RIGHT, "פרטי השיבוץ" on the LEFT in RTL
    // We'll insert LENGTH first, then DETAILS.
    var parent = details.parentNode;
    parent.insertBefore(wrap, details);
    wrap.appendChild(length);
    wrap.appendChild(details);

    return true;
  }

  function findFieldContainerByLabelText(root, labelIncludes) {
    // Find a label/span/div that contains the label text
    var nodes = Array.from(root.querySelectorAll("label, span, div, p"))
      .filter(n => (n.innerText || "").trim().includes(labelIncludes));

    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];

      // Walk up to a container that actually holds an input/select
      var cur = n;
      for (var up = 0; up < 10 && cur && cur !== root; up++) {
        var hasControl = cur.querySelector && cur.querySelector("select, input, textarea");
        if ((cur.tagName === "DIV" || cur.tagName === "SECTION") && hasControl) {
          return cur;
        }
        cur = cur.parentElement;
      }
    }
    return null;
  }

  function stackLengthFields() {
    var length = document.querySelector(".km-section-length");
    if (!length) return false;

    // Find the two field containers by their Hebrew labels
    var fStart = findFieldContainerByLabelText(length, "בחר שעת התחלה");
    var fDur = findFieldContainerByLabelText(length, "בחר את אורך השיבוץ");

    // fallback: sometimes label text is slightly different
    if (!fDur) fDur = findFieldContainerByLabelText(length, "בחר את אורך");
    if (!fStart) fStart = findFieldContainerByLabelText(length, "שעת התחלה");

    if (!fStart || !fDur) return false;

    // If already stacked, stop
    if (fStart.parentElement && fStart.parentElement.classList && fStart.parentElement.classList.contains("km-length-stack")) {
      return true;
    }

    // Create a wrapper and insert it before the first field (by DOM order)
    var wrap = document.createElement("div");
    wrap.className = "km-length-stack";

    // Determine which appears first
    var first = fStart;
    var second = fDur;

    // If duration appears before start in DOM, swap
    if (fDur.compareDocumentPosition(fStart) & Node.DOCUMENT_POSITION_FOLLOWING) {
      first = fDur;
      second = fStart;
    }

    first.parentNode.insertBefore(wrap, first);
    wrap.appendChild(first);
    wrap.appendChild(second);

    return true;
  }

  var tries = 0;
  var timer = setInterval(function () {
    tries++;

    var ok1 = ensureTwoColWrap();
    var ok2 = stackLengthFields();

    if ((ok1 && ok2) || tries > 120) clearInterval(timer);
  }, 250);
})();
