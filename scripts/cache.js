import { CACHE_KEY } from "./config.js";

function readCache() {
    try {
        const raw = localStorage.getItem(CACHE_KEY);

        if (!raw) return null;

        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function writeCache(data) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (error) {
        console.warn("Could not cache database:", error);
    }
}

export{
    readCache,
    writeCache
};