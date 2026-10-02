import {regionalNames} from "./config.js";

import {prettyName} from "./utils.js";

import {baseSpeciesName} from "./pokemon.js";

import {state} from "./state.js";

import {regionalDisplayPrefixes} from "./config.js";


function classifyForm(entry) {

    const name = entry.name;

    if (entry.default) {
        return "normal";
    }

    if (name.includes("-mega")) {
        return "mega";
    }

    if (
        name.includes("-gmax") ||
        name.includes("-gigantamax") ||
        name.includes("-eternamax")
    ) {
        return "gmax";
    }

    for (const region of regionalNames) {
        if (name.endsWith("-" + region)) {
            return "regional";
        }
    }

    return "other";
}

function formRegion(name) {

    for (const region of regionalNames) {
        if (name.endsWith("-" + region)) {
            return region;
        }
    }

    return null;
}

function formatFormName(entry) {

    const name = entry.name;
    const kind = classifyForm(entry);

    if (kind === "regional") {
        const region = formRegion(name);
        const prefix = regionalDisplayPrefixes[region];
        const species = prettyName(baseSpeciesName(entry));

        return prefix
            ? `${prefix} ${species}`
            : species;
    }

    if (kind === "mega") {
        const base = baseSpeciesName(entry);
        const baseName = prettyName(base);

        if (name.endsWith("-mega-x")) {
            return `Mega ${baseName} X`;
        }

        if (name.endsWith("-mega-y")) {
            return `Mega ${baseName} Y`;
        }

        if (name.endsWith("-mega-z")) {
            return `Mega ${baseName} Z`;
        }

        return `Mega ${baseName}`;
    }

    if (kind === "gmax") {
        if (name.endsWith("-eternamax")) {
            return `Eternamax ${prettyName(baseSpeciesName(entry))}`;
        }

        return `Gigantamax ${prettyName(baseSpeciesName(entry))}`;
    }

    if (name === "zygarde-10") {
        return "Zygarde 10%";
    }

    if (name === "zygarde-50") {
        return "Zygarde 50%";
    }

    if (name === "zygarde-complete") {
        return "Zygarde Complete";
    }

    return prettyName(name);
}

function displayName(entry) {
    return formatFormName(entry);
}

function getFormAnswer(entry) {
    const kind = classifyForm(entry);

    /*
     * Regional Forms
     */
    if (kind === "regional") {
        return state.regional
            ? formatFormName(entry)
            : prettyName(baseSpeciesName(entry));
    }

    /*
     * Pokémon normal
     */
    if (kind === "normal") {
        return prettyName(baseSpeciesName(entry));
    }

    /*
     * Gimmick Forms
     */
    if (kind === "mega" || kind === "gmax") {
        return state.gimmick
            ? formatFormName(entry)
            : prettyName(baseSpeciesName(entry));
    }

    /*
     * Other Forms
     */
    if (kind === "other") {
        return state.otherForms
            ? formatFormName(entry)
            : prettyName(baseSpeciesName(entry));
    }
}


const excludedForms = new Set([
    "magearna-original-mega",
    "meowstic-female-mega",

    "toxtricity-low-key-gmax",

    "zygarde-10-power-construct",
    "zygarde-50-power-construct"
]);

function shouldIncludeEntry(entry) {
    return !excludedForms.has(entry.name);
}

function getCategory(entry) {

    const kind = classifyForm(entry);

    if (kind === "normal") {
        return "pokemon";
    }

    if (kind === "regional") {
        return "regional";
    }

    if (kind === "mega") {
        return "mega";
    }

    if (kind === "gmax") {
        return "gmax";
    }

    return "other";
}

export {
    classifyForm,
    formRegion,
    displayName,
    getFormAnswer,
    shouldIncludeEntry,
    getCategory
};