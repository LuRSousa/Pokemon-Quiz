import {
    formRegion,
    getFormAnswer,
    getCategory,
    displayName
} from "./forms.js";

import { normalizeName } from "./utils.js";
import { generationRegions } from "./config.js";

function baseSpeciesName(entry) {
    if (!entry.species) {
        return entry.name.split("-")[0];
    }

    return entry.species;
}

function getEntryGeneration(entry) {
    if (entry.region === "alola") return 7;
    if (entry.region === "galar") return 8;
    if (entry.region === "hisui") return 8;
    if (entry.region === "paldea") return 9;

    return entry.generation;
}

function getQuizGeneration(entry) {
    return entry.formGeneration ?? entry.generation;
}

function getEntryRegion(entry) {
    const regionalForm = formRegion(entry.name);

    if (regionalForm === "alola") return "alola";
    if (regionalForm === "galar") return "galar";
    if (regionalForm === "hisui") return "hisui";
    if (regionalForm === "paldea") return "paldea";

    const hisuiPokemon = new Set([
        "wyrdeer",
        "kleavor",
        "ursaluna",
        "basculegion",
        "sneasler",
        "overqwil",
        "enamorus"
    ]);

    const baseName = entry.name.split("-")[0];

    if (hisuiPokemon.has(baseName)) {
        return "hisui";
    }

    const generation = getEntryGeneration(entry);

    return generationRegions[generation] || null;
}

function createEntryFromAPI(entry, sectionGeneration) {
    const answer = getFormAnswer(entry);

    return makeQuizEntry(
        entry,
        answer,
        sectionGeneration,
        getCategory(entry)
    );
}

function makeQuizEntry(
    apiEntry,
    answer,
    sectionGeneration,
    category
) {
    const isMegaTatsugiri =
        category === "mega" &&
        (
            apiEntry.name === "tatsugiri-curly-mega" ||
            apiEntry.name === "tatsugiri-droopy-mega" ||
            apiEntry.name === "tatsugiri-stretchy-mega"
        );

    const isMiniorActive =
        apiEntry.name.startsWith("minior-") &&
        !apiEntry.name.endsWith("-meteor");

    const entryId = isMegaTatsugiri
        ? `tatsugiri-mega-${sectionGeneration}-${answer}`
        : isMiniorActive
            ? `minior-active-${sectionGeneration}`
            : `${apiEntry.id}-${category}-${sectionGeneration}-${answer}`;

    return {
        id: entryId,
        pokemonId: apiEntry.id,
        apiName: apiEntry.name,
        displayName: displayName(apiEntry),
        answer: normalizeName(answer),
        sprite: apiEntry.sprite,
        spriteShiny: apiEntry.spriteShiny,
        generation: sectionGeneration,
        region: getEntryRegion(apiEntry),
        regionalDex: apiEntry.regionalDex,
        category,
        found: false
    };
}

export {
    baseSpeciesName,
    getEntryGeneration,
    getQuizGeneration,
    getEntryRegion,
    createEntryFromAPI,
    makeQuizEntry
};