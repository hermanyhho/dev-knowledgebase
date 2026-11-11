const codeDialog = document.getElementById("code-dialog");
const codeDialogTitle = document.getElementById("code-dialog-title");
const codeDialogFiles = codeDialog.querySelector(".dialog-files");
const languageStorageKey = "code-language";
let currentLanguage = "ts";
let openedTarget = null;

function fileBlocksForNode(nodeName) {
  return [...document.querySelectorAll(`.code-store .file[data-node="${nodeName}"]`)]
    .filter((fileBlock) => fileBlock.dataset.lang === currentLanguage || fileBlock.dataset.lang === "any");
}

function renderDialog() {
  const fileBlocks = fileBlocksForNode(openedTarget.nodeName);
  codeDialogTitle.textContent = openedTarget.title ?? fileBlocks[0].querySelector(".chip").textContent;
  codeDialogFiles.replaceChildren(...fileBlocks.map((fileBlock) => fileBlock.cloneNode(true)));
}

function openDialog(target) {
  openedTarget = target;
  renderDialog();
  codeDialog.showModal();
}

function setLanguage(language) {
  currentLanguage = language;
  document.body.dataset.codeLang = language;
  document.querySelectorAll(".lang-switch button").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.lang === language));
  });
  if (codeDialog.open) renderDialog();
  try { localStorage.setItem(languageStorageKey, language); } catch {}
}

function nodeNameForFile(fileName) {
  return [...document.querySelectorAll(".code-store .file")]
    .find((fileBlock) => fileBlock.querySelector(".name").textContent === fileName)
    .dataset.node;
}

document.querySelectorAll(".diagram .node").forEach((diagramNode) => {
  const target = { nodeName: diagramNode.dataset.node, title: diagramNode.dataset.title };
  diagramNode.addEventListener("click", () => openDialog(target));
  diagramNode.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openDialog(target);
    }
  });
});

document.querySelectorAll(".tree-row").forEach((treeRow) => {
  treeRow.addEventListener("click", () => {
    const nodeName = nodeNameForFile(treeRow.dataset.file);
    const diagramNode = document.querySelector(`.diagram .node[data-node="${nodeName}"]`);
    openDialog({ nodeName, title: diagramNode?.dataset.title });
  });
});

document.querySelectorAll(".lang-switch button").forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});

document.getElementById("code-dialog-close").addEventListener("click", () => codeDialog.close());
codeDialog.addEventListener("click", (event) => {
  if (event.target === codeDialog) codeDialog.close();
});

function setUpFlowPlayer(flowPlayer) {
  const diagram = document.querySelector(".diagram");
  const flowPickerButtons = [...flowPlayer.querySelectorAll(".flow-picker button")];
  let steps = [...flowPlayer.querySelector(".flow-steps").querySelectorAll("li")];
  const caption = flowPlayer.querySelector(".flow-caption");
  const idleCaption = [...caption.childNodes];
  const playButton = flowPlayer.querySelector(".flow-play");
  const backButton = flowPlayer.querySelector(".flow-back");
  const nextButton = flowPlayer.querySelector(".flow-next");
  const resetButton = flowPlayer.querySelector(".flow-reset");
  const secondsPerStep = 2.4;
  let currentStepIndex = -1;
  let autoplayTimer = null;

  function diagramElementsFor(step) {
    return step.dataset.highlight.split(" ").map((elementId) => document.getElementById(elementId));
  }

  function clearHighlights() {
    diagram.querySelectorAll(".is-lit, .was-lit, .is-shown").forEach((element) => element.classList.remove("is-lit", "was-lit", "is-shown"));
  }

  function showStep(stepIndex) {
    currentStepIndex = stepIndex;
    clearHighlights();
    diagram.classList.add("flow-active");
    steps.slice(0, stepIndex).forEach((step) => diagramElementsFor(step).forEach((element) => element.classList.add("was-lit")));
    diagramElementsFor(steps[stepIndex]).forEach((element) => element.classList.add("is-lit"));
    (steps[stepIndex].dataset.show ?? "").split(" ").filter(Boolean).forEach((elementId) => document.getElementById(elementId).classList.add("is-shown"));

    const stepLabel = document.createElement("strong");
    stepLabel.textContent = `Step ${stepIndex + 1} of ${steps.length}. `;
    caption.replaceChildren(stepLabel, ...[...steps[stepIndex].childNodes].map((node) => node.cloneNode(true)));

    backButton.disabled = stepIndex === 0;
    nextButton.disabled = stepIndex === steps.length - 1;
    resetButton.disabled = false;
  }

  function stopAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
    playButton.textContent = "Play";
  }

  function startAutoplay() {
    const isAtLastStep = currentStepIndex === steps.length - 1;
    showStep(currentStepIndex === -1 || isAtLastStep ? 0 : currentStepIndex + 1);
    playButton.textContent = "Pause";
    autoplayTimer = setInterval(() => {
      if (currentStepIndex === steps.length - 1) return stopAutoplay();
      showStep(currentStepIndex + 1);
    }, secondsPerStep * 1000);
  }

  function reset() {
    stopAutoplay();
    clearHighlights();
    diagram.classList.remove("flow-active");
    currentStepIndex = -1;
    caption.replaceChildren(...idleCaption);
    backButton.disabled = true;
    nextButton.disabled = false;
    resetButton.disabled = true;
  }

  playButton.addEventListener("click", () => (autoplayTimer ? stopAutoplay() : startAutoplay()));
  nextButton.addEventListener("click", () => { stopAutoplay(); showStep(currentStepIndex + 1); });
  backButton.addEventListener("click", () => { stopAutoplay(); showStep(currentStepIndex - 1); });
  resetButton.addEventListener("click", reset);

  flowPickerButtons.forEach((pickerButton) => {
    pickerButton.addEventListener("click", () => {
      flowPickerButtons.forEach((otherButton) => otherButton.setAttribute("aria-pressed", String(otherButton === pickerButton)));
      steps = [...flowPlayer.querySelector(`.flow-steps[data-flow="${pickerButton.dataset.flow}"]`).querySelectorAll("li")];
      reset();
    });
  });
}

document.querySelectorAll(".flow-player").forEach(setUpFlowPlayer);

let savedLanguage = null;
try { savedLanguage = localStorage.getItem(languageStorageKey); } catch {}
setLanguage(savedLanguage === "cs" ? "cs" : "ts");

const glossaryScriptUrl = new URL("glossary.js", document.currentScript.src);
const glossaryExcludedAreas = "pre, svg, a, h1, h2, h3, button, .code-store, .flow-steps, .tree, .legend, .term";

function escapeForPattern(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function patternForTerm(glossaryTerm) {
  const isCaseSensitive = glossaryTerm.forms.some((form) => /[A-Z]/.test(form));
  const alternatives = [...glossaryTerm.forms]
    .sort((first, second) => second.length - first.length)
    .map((form) => (/^\d+$/.test(form) ? `${form}(?=\\s[A-Z]|$)` : escapeForPattern(form)))
    .join("|");
  return new RegExp(`(?<![\\w-])(?:${alternatives})(?![\\w-])`, isCaseSensitive ? "" : "i");
}

function isDefinedInTermsTable(glossaryTerm) {
  const forms = glossaryTerm.forms.map((form) => form.toLowerCase());
  const definitionTables = [...document.querySelectorAll("table.terms")].filter((table) => table.querySelector("th")?.textContent.trim() === "Term");
  return definitionTables.some((table) =>
    [...table.querySelectorAll("td:first-child")].some((cell) => forms.includes(cell.textContent.trim().toLowerCase())));
}

function createTermMark(glossaryTerm) {
  const termMark = document.createElement("span");
  termMark.className = "term";
  termMark.tabIndex = 0;
  termMark.dataset.term = glossaryTerm.forms[0];
  termMark.dataset.definition = glossaryTerm.definition;
  return termMark;
}

const pageFolderName = location.pathname.split("/").filter((segment) => segment && !segment.endsWith(".html")).at(-1);

function markFirstMention(glossaryTerm) {
  if (glossaryTerm.onlyOn && !glossaryTerm.onlyOn.includes(pageFolderName)) return;
  const pattern = patternForTerm(glossaryTerm);
  if (isDefinedInTermsTable(glossaryTerm)) return;

  const textWalker = document.createTreeWalker(document.querySelector("main"), NodeFilter.SHOW_TEXT);
  for (let textNode = textWalker.nextNode(); textNode; textNode = textWalker.nextNode()) {
    if (textNode.parentElement.closest(glossaryExcludedAreas)) continue;
    const match = pattern.exec(textNode.textContent);
    if (!match) continue;

    const codeElement = textNode.parentElement.closest("code");
    if (codeElement) {
      if (codeElement.textContent.trim() !== match[0]) continue;
      const termMark = createTermMark(glossaryTerm);
      codeElement.replaceWith(termMark);
      termMark.append(codeElement);
      return;
    }

    const matchedText = textNode.splitText(match.index);
    matchedText.splitText(match[0].length);
    const termMark = createTermMark(glossaryTerm);
    matchedText.replaceWith(termMark);
    termMark.append(matchedText);
    return;
  }
}

const termTip = document.createElement("div");
termTip.className = "term-tip";
termTip.id = "term-tip";
termTip.setAttribute("role", "tooltip");
termTip.hidden = true;
document.body.append(termTip);

let termMarkWithTip = null;

function placeTermTip() {
  const gap = 8;
  const markBox = termMarkWithTip.getBoundingClientRect();
  const tipBox = termTip.getBoundingClientRect();
  const left = Math.min(Math.max(gap, markBox.left + markBox.width / 2 - tipBox.width / 2), window.innerWidth - tipBox.width - gap);
  const fitsBelow = markBox.bottom + gap + tipBox.height < window.innerHeight;
  termTip.style.left = `${left}px`;
  termTip.style.top = `${fitsBelow ? markBox.bottom + gap : markBox.top - gap - tipBox.height}px`;
}

function showTermTip(termMark) {
  termMarkWithTip = termMark;
  const termName = document.createElement("strong");
  termName.textContent = termMark.dataset.term;
  termTip.replaceChildren(termName, termMark.dataset.definition);
  termTip.hidden = false;
  termMark.setAttribute("aria-describedby", termTip.id);
  placeTermTip();
}

function hideTermTip() {
  termMarkWithTip = null;
  termTip.hidden = true;
  document.querySelectorAll(".term[aria-describedby]").forEach((termMark) => termMark.removeAttribute("aria-describedby"));
}

document.addEventListener("mouseover", (event) => {
  const termMark = event.target.closest(".term");
  if (termMark) showTermTip(termMark);
});
document.addEventListener("mouseout", (event) => {
  if (event.target.closest(".term") && !event.relatedTarget?.closest?.(".term")) hideTermTip();
});
document.addEventListener("focusin", (event) => {
  if (event.target.matches(".term")) showTermTip(event.target);
});
document.addEventListener("focusout", (event) => {
  if (event.target.matches(".term")) hideTermTip();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") hideTermTip();
});
window.addEventListener("scroll", () => {
  if (termMarkWithTip) placeTermTip();
}, { passive: true });

const glossaryScript = document.createElement("script");
glossaryScript.src = glossaryScriptUrl;
function longestFormLength(glossaryTerm) {
  return Math.max(...glossaryTerm.forms.map((form) => form.length));
}

glossaryScript.onload = () => {
  [...window.glossaryTerms].sort((first, second) => longestFormLength(second) - longestFormLength(first)).forEach(markFirstMention);
};
document.body.append(glossaryScript);
