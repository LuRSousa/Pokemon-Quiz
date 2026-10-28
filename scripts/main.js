import { loadDatabase } from "./api.js";
import {
    readSavedGame,
    loadSavedGameIntoState,
    createNewGame,
    updateModeControls
} from "./game.js";

import { state } from "./state.js";

import {
    loading,
    board,
    answerInput,
    answerButton,
    gameSelect
} from "./dom.js";

import { setMessage } from "./utils.js";

import "./events.js";

import { gameOptions } from "./config.js";

function populateGameSelect(entries) {
    const availableVersions = new Set();

    for (const entry of entries) {
        if (!Array.isArray(entry.gameVersions)) {
            continue;
        }

        for (const version of entry.gameVersions) {
            availableVersions.add(version);
        }
    }

    gameSelect.replaceChildren();

    for (const game of gameOptions) {
        if (!availableVersions.has(game.value)) {
            continue;
        }

        gameSelect.add(
            new Option(game.label, game.value)
        );
    }

    gameSelect.selectedIndex = 0;
}

async function initialize() {
    try {
        loading.hidden = false;
        board.innerHTML = "";

        answerInput.disabled = true;
        answerButton.disabled = true;

        setMessage(
            "Loading Pokémon database..."
        );

        const database =
            await loadDatabase();

        state.database =
            database;

        populateGameSelect(database.entries);

        loading.hidden = true;

        const saved =
            readSavedGame();

        if (saved) {
            const restored =
                loadSavedGameIntoState(
                    saved
                );

            if (restored) {
                return;
            }
        }

        updateModeControls();

        createNewGame(true);

    } catch (error) {

        console.error(error);

        loading.hidden = true;

        answerInput.disabled = true;
        answerButton.disabled = true;

        setMessage(
            "Could not load the Pokémon database. " +
            "Check your internet connection and try again.",
            "error"
        );
    }
}


initialize();