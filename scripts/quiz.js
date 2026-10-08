import { state } from "./state.js";

import {
    baseSpeciesName,
    createEntryFromAPI,
    getQuizGeneration,
} from "./pokemon.js";

import {
    shouldIncludeEntry,
    classifyForm,
    formatFormName
} from "./forms.js";

import {
    normalizeName,
    generationForId
} from "./utils.js";

function buildQuizEntries() {

    const entries = state.database?.entries || [];

    const result = [];

    /*
        -------------------------------------------------------
        NORMAL / REGIONAL POKÉMON
        -------------------------------------------------------
    */

    for (const entry of entries) {

        if (!shouldIncludeEntry(entry)) {
            continue;
        }

        const kind = classifyForm(entry);

        /*
            Mega/Gmax/other forms are displayed in the
            special section instead of the generation
            columns.
        */
        if (
            kind === "mega" ||
            kind === "gmax" ||
            kind === "other"
        ) {
            continue;
        }

        const generation = getQuizGeneration(entry);

        if (!generation) {
            continue;
        }

        /*
            In Generation mode, only the selected generation
            is included.
        */
        if (
            state.mode === "generation" &&
            generation !== state.generation
        ) {
            continue;
        }

        /*
            Type filtering applies to the Pokémon's actual
            API types.
        */
        if (
            state.mode === "type" &&
            !entry.types.includes(state.type)
        ) {
            continue;
        }

        const quizEntry = createEntryFromAPI(
            entry,
            generation
        );

        result.push(quizEntry);
    }


    /*
        -------------------------------------------------------
        SPECIAL FORMS
        -------------------------------------------------------
    */
    for (const entry of entries) {

        const kind = classifyForm(entry);

        if (
            kind !== "mega" &&
            kind !== "gmax" &&
            kind !== "other"
        ) {
            continue;
        }

        if (!shouldIncludeEntry(entry)) {
            continue;
        }

        /*
            Special forms are not restricted to a
            generation column. They appear in the
            corresponding special section.
        */
        let generation = getQuizGeneration(entry);

        if (!generation) {
            generation = generationForId(entry.id);
        }

        /*
            If we cannot determine the generation from
            the form itself, use the base species generation.
        */
        if (!generation) {

            const base = entries.find(item =>
                item.name === baseSpeciesName(entry) &&
                classifyForm(item) === "normal"
            );

            if (base) {
                generation = generationForId(base.id);
            }
        }

        if (!generation) {
            generation = 1;
        }

        /*
            Generation and type modes still filter special
            forms according to their base Pokémon.
        */
        if (
            state.mode === "generation" &&
            generation !== state.generation
        ) {
            continue;
        }

        if (
            state.mode === "type" &&
            !entry.types.includes(state.type)
        ) {
            continue;
        }

        result.push(
            createEntryFromAPI(
                entry,
                generation
            )
        );
    }


    /*
        -------------------------------------------------------
        REMOVE DUPLICATES
        -------------------------------------------------------

        This is particularly important when Regional Forms
        are disabled.

        Example:

            Diglett
            Alolan Diglett

        both become "diglett", but they remain two different
        board slots. We therefore deduplicate only identical
        Pokémon/form records, not identical answers.
    */

    const unique = new Map();

    for (const entry of result) {

        if (!unique.has(entry.id)) {
            unique.set(entry.id, entry);
        }
    }

    return Array.from(unique.values());
}

function findDatabaseMatches(answer) {
    const normalized = normalizeName(answer);

    if (!normalized) {
        return [];
    }

    const entries = state.database?.entries || [];

    return entries.filter(entry => {
        const names = new Set();

        names.add(normalizeName(formatFormName(entry)));

        names.add(normalizeName(baseSpeciesName(entry)));

        return names.has(normalized);
    });
}

function findQuizEntries(answer) {
    const normalized = normalizeName(answer);

    if (!normalized) {
        return [];
    }

    return state.gameEntries.filter(
        entry => entry.answer === normalized
    );
}

function findMatchingEntries(answer) {
    const normalized = normalizeName(answer);

    if (!normalized) {
        return [];
    }

    return state.gameEntries.filter(
        entry =>
            !state.found.has(entry.id) &&
            entry.answer === normalized
    );
}

function getNationalDexNumber(entry) {
    return entry.regionalDex?.national ?? Infinity;
}

function getRegionalDexNumber(entry, region) {
    const dex = entry.regionalDex;

    if (!dex) return Infinity;

    const dexNames = {
        kanto: ["kanto"],
        johto: ["updated-johto", "original-johto"],
        hoenn: ["hoenn"],
        sinnoh: ["original-sinnoh"],
        unova: ["updated-unova", "original-unova"],
        kalos: ["kalos-central", "kalos-coastal", "kalos-mountain"],
        alola: ["updated-alola", "original-alola"],
        galar: ["galar"],
        hisui: ["hisui"],
        paldea: ["paldea"]
    };

    const possibleDexes =
        dexNames[region] || [];

    for (const dexName of possibleDexes) {
        if (dex[dexName] != null) {
            return dex[dexName];
        }
    }

    return Infinity;
}

function compareRegionalEntries(a, b, region) {
    const dexA = getNationalDexNumber(a);
    const dexB = getNationalDexNumber(b);

    if (dexA !== dexB) {
        return dexA - dexB;
    }

    // Quando a forma normal e uma forma regional
    // possuem o mesmo Pokémon na National Dex,
    // a forma normal aparece primeiro.
    if (a.category !== b.category) {
        const order = {
            pokemon: 0,
            regional: 1
        };

        return (
            (order[a.category] ?? 99) -
            (order[b.category] ?? 99)
        );
    }

    return a.id.localeCompare(b.id);
}

function getSections() {

    const sections = [];

    const regionOrder = [
        "kanto",
        "johto",
        "hoenn",
        "sinnoh",
        "unova",
        "kalos",
        "alola",
        "galar",
        "hisui",
        "paldea"
    ];

    const regionGeneration = {
        kanto: 1,
        johto: 2,
        hoenn: 3,
        sinnoh: 4,
        unova: 5,
        kalos: 6,
        alola: 7,
        galar: 8,
        hisui: 8,
        paldea: 9
    };

    const regionNames = {
        kanto: "Kanto",
        johto: "Johto",
        hoenn: "Hoenn",
        sinnoh: "Sinnoh",
        unova: "Unova",
        kalos: "Kalos",
        alola: "Alola",
        galar: "Galar",
        hisui: "Hisui",
        paldea: "Paldea"
    };

    for (const region of regionOrder) {

        const generation = regionGeneration[region];

        if (
            state.mode === "generation" &&
            generation !== state.generation
        ) {
            continue;
        }

        const entries = state.gameEntries.filter(
            entry =>
                entry.region === region &&
                (
                    entry.category === "pokemon" ||
                    entry.category === "regional"
                )
        );

        entries.sort(
            (a, b) => compareRegionalEntries(a, b, region)
        );

        if (entries.length === 0) {
            continue;
        }

        sections.push({
            generation,
            region,
            title: regionNames[region],
            entries
        });
    }

    /*
        Special forms remain separate from the regional sections.
    */

    const megaEntries = state.gameEntries.filter(
        entry => entry.category === "mega"
    );

    const gmaxEntries = state.gameEntries.filter(
        entry => entry.category === "gmax"
    );

    const otherEntries = state.gameEntries.filter(
        entry => entry.category === "other"
    );

    if (megaEntries.length > 0) {
        sections.push({
            special: true,
            specialType: "mega",
            title: "Mega Evolutions",
            entries: megaEntries
        });
    }

    if (gmaxEntries.length > 0) {
        sections.push({
            special: true,
            specialType: "gmax",
            title: "Gigantamax",
            entries: gmaxEntries
        });
    }

    if (otherEntries.length > 0) {
        sections.push({
            special: true,
            specialType: "other",
            title: "Other Forms",
            entries: otherEntries
        });
    }

    return sections;
}

function updateEntrySectionCount(entry) {
    const sections = getSections();

    const section = sections.find(section =>
        section.entries.some(item => item.id === entry.id)
    );

    if (!section) {
        return;
    }

    const sectionId =
        section.id ||
        section.key ||
        section.title;

    const counter = document.querySelector(
        `[data-section-id="${sectionId}"]`
    );

    if (!counter) {
        return;
    }

    const found = section.entries.filter(
        item => state.found.has(item.id)
    ).length;

    counter.textContent =
        `${found} / ${section.entries.length}`;
}

export {
    buildQuizEntries,
    findDatabaseMatches,
    findQuizEntries,
    findMatchingEntries,
    getSections,
    updateEntrySectionCount
};