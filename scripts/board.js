import { state } from "./state.js";
import {
    board,
    foundStat
} from "./dom.js";
import { getSections } from "./quiz.js";

function createSlot(entry) {

    const slot = document.createElement("div");

    slot.className = "slot";

    if (
        entry.category !== "pokemon" &&
        entry.category !== "regional"
    ) {
        slot.classList.add("form-slot");
    }

    slot.dataset.entryId = entry.id;
    slot.title = "???";

    /*
        Revealed slots receive their image.
    */
    if (state.found.has(entry.id)) {
        revealSlot(slot, entry);
    } else if (state.shadow && entry.sprite) {
        showShadowSlot(slot, entry);
    }

    return slot;
}

function showShadowSlot(slot, entry) {

    const image = document.createElement("img");

    image.src = entry.sprite;
    image.alt = "";
    image.loading = "lazy";
    image.classList.add("shadow-sprite");

    slot.innerHTML = "";
    slot.appendChild(image);
}

function revealSlot(slot, entry) {

    if (slot.classList.contains("revealed")) {
        return;
    }

    slot.classList.add("revealed");
    slot.title = entry.displayName;

    const image = document.createElement("img");

    image.src =
        state.shiny && entry.spriteShiny
            ? entry.spriteShiny
            : entry.sprite || "";
    image.alt = entry.displayName;
    image.loading = "lazy";

    slot.innerHTML = "";
    slot.appendChild(image);
}

const MIN_COLUMN_WIDTH = 220;
const COLUMN_GAP = 14;

const columnOrders = [
    [ // 1 coluna
        ["kanto", "johto", "hoenn", "sinnoh", "unova", "kalos", "alola", "hisui", "galar", "paldea", "Mega Evolutions", "Gigantamax", "Other Forms"]
    ],
    [ // 2 colunas
        ["kanto", "hoenn", "unova", "hisui", "galar", "Mega Evolutions"],
        ["johto", "sinnoh", "kalos", "paldea", "Gigantamax", "Other Forms"]
    ],
    [ // 3 colunas
        ["kanto", "sinnoh", "alola", "Mega Evolutions"],
        ["johto", "unova", "hisui", "galar", "Gigantamax"],
        ["hoenn", "kalos", "paldea", "Other Forms"]
    ],
    [ // 4 colunas
        ["kanto", "unova", "paldea"],
        ["johto", "kalos", "Mega Evolutions", "Other Forms"],
        ["hoenn", "alola", "Gigantamax"],
        ["sinnoh", "hisui", "galar"]
    ],
    [ // 5 colunas
        ["kanto", "kalos", "Mega Evolutions"],
        ["johto", "alola", "Gigantamax"],
        ["hoenn", "hisui", "galar"],
        ["sinnoh", "paldea"],
        ["unova", "Other Forms"]
    ],
    [ // 6 colunas
        ["kanto", "alola"],
        ["johto", "hisui", "galar"],
        ["hoenn", "paldea"],
        ["sinnoh", "Mega Evolutions"],
        ["unova", "Gigantamax"],
        ["kalos", "Other Forms"]
    ]
];

const specialColumnOrders = [
    // 1 coluna
    [
        ["Legendary", "Mythical", "Ultra Beasts", "Paradox", "Mega Evolutions", "Gigantamax", "Other Forms"]
    ],

    // 2 colunas
    [
        ["Legendary", "Ultra Beasts", "Mega Evolutions"],
        ["Mythical", "Paradox", "Gigantamax", "Other Forms"]
    ]

    // 3 colunas
    [
    ["Legendary"],
    ["Mega Evolutions", "Ultra Beasts"],
    ["Gigantamax", "Paradox", "Other Forms"]
    ],

    // 4 colunas
    [
        ["Legendary", "Mega Evolutions"],
        ["Mythical", "Gigantamax"],
        ["Ultra Beasts"],
        ["Paradox", "Other Forms"]
    ],

    // 5 colunas
    [
        ["Legendary"],
        ["Mega Evolutions"],
        ["Mythical", "Ultra Beasts"],
        ["Gigantamax", "Paradox"],
        ["Other Forms"]
    ],

    // 6 colunas
    [
        ["Legendary"],
        ["Mythical", "Ultra Beasts", "Paradox"],
        ["Mega Evolutions"],
        ["Gigantamax"],
        ["Other Forms"]
    ]
];
let currentColumnCount = null;

function getMaxColumns() {
    const board = document.querySelector("#board");

    if (!board) {
        return 1;
    }

    const width = board.clientWidth;

    return Math.max(
        1,
        Math.floor(
            (width + COLUMN_GAP) /
            (MIN_COLUMN_WIDTH + COLUMN_GAP)
        )
    );
}

function getColumnOrder() {
    const columnCount = getMaxColumns();
    const index = Math.min(6, columnCount) - 1;

    if (state.mode === "special") {
        return specialColumnOrders[index];
    }

    return columnOrders[index];
}

function updateResponsiveBoard() {
    const columnCount = getMaxColumns();

    if (columnCount === currentColumnCount) {
        return;
    }

    renderBoard();
}

function renderBoard() {
    board.innerHTML = "";

    board.classList.toggle(
        "special-filter-mode",
        state.mode === "special" &&
        state.special !== "all"
    );

    const sections = getSections();
    const columnOrder = getColumnOrder();
    currentColumnCount = getMaxColumns();

    const columnsContainer = document.createElement("div");
    columnsContainer.className = "board-columns";

    if (
        state.mode === "generation" ||
        (
            state.mode === "special" &&
            state.special !== "all"
        )
    ) {
        const column = document.createElement("div");
        column.className = "board-column";

        for (const section of sections) {
            column.appendChild(createSectionElement(section));
        }

        columnsContainer.appendChild(column);
    } else {
        for (const order of columnOrder) {
            const column = document.createElement("div");
            column.className = "board-column";

            for (const key of order) {
                const section = sections.find(section => {
                    if (section.special) {
                        return section.title === key;
                    }

                    return section.region === key;
                });

                if (!section) continue;

                column.appendChild(createSectionElement(section));
            }

            columnsContainer.appendChild(column);
        }
    }

    board.appendChild(columnsContainer);
}

function createSectionElement(section) {
    const container = document.createElement("section");
    container.className = "generation";

    container.dataset.sectionKey =
        section.id || section.key || section.title;

    if (section.special) {
        container.classList.add("special-section");
    }

    const found = section.entries.filter(
        entry => state.found.has(entry.id)
    ).length;

    if (
        section.entries.length > 0 &&
        found === section.entries.length
    ) {
        container.classList.add("section-complete");
    }

    const title = document.createElement("div");
    title.className = "generation-title";

    if (section.special) {
        title.classList.add("special-title");
    }

    const titleText = document.createElement("span");
    titleText.textContent = section.title;

    const count = document.createElement("span");
    count.className = "generation-count";

    count.dataset.sectionId =
        section.id || section.key || section.title;

    count.textContent =
        `${found} / ${section.entries.length}`;

    title.appendChild(titleText);
    title.appendChild(count);

    const grid = document.createElement("div");
    grid.className = "slot-grid";

    for (const entry of section.entries) {
        grid.appendChild(createSlot(entry));
    }

    container.appendChild(title);
    container.appendChild(grid);

    return container;
}

function updateSectionComplete(entry) {
    const sections = getSections();

    const section = sections.find(section =>
        section.entries.some(item => item.id === entry.id)
    );

    if (!section) return;

    const sectionId =
        section.id ||
        section.key ||
        section.title;

    const container = board.querySelector(
        `[data-section-key="${CSS.escape(sectionId)}"]`
    );

    if (!container) return;

    const found = section.entries.filter(
        item => state.found.has(item.id)
    ).length;

    container.classList.toggle(
        "section-complete",
        section.entries.length > 0 &&
        found === section.entries.length
    );
}

function updateStats() {

    const total = state.gameEntries.length;

    const found = state.gameEntries.filter(
        entry => state.found.has(entry.id)
    ).length;

    foundStat.textContent = `${found} / ${total}`;
}

window.addEventListener(
    "resize",
    updateResponsiveBoard
);

export {
    createSlot,
    showShadowSlot,
    revealSlot,
    renderBoard,
    updateSectionComplete,
    updateStats
};