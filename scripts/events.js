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
    newGameBtn,
    giveUpBtn,
} from "./dom.js";
import {
    createNewGame,
    giveUp,
    submitAnswer,
    updatePendingSettingsMessage,
    updateModeControls
} from "./game.js";

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
        state.pendingRegional = regionalToggle.checked;
        updatePendingSettingsMessage();
    }
);

gimmickToggle.addEventListener(
    "change",
    () => {
        state.pendingGimmick = gimmickToggle.checked;
        updatePendingSettingsMessage();
    }
);

otherFormsToggle.addEventListener(
    "change",
    () => {
        state.pendingOtherForms = otherFormsToggle.checked;
        updatePendingSettingsMessage();
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
