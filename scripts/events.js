import { state } from "./state.js";
import {
    answerInput,
    answerForm,
    allModeBtn,
    generationSelect,
    typeSelect,
    regionalToggle,
    gimmickToggle,
    otherFormsToggle,
    shinyToggle,
    shadowToggle,
    newGameBtn,
    giveUpBtn,
    pauseBtn,
} from "./dom.js";
import {
    createNewGame,
    applyFormSettingsImmediately,
    giveUp,
    togglePause,
    submitAnswer,
    saveGame,
    updatePendingSettingsMessage,
    updateModeControls
} from "./game.js";
import { renderBoard } from "./board.js";

allModeBtn.addEventListener(
    "click",
    () => {
        state.pendingMode = "all";
        state.pendingGeneration = null;
        state.pendingType = null;

        generationSelect.value = "";
        typeSelect.value = "";

        updateModeControls();
    }
);

answerForm.addEventListener("submit", event => {
    event.preventDefault();
    submitAnswer();
});

pauseBtn.addEventListener("click", () => {
    togglePause();
});

generationSelect.addEventListener(
    "change",
    () => {
        const value = generationSelect.value;

        if (!value) {
            return;
        }

        state.pendingMode = "generation";
        state.pendingGeneration = Number(value);
        state.pendingType = null;

        typeSelect.value = "";

        updateModeControls();
    }
);

typeSelect.addEventListener(
    "change",
    () => {
        const value = typeSelect.value;

        if (!value) {
            return;
        }

        state.pendingMode = "type";
        state.pendingType = value;
        state.pendingGeneration = null;

        generationSelect.value = "";

        updateModeControls();
    }
);

regionalToggle.addEventListener(
    "change",
    () => {
        state.regional = regionalToggle.checked;
        state.pendingRegional = state.regional;
        applyFormSettingsImmediately();
        renderBoard();
        saveGame();
    }
);

gimmickToggle.addEventListener(
    "change",
    () => {
        state.gimmick = gimmickToggle.checked;
        state.pendingGimmick = state.gimmick;
        applyFormSettingsImmediately();
        renderBoard();
        saveGame();
    }
);

otherFormsToggle.addEventListener(
    "change",
    () => {
        state.otherForms = otherFormsToggle.checked;
        state.pendingOtherForms = state.otherForms;
        applyFormSettingsImmediately();
        renderBoard();
        saveGame();
    }
);

shinyToggle.addEventListener(
    "change",
    () => {
        state.shiny = shinyToggle.checked;
        renderBoard();
        saveGame();
    }
);

shadowToggle.addEventListener(
    "change",
    () => {
        state.shadow = shadowToggle.checked;
        renderBoard();
        saveGame();
    }
);

newGameBtn.addEventListener(
    "click",
    () => {
        createNewGame(true);
    }
);

giveUpBtn.addEventListener(
    "click",
    () => {

        const confirmed =
            window.confirm(
                "Are you sure you want to give up?"
            );

        if (!confirmed) {
            return;
        }

        giveUp();
    }
);

document.addEventListener(
    "keydown",
    event => {

        /*
            Press "/" to focus the answer box.
        */

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
    }
);
