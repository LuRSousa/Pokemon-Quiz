import { generationRanges } from "./config.js";
import { state } from "./state.js";

function normalizeName(value) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[’']/g, "")
        .replace(/[-_]/g, " ")
        .replace(/\s+/g, " ");
}

function prettyName(value) {
    return value
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function isInRange(id, generation) {
    const [min, max] = generationRanges[generation];
    return id >= min && id <= max;
}

function generationForId(id) {
    for (const gen of Object.keys(generationRanges)) {
        if (isInRange(id, Number(gen))) {
            return Number(gen);
        }
    }

    return 9;
}

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    if (h > 0) {
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }

    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function getElapsed() {
    if (!state.startTime) return 0;
    return Math.floor((Date.now() - state.startTime) / 1000);
}

function setMessage(text, type = "") {
    message.textContent = text;
    message.className = "message " + type;
}

export {
    normalizeName,
    prettyName,
    isInRange,
    generationForId,
    formatTime,
    getElapsed,
    setMessage
};