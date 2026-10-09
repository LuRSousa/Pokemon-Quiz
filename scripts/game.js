import { state } from "./state.js";
import {
    answerInput,
    answerButton,
    timer,
    regionalToggle,
    gimmickToggle,
    otherFormsToggle,
    shinyToggle,
    shadowToggle,
    pauseBtn,
    pendingSettingsMessage,
    modeSelect,
    generationControl,
    typeControl,
    inspirationControl,
    colorControl,
    gameControl,
    specialControl,
    generationSelect,
    typeSelect,
    inspirationSelect,
    colorSelect,
    gameSelect,
    specialSelect,
} from "./dom.js";
import {
    buildQuizEntries,
    findDatabaseMatches,
    findQuizEntries,
    findMatchingEntries,
    updateEntrySectionCount,
} from "./quiz.js";
import {
    renderBoard,
    updateStats,
    revealSlot,
    updateSectionComplete
} from "./board.js";
import {
    formatTime,
    getElapsed,
    setMessage
} from "./utils.js";
import { SAVE_KEY } from "./config.js";
import { getFormAnswer } from "./forms.js";
import { normalizeName } from "./utils.js";


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

function updatePauseButton() {
    const canPause =
        state.gameEntries.length > 0 &&
        state.found.size < state.gameEntries.length;

    pauseBtn.disabled = !canPause;
    pauseBtn.textContent = state.paused ? "Resume" : "Pause";
}

function pauseTimer() {
    if (
        state.paused ||
        state.gameEntries.length === 0 ||
        !state.startTime ||
        state.found.size >= state.gameEntries.length
    ) {
        return;
    }

    state.pausedElapsed = getElapsed();
    state.paused = true;

    stopTimer();

    answerInput.disabled = true;
    answerButton.disabled = true;

    updatePauseButton();
    saveGame();
}

function resumeTimer() {
    if (!state.paused) {
        return;
    }

    state.startTime =
        Date.now() - state.pausedElapsed * 1000;

    state.paused = false;

    startTimer();

    answerInput.disabled = false;
    answerButton.disabled = false;

    updatePauseButton();
    saveGame();

    answerInput.focus();
}

function togglePause() {
    if (state.paused) {
        resumeTimer();
    } else {
        pauseTimer();
    }
}

function saveGame() {

    try {

        const save = {
            mode: state.mode,
            generation: state.generation,
            type: state.type,
            inspiration: state.inspiration,
            color: state.color,
            game: state.game,
            special: state.special,

            regional: state.regional,
            gimmick: state.gimmick,
            otherForms: state.otherForms,
            shiny: state.shiny,
            shadow: state.shadow,

            found: Array.from(state.found),

            startTime: state.startTime,
            paused: state.paused,
            pausedElapsed: state.pausedElapsed,

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

function applyFormSettingsImmediately() {

    for (const entry of state.gameEntries) {
        const databaseEntry =
            state.database?.entries?.find(
                pokemon => pokemon.name === entry.apiName
            );

        if (!databaseEntry) {
            continue;
        }

        entry.answer = normalizeName(
            getFormAnswer(databaseEntry)
        );
    }
}


function applyPendingSettings() {
    state.mode = state.pendingMode;
    state.generation = state.pendingGeneration;
    state.type = state.pendingType;

    state.inspiration = state.pendingInspiration;
    state.color = state.pendingColor;
    state.game = state.pendingGame;
    state.special = state.pendingSpecial;

    state.regional = state.pendingRegional;
    state.gimmick = state.pendingGimmick;
    state.otherForms = state.pendingOtherForms;
}



function updateModeControls() {
    const mode = state.pendingMode;

    modeSelect.value = mode;

    generationControl.hidden = mode !== "generation";
    typeControl.hidden = mode !== "type";
    inspirationControl.hidden = mode !== "inspiration";
    colorControl.hidden = mode !== "color";
    gameControl.hidden = mode !== "game";
    specialControl.hidden = mode !== "special";

    generationSelect.value =
        state.pendingGeneration !== null
            ? String(state.pendingGeneration)
            : "";

    typeSelect.value = state.pendingType ?? "";
    inspirationSelect.value = state.pendingInspiration ?? "all";
    colorSelect.value = state.pendingColor ?? "all";
    gameSelect.value = state.pendingGame ?? "all";
    specialSelect.value = state.pendingSpecial ?? "all";

    generationSelect.classList.toggle("active", mode === "generation");
    typeSelect.classList.toggle("active", mode === "type");
    inspirationSelect.classList.toggle("active", mode === "inspiration");
    colorSelect.classList.toggle("active", mode === "color");
    gameSelect.classList.toggle("active", mode === "game");
    specialSelect.classList.toggle("active", mode === "special");

    updatePendingSettingsMessage();
}


function updatePendingSettingsMessage() {
    const hasPendingChanges =
        state.pendingMode !== state.mode ||
        state.pendingGeneration !== state.generation ||
        state.pendingType !== state.type ||
        state.pendingInspiration !== state.inspiration ||
        state.pendingColor !== state.color ||
        state.pendingGame !== state.game ||
        state.pendingSpecial !== state.special ||
        state.pendingRegional !== state.regional ||
        state.pendingGimmick !== state.gimmick ||
        state.pendingOtherForms !== state.otherForms;

    pendingSettingsMessage.hidden = !hasPendingChanges;
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

    state.paused = false;
    state.pausedElapsed = 0;

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
    updatePauseButton();
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

    if (typeof saved.inspiration === "string") {
        state.inspiration = saved.inspiration;
    }

    if (typeof saved.color === "string") {
        state.color = saved.color;
    }

    if (typeof saved.game === "string") {
        state.game = saved.game;
    }

    if (typeof saved.special === "string") {
        state.special = saved.special;
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

    if (typeof saved.shiny === "boolean") {
        state.shiny = saved.shiny;
        shinyToggle.checked = saved.shiny;
    }

    if (typeof saved.shadow === "boolean") {
        state.shadow = saved.shadow;
        shadowToggle.checked = saved.shadow;
    }

    state.paused = saved.paused ?? false;
    state.pausedElapsed = saved.pausedElapsed ?? 0;

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

    state.pendingInspiration = state.inspiration;
    state.pendingColor = state.color;
    state.pendingGame = state.game;
    state.pendingSpecial = state.special;

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

    regionalToggle.checked = state.regional;

    gimmickToggle.checked = state.gimmick;

    otherFormsToggle.checked = state.otherForms;
    shinyToggle.checked = state.shiny;
    shadowToggle.checked = state.shadow;


    answerInput.disabled =
        state.paused ||
        state.gameEntries.length === 0 ||
        state.found.size >= state.gameEntries.length;

    answerButton.disabled = answerInput.disabled;

    if (
        state.gameEntries.length > 0 &&
        state.found.size < state.gameEntries.length
    ) {
        if (state.paused) {
            // Restaura a partida sem iniciar o cronômetro.
            stopTimer();

            timer.textContent =
                formatTime(state.pausedElapsed);

            setMessage("Saved game restored. Game is paused.");
        } else {
            if (state.startTime) {
                startTimer();
            }

            answerInput.focus();

            setMessage("Saved game restored.");
        }
    } else if (
        state.gameEntries.length > 0
    ) {
        stopTimer();

        timer.textContent =
            formatTime(
                state.paused
                    ? state.pausedElapsed
                    : getElapsed()
            );
    }

    updatePauseButton();

    return true;
}

function submitAnswer() {
    if (state.paused) {
        return;
    }

    const raw = answerInput.value.trim();

    if (!raw) {
        return;
    }

    const databaseMatches = findDatabaseMatches(raw);

    if (databaseMatches.length === 0) {
        setMessage(`No match for "${raw}".`, `error`);

        answerInput.select();

        return;
    }

    const quizEntries = findQuizEntries(raw);

    if (quizEntries.length === 0) {
        setMessage("This Pokémon is not part of this quiz.", "error");

        answerInput.select();

        return;
    }

    const matches = findMatchingEntries(raw);

    if (matches.length === 0) {
        setMessage("This Pokémon has already been guessed.", "error");

        answerInput.select();

        return;
    }

    if (state.found.size === 0) {
        startTimer();
        updatePauseButton();
    }

    for (const entry of matches) {
        state.found.add(entry.id);

        entry.found = true;

        updateEntrySectionCount(entry);
        updateSectionComplete(entry);

        const slot = board.querySelector(`[data-entry-id="${CSS.escape(entry.id)}"]`);

        if (slot) {
            revealSlot(slot, entry);
        }
    }

    const names = matches.map(entry => entry.displayName);

    setMessage(names.join(" • "), "success");

    updateStats();
    saveGame();

    answerInput.value = "";

    answerInput.focus();

    if (state.found.size >= state.gameEntries.length) {
        stopTimer();
    }

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

        updateSectionComplete(entry);

        const slot =
            board.querySelector(
                `[data-entry-id="${CSS.escape(entry.id)}"]`
            );

        if (slot) {
            revealSlot(slot, entry);
        }

        updateEntrySectionCount(entry);
    }

    updateStats();

    answerInput.disabled = true;
    answerButton.disabled = true;

    saveGame();
}

function setMode(mode) {
    const validModes = [
        "all",
        "generation",
        "type",
        "inspiration",
        "color",
        "game",
        "special",
    ];

    if (!validModes.includes(mode)) {
        return;
    }

    state.pendingMode = mode;

    updateModeControls();
    updatePendingSettingsMessage();
}

export {
    startTimer,
    stopTimer,
    saveGame,
    readSavedGame,
    clearSavedGame,
    applyPendingSettings,
    applyFormSettingsImmediately,
    updateModeControls,
    updatePendingSettingsMessage,
    resetFoundState,
    createNewGame,
    loadSavedGameIntoState,
    submitAnswer,
    giveUp,
    setMode,
    updatePauseButton,
    pauseTimer,
    resumeTimer,
    togglePause
};