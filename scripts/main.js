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
    answerButton
} from "./dom.js";

import { setMessage } from "./utils.js";

import "./events.js";

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