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

const POKEMON_COLORS = [
    "black",
    "blue",
    "brown",
    "gray",
    "green",
    "pink",
    "purple",
    "red",
    "white",
    "yellow"
];

const COLOR_NAMES = {
    black: "Black",
    blue: "Blue",
    brown: "Brown",
    gray: "Gray",
    green: "Green",
    pink: "Pink",
    purple: "Purple",
    red: "Red",
    white: "White",
    yellow: "Yellow"
};
const ULTRA_BEASTS = new Set([
    "nihilego",
    "buzzwole",
    "pheromosa",
    "xurkitree",
    "celesteela",
    "kartana",
    "guzzlord",
    "poipole",
    "naganadel",
    "stakataka",
    "blacephalon"
].map(normalizeName));

const PARADOX_POKEMON = new Set([
    "great-tusk",
    "scream-tail",
    "brute-bonnet",
    "flutter-mane",
    "slither-wing",
    "sandy-shocks",
    "roaring-moon",
    "walking-wake",
    "gouging-fire",
    "raging-bolt",
    "koraidon",
    "iron-treads",
    "iron-bundle",
    "iron-hands",
    "iron-jugulis",
    "iron-moth",
    "iron-thorns",
    "iron-valiant",
    "iron-leaves",
    "iron-boulder",
    "iron-crown",
    "miraidon"
].map(normalizeName));

function matchesSpecialCategory(entry, kind = classifyForm(entry)) {
    const speciesName = normalizeName(
        entry.species || baseSpeciesName(entry) || entry.name
    );

    const isUltraBeast = ULTRA_BEASTS.has(speciesName);
    const isParadox = PARADOX_POKEMON.has(speciesName);
    const isMega = kind === "mega";
    const isGmax = kind === "gmax";

    switch (state.special) {
        case "all":
            return (
                entry.isLegendary === true ||
                entry.isMythical === true ||
                isUltraBeast ||
                isParadox ||
                isMega ||
                isGmax
            );

        case "legendary":
            return entry.isLegendary === true;

        case "mythical":
            return entry.isMythical === true;

        case "ultra":
            return isUltraBeast;

        case "paradox":
            return isParadox;

        case "mega":
            return isMega;

        case "gmax":
            return isGmax;

        default:
            return false;
    }
}

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

        if (
            state.mode === "special" &&
            !matchesSpecialCategory(entry, kind)
        ) {
            continue;
        }

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

        if (
            state.mode === "color" &&
            entry.color !== state.color
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

        if (
            state.mode === "color" &&
            entry.color !== state.color
        ) {
            continue;
        }

        if (
            state.mode === "special" &&
            !matchesSpecialCategory(entry, kind)
        ) {
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
        alola: ["original-alola"],
        galar: ["galar"],
        hisui: ["hisui"],
        paldea: ["paldea"]
    };

    const possibleDexes = dexNames[region];

    // Kanto até Kalos: usar a National Dex.
    if (!possibleDexes) {
        return dex.national ?? Infinity;
    }

    for (const dexName of possibleDexes) {
        if (dex[dexName] != null) {
            return dex[dexName];
        }
    }

    return Infinity;
}

function compareRegionalEntries(a, b, region) {
    const dexA = getRegionalDexNumber(a, region);
    const dexB = getRegionalDexNumber(b, region);

    // Primeiro: ordem da Pokédex regional de referência.
    if (dexA !== dexB) {
        return dexA - dexB;
    }

    // Se ambos não possuem número regional, usar a National Dex.
    if (dexA === Infinity && dexB === Infinity) {
        const nationalA = getNationalDexNumber(a);
        const nationalB = getNationalDexNumber(b);

        if (nationalA !== nationalB) {
            return nationalA - nationalB;
        }
    }

    // No mesmo número regional, a forma normal vem primeiro.
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

    // Desempate final.
    return a.id.localeCompare(b.id);
}


function getBaseSpeciesKey(entry) {
    return normalizeName(
        entry.species ||
        (entry.name ? baseSpeciesName(entry) : "")
    );
}

function isGimmickEntry(entry) {
    const name = normalizeName(entry.name || "");
    const category = entry.category;

    return (
        category === "mega" ||
        category === "gmax" ||
        name.includes("eternamax")
    );
}

function getSections() {
    const sections = [];

    if (state.mode === "color") {
        for (const region of [
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
        ]) {
            const generationByRegion = {
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

            const entries = state.gameEntries.filter(
                entry =>
                    entry.color === state.color &&
                    entry.region === region &&
                    (
                        entry.category === "pokemon" ||
                        entry.category === "regional"
                    )
            );

            entries.sort(
                (a, b) => compareRegionalEntries(a, b, region)
            );

            if (entries.length > 0) {
                sections.push({
                    generation: generationByRegion[region],
                    region,
                    title: regionNames[region],
                    entries
                });
            }
        }

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

    // Special mode: organize by category, not by region.
    if (state.mode === "special") {
        const specialCategories = [
            {
                key: "legendary",
                title: "Legendary",
                matches: entry =>
                    entry.isLegendary === true &&
                    entry.category !== "mega" &&
                    entry.category !== "gmax" &&
                    entry.category !== "other"
            },
            {
                key: "mythical",
                title: "Mythical",
                matches: entry =>
                    entry.isMythical === true &&
                    entry.category !== "mega" &&
                    entry.category !== "gmax" &&
                    entry.category !== "other"
            },
            {
                key: "ultra",
                title: "Ultra Beasts",
                matches: entry =>
                    ULTRA_BEASTS.has(
                        normalizeName(
                            entry.species ||
                            (entry.name ? baseSpeciesName(entry) : "")
                        )
                    ) &&
                    entry.category !== "mega" &&
                    entry.category !== "gmax"
            },
            {
                key: "paradox",
                title: "Paradox",
                matches: entry =>
                    PARADOX_POKEMON.has(
                        normalizeName(
                            entry.species ||
                            (entry.name ? baseSpeciesName(entry) : "")
                        )
                    ) &&
                    !["koraidon", "miraidon"].includes(
                        normalizeName(
                            entry.species ||
                            (entry.name ? baseSpeciesName(entry) : "")
                        )
                    ) &&
                    entry.category !== "mega" &&
                    entry.category !== "gmax" &&
                    entry.category !== "other"
            },
            {
                key: "mega",
                title: "Mega Evolutions",
                matches: entry => entry.category === "mega"
            },
            {
                key: "gmax",
                title: "Gigantamax",
                matches: entry => entry.category === "gmax"
            },
            {
                key: "other",
                title: "Other Forms",
                matches: entry => entry.category === "other"
            }
        ];

        for (const category of specialCategories) {
            if (
                state.special !== "all" &&
                state.special !== category.key &&
                category.key !== "other"
            ) {
                continue;
            }

            const entries = state.gameEntries.filter(
                category.matches
            );

            if (category.key === "legendary") {
                entries.sort((a, b) => {
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

                    const regionA = regionOrder.indexOf(a.region);
                    const regionB = regionOrder.indexOf(b.region);

                    const indexA = regionA === -1
                        ? regionOrder.length
                        : regionA;

                    const indexB = regionB === -1
                        ? regionOrder.length
                        : regionB;

                    return indexA - indexB;
                });
            }

            if (entries.length === 0) {
                continue;
            }

            sections.push({
                special: true,
                specialType: category.key,
                title: category.title,
                entries
            });
        }

        const gimmickCategories = [
            "legendary",
            "mythical",
            "ultra",
            "paradox"
        ];

        if (gimmickCategories.includes(state.special)) {
            const selectedSection = sections.find(
                section => section.specialType === state.special
            );

            if (selectedSection) {
                const baseSpecies = new Set(
                    selectedSection.entries.map(getBaseSpeciesKey)
                );

                const gimmickEntries = state.gameEntries.filter(entry => {
                    if (!isGimmickEntry(entry)) {
                        return false;
                    }

                    return baseSpecies.has(getBaseSpeciesKey(entry));
                });

                if (gimmickEntries.length > 0) {
                    const gimmickSection = {
                        special: true,
                        specialType: "gimmicks",
                        title: "Gimmicks",
                        entries: gimmickEntries
                    };

                    // Coloca Gimmicks antes de Other Forms.
                    const otherFormsIndex = sections.findIndex(
                        section => section.specialType === "other"
                    );

                    if (otherFormsIndex >= 0) {
                        sections.splice(
                            otherFormsIndex,
                            0,
                            gimmickSection
                        );
                    } else {
                        sections.push(gimmickSection);
                    }
                }
            }
        }

        return sections;
    }

    // Existing regional organization for All Pokémon,
    // Generation and Type modes.
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