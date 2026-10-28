function baseSpeciesName(entry) {
    if (entry.species) {
        return entry.species;
    }

    if (typeof entry.name !== "string" || !entry.name) {
        return "";
    }

    return entry.name.split("-")[0];
}

export {
    baseSpeciesName
};