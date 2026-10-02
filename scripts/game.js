import { state } from "./state.js";
import {
    answerInput,
    timer,
    completion,
    regionalToggle,
    gimmickToggle,
    otherFormsToggle,
    allModeBtn,
    generationSelect,
    typeSelect,
    pendingSettingsMessage,
} from "./dom.js";
import {
    buildQuizEntries,
    findMatchingEntries,
    updateEntrySectionCount,
} from "./quiz.js";
import {
    renderBoard,
    updateStats,
    revealSlot
} from "./board.js";
import {
    formatTime,
    getElapsed,
    setMessage
} from "./utils.js";
import {SAVE_KEY} from "./config.js";


function startTimer() {

    if (state.timerId) {
        clearInterval(state.timerId);
    }

    if (!state.startTime) {
        state.startTime = Date.now();
    }

    state.timerId = setInterval(() => {

        timer.textContent =
            formatTime(getElapsed());

    }, 1000);

    timer.textContent =
        formatTime(getElapsed());
}

function stopTimer() {

    if (state.timerId) {
        clearInterval(state.timerId);
        state.timerId = null;
    }
}

function saveGame() {

    try {

        const save = {
            mode: state.mode,
            generation: state.generation,
            type: state.type,

            regional: state.regional,
            gimmick: state.gimmick,
            otherForms: state.otherForms,

            found: Array.from(state.found),

            startTime: state.startTime,

            savedAt: Date.now()
        };

        localStorage.setItem(
            SAVE_KEY,
            JSON.stringify(save)
        );

    } catch (error) {

        console.warn(
            "Could not save game:",
            error
        );
    }
}

function readSavedGame() {

    try {

        const raw =
            localStorage.getItem(SAVE_KEY);

        if (!raw) {
            return null;
        }

        return JSON.parse(raw);

    } catch (error) {

        console.warn(
            "Could not read saved game:",
            error
        );

        return null;
    }
}

function clearSavedGame() {

    try {
        localStorage.removeItem(SAVE_KEY);
    } catch (error) {
        console.warn(
            "Could not clear saved game:",
            error
        );
    }
}

function applyPendingSettings() {
    state.mode = state.pendingMode;
    state.generation = state.pendingGeneration;
    state.type = state.pendingType;

    state.regional = state.pendingRegional;
    state.gimmick = state.pendingGimmick;
    state.otherForms = state.pendingOtherForms;
}

function updateModeControls() {
    allModeBtn.classList.toggle(
        "active",
        state.pendingMode === "all"
    );

    generationSelect.classList.toggle(
        "active",
        state.pendingMode === "generation"
    );

    typeSelect.classList.toggle(
        "active",
        state.pendingMode === "type"
    );
}

function updatePendingSettingsMessage() {
    const hasPendingChanges =
        state.pendingMode !== state.mode ||
        state.pendingGeneration !== state.generation ||
        state.pendingType !== state.type ||
        state.pendingRegional !== state.regional ||
        state.pendingGimmick !== state.gimmick ||
        state.pendingOtherForms !== state.otherForms;

    pendingSettingsMessage.hidden =
        !hasPendingChanges;
}

function resetFoundState() {

    state.found = new Set();

    state.gameEntries.forEach(
        entry => entry.found = false
    );
}

function createNewGame(clearSave = true) {
    stopTimer();
    timer.textContent = "00:00";

    applyPendingSettings();

    updatePendingSettingsMessage();

    state.gameEntries =
        buildQuizEntries();

    resetFoundState();

    state.startTime = null;

    if (clearSave) {
        clearSavedGame();
    }

    renderBoard();
    updateStats();

    completion.hidden = true;

    answerInput.disabled =
        state.gameEntries.length === 0;

    answerButton.disabled =
        state.gameEntries.length === 0;

    answerInput.value = "";

    if (state.gameEntries.length === 0) {

        setMessage(
            "No Pokémon match the selected filters.",
            "error"
        );

    } else {

        setMessage(
            "Type a Pokémon name to begin."
        );

        answerInput.focus();
    }

    saveGame();
}

function loadSavedGameIntoState(saved) {
    if (!saved) {
        return false;
    }

    /*
        Validate the saved configuration.
    */
    if (saved.mode) {
        state.mode = saved.mode;
    }

    if (Number.isInteger(saved.generation)) {
        state.generation =
            saved.generation;
    }

    if (saved.type) {
        state.type =
            saved.type;
    }

    /*
        Restore form settings.
    */

    if (typeof saved.regional === "boolean") {
        state.regional = saved.regional;
        regionalToggle.checked = saved.regional;
    }

    if (typeof saved.gimmick === "boolean") {
        state.gimmick = saved.gimmick;
        gimmickToggle.checked = saved.gimmick;
    }

    if (typeof saved.otherForms === "boolean") {
        state.otherForms = saved.otherForms;
        otherFormsToggle.checked =
            saved.otherForms;
    }

    /*
        Rebuild the board using the saved settings.
    */
    state.gameEntries =
        buildQuizEntries();

    const validIds =
        new Set(
            state.gameEntries.map(
                entry => entry.id
            )
        );

    state.found = new Set(
        Array.isArray(saved.found)
            ? saved.found.filter(
                id => validIds.has(id)
            )
            : []
    );

    state.gameEntries.forEach(entry => {
        entry.found =
            state.found.has(entry.id);
    });

    state.pendingMode = state.mode;
    state.pendingGeneration = state.generation;
    state.pendingType = state.type;
    state.pendingRegional = state.regional;
    state.pendingGimmick = state.gimmick;
    state.pendingOtherForms = state.otherForms;

    /*
        Restore timer.
    */
    if (
        typeof saved.startTime === "number" &&
        saved.startTime > 0
    ) {
        state.startTime =
            saved.startTime;
    } else {
        state.startTime =
            Date.now();
    }

    renderBoard();
    updateStats();

    updateModeControls();

    generationSelect.value =
    state.generation !== null
        ? String(state.generation)
        : "";

    typeSelect.value =
        state.type ?? "";

    regionalToggle.checked = state.regional;

    gimmickToggle.checked = state.gimmick;

    otherFormsToggle.checked = state.otherForms;

    answerInput.disabled =
        state.gameEntries.length === 0 ||
        state.found.size >= state.gameEntries.length;

    answerButton.disabled =
        answerInput.disabled;

    if (
        state.gameEntries.length > 0 &&
        state.found.size < state.gameEntries.length
    ) {
        if (state.startTime) {
            startTimer();
        }

        answerInput.focus();

        setMessage(
            "Saved game restored."
        );
    } else if (
        state.gameEntries.length > 0
    ) {
        stopTimer();
        showCompletion();
    }

    return true;
}

function submitAnswer() {

    const raw =
        answerInput.value.trim();

    if (!raw) {
        return;
    }

    const matches =
        findMatchingEntries(raw);

    if (matches.length === 0) {

        setMessage(
            `No match for "${raw}".`,
            "error"
        );

        answerInput.select();

        return;
    }

    if (state.found.size === 0) {
        startTimer();
    }

    for (const entry of matches) {

        state.found.add(entry.id);
        entry.found = true;

        updateEntrySectionCount(entry);

        const slot =
            board.querySelector(
                `[data-entry-id="${CSS.escape(entry.id)}"]`
            );

        if (slot) {
            revealSlot(slot, entry);
        }
    }

    const names =
        matches.map(
            entry => entry.displayName
        );

    setMessage(
        names.join(" • "),
        "success"
    );

    updateStats();
    saveGame();

    answerInput.value = "";
    answerInput.focus();

    if (
        state.found.size >=
        state.gameEntries.length
    ) {
        stopTimer();
        showCompletion();
    }
}

function showCompletion() {

    if (
        state.gameEntries.length === 0
    ) {
        return;
    }

    const total =
        state.gameEntries.length;

    const found =
        state.found.size;

    if (found < total) {
        completion.hidden = true;
        return;
    }

    stopTimer();

    completion.hidden = false;

    completion.innerHTML = `
        <h2>Quiz Complete</h2>
        <p>
            You found all ${total} Pokémon.
        </p>
        <p>
            Time:
            <strong>${formatTime(getElapsed())}</strong>
        </p>
    `;

    answerInput.disabled = true;
    answerButton.disabled = true;

    saveGame();
}

function giveUp() {
    if (
        state.gameEntries.length === 0 ||
        state.found.size >= state.gameEntries.length
    ) {
        return;
    }

    stopTimer();

    const missed =
        state.gameEntries.filter(
            entry => !state.found.has(entry.id)
        );

    for (const entry of missed) {
        state.found.add(entry.id);
        entry.found = true;

        const slot =
            board.querySelector(
                `[data-entry-id="${CSS.escape(entry.id)}"]`
            );

        if (slot) {
            revealSlot(slot, entry);
        }
    }

    updateStats();

    completion.hidden = false;

    completion.innerHTML = `
        <h2>Quiz Finished</h2>
        <p>
            You gave up.
        </p>
        <p>
            Found:
            <strong>
                ${state.gameEntries.length - missed.length}
                / ${state.gameEntries.length}
            </strong>
        </p>
        <p>
            Missed:
            <strong>${missed.length}</strong>
        </p>
        <p>
            Time:
            <strong>${formatTime(getElapsed())}</strong>
        </p>
    `;

    answerInput.disabled = true;
    answerButton.disabled = true;

    saveGame();
}

function setMode(mode) {

    if (
        mode !== "all" &&
        mode !== "generation" &&
        mode !== "type"
    ) {
        return;
    }

    state.pendingMode = mode;

    updateModeControls();
    updatePendingSettingsMessage();
}

export{
    startTimer,
    stopTimer,
    saveGame,
    readSavedGame,
    clearSavedGame,
    applyPendingSettings,
    updateModeControls,
    updatePendingSettingsMessage,
    resetFoundState,
    createNewGame,
    loadSavedGameIntoState,
    submitAnswer,
    showCompletion,
    giveUp,
    setMode,
};