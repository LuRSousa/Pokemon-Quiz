
import { state } from "./state.js";
import {
    answerInput,
    answerForm,
    modeSelect,
    generationSelect,
    typeSelect,
    inspirationSelect,
    colorSelect,
    gameSelect,
    specialSelect,
    regionalToggle,
    gimmickToggle,
    otherFormsToggle,
    shinyToggle,
    shadowToggle,
    newGameBtn,
    giveUpBtn,
    pauseBtn,
    completionModal,
    completionCloseBtn,
    completionNewGameBtn
} from "./dom.js";

import {
    createNewGame,
    applyFormSettingsImmediately,
    giveUp,
    togglePause,
    submitAnswer,
    saveGame,
    updatePendingSettingsMessage,
    updateModeControls,
} from "./game.js";

import { renderBoard } from "./board.js";

function selectPendingMode(mode) {
    state.pendingMode = mode;
    modeSelect.value = mode;
    updateModeControls();
    updatePendingSettingsMessage();
}

modeSelect.addEventListener("change", () => {
    selectPendingMode(modeSelect.value);
});

generationSelect.addEventListener("change", () => {
    state.pendingGeneration = generationSelect.value
        ? Number(generationSelect.value)
        : null;

    selectPendingMode("generation");
});

typeSelect.addEventListener("change", () => {
    state.pendingType = typeSelect.value || null;
    selectPendingMode("type");
});

inspirationSelect.addEventListener("change", () => {
    state.pendingInspiration = inspirationSelect.value;
    selectPendingMode("inspiration");
});

colorSelect.addEventListener("change", () => {
    state.pendingColor = colorSelect.value;
    selectPendingMode("color");
});

gameSelect.addEventListener("change", () => {
    state.pendingGame = gameSelect.value;
    selectPendingMode("game");
});

specialSelect.addEventListener("change", () => {
    state.pendingSpecial = specialSelect.value;
    selectPendingMode("special");
});

answerForm.addEventListener("submit", event => {
    event.preventDefault();
    submitAnswer();
});

pauseBtn.addEventListener("click", () => {
    togglePause();
});

regionalToggle.addEventListener("change", () => {
    state.regional = regionalToggle.checked;
    state.pendingRegional = state.regional;

    applyFormSettingsImmediately();
    renderBoard();
    saveGame();
    updatePendingSettingsMessage();
});

gimmickToggle.addEventListener("change", () => {
    state.gimmick = gimmickToggle.checked;
    state.pendingGimmick = state.gimmick;

    applyFormSettingsImmediately();
    renderBoard();
    saveGame();
    updatePendingSettingsMessage();
});

otherFormsToggle.addEventListener("change", () => {
    state.otherForms = otherFormsToggle.checked;
    state.pendingOtherForms = state.otherForms;

    applyFormSettingsImmediately();
    renderBoard();
    saveGame();
    updatePendingSettingsMessage();
});

shinyToggle.addEventListener("change", () => {
    state.shiny = shinyToggle.checked;
    renderBoard();
    saveGame();
});

shadowToggle.addEventListener("change", () => {
    state.shadow = shadowToggle.checked;
    renderBoard();
    saveGame();
});

newGameBtn.addEventListener("click", () => {
    createNewGame(true);
});

giveUpBtn.addEventListener("click", () => {
  const confirmed = confirm("Are you sure you want to give up? This will end the current game and reveal all remaining Pokémon.");

  if (!confirmed) return;

  giveUp();
});

// Fecha o modal sem reiniciar a partida.
completionCloseBtn.addEventListener("click", () => {
    completionModal.hidden = true;
});

// Inicia uma nova partida pelo fluxo existente.
completionNewGameBtn.addEventListener("click", () => {
    completionModal.hidden = true;
    createNewGame(true);
});

// Fecha somente quando o clique acontece no fundo do modal.
completionModal.addEventListener("click", event => {
    if (event.target === completionModal) {
        completionModal.hidden = true;
    }
});

document.addEventListener("keydown", event => {
    if (
        event.key === "/" &&
        document.activeElement !== answerInput &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.metaKey
    ) {
        event.preventDefault();
        answerInput.focus();
    }
});