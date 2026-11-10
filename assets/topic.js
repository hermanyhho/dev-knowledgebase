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
  const steps = [...flowPlayer.querySelectorAll(".flow-steps li")];
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
    diagram.querySelectorAll(".is-lit, .was-lit").forEach((element) => element.classList.remove("is-lit", "was-lit"));
  }

  function showStep(stepIndex) {
    currentStepIndex = stepIndex;
    clearHighlights();
    diagram.classList.add("flow-active");
    steps.slice(0, stepIndex).forEach((step) => diagramElementsFor(step).forEach((element) => element.classList.add("was-lit")));
    diagramElementsFor(steps[stepIndex]).forEach((element) => element.classList.add("is-lit"));

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
}

document.querySelectorAll(".flow-player").forEach(setUpFlowPlayer);

let savedLanguage = null;
try { savedLanguage = localStorage.getItem(languageStorageKey); } catch {}
setLanguage(savedLanguage === "cs" ? "cs" : "ts");
