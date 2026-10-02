import { API } from "./config.js";
import { writeCache, readCache } from "./cache.js";
import { loadingText, progressFill } from "./dom.js";
import { generationForId } from "./utils.js";

async function fetchJSON(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${url}`);
    }

    return response.json();
}

function parseGenerationName(name) {
    if (!name) return null;

    const roman = name
        .replace("generation-", "")
        .toLowerCase();

    const romanValues = {
        i: 1,
        ii: 2,
        iii: 3,
        iv: 4,
        v: 5,
        vi: 6,
        vii: 7,
        viii: 8,
        ix: 9
    };

    return romanValues[roman] || null;
}

async function loadDatabase() {
    const cached = readCache();

    if (
        cached &&
        cached.version === 4 &&
        cached.entries?.length
    ) {
        loadingText.textContent =
            `Loaded ${cached.entries.length.toLocaleString()} Pokémon from local cache.`;

        progressFill.style.width = "100%";

        return cached;
    }

    loadingText.textContent = "Getting Pokémon list...";

    const list = await fetchJSON(
        `${API}/pokemon?limit=2000&offset=0`
    );

    const names = list.results;
    const pokemonData = [];
    const batchSize = 20;

    // --------------------------------------------------
    // Pokémon data
    // --------------------------------------------------

    for (let i = 0; i < names.length; i += batchSize) {
        const batch = names.slice(i, i + batchSize);

        const results = await Promise.all(
            batch.map(resource =>
                fetchJSON(resource.url)
            )
        );

        pokemonData.push(...results);

        const percent =
            Math.round(
                ((i + batch.length) / names.length) * 45
            );

        progressFill.style.width = percent + "%";

        loadingText.textContent =
            `Downloading Pokémon data... ${percent}%`;
    }

    // --------------------------------------------------
    // Form resources
    // --------------------------------------------------

    const formResources = new Map();

    for (const pokemon of pokemonData) {
        for (const form of pokemon.forms || []) {
            if (!form.url) continue;

            formResources.set(
                form.url,
                form.name
            );
        }
    }

    const formEntries =
        Array.from(formResources.entries());

    // --------------------------------------------------
    // Form metadata + version-group URLs
    // --------------------------------------------------

    const formMetadata = new Map();
    const versionGroupResources = new Map();

    for (
        let i = 0;
        i < formEntries.length;
        i += batchSize
    ) {
        const batch =
            formEntries.slice(
                i,
                i + batchSize
            );

        const results = await Promise.all(
            batch.map(([url]) =>
                fetchJSON(url)
            )
        );

        for (const form of results) {
            if (!form.version_group?.url) {
                formMetadata.set(
                    form.name,
                    {
                        formGeneration: null,
                        isMega: Boolean(form.is_mega),
                        versionGroup: null
                    }
                );

                continue;
            }

            versionGroupResources.set(
                form.version_group.url,
                form.version_group.name
            );

            formMetadata.set(
                form.name,
                {
                    formGeneration: null,
                    isMega: Boolean(form.is_mega),
                    versionGroup: form.version_group.name,
                    versionGroupUrl:
                        form.version_group.url
                }
            );
        }

        const percent =
            45 +
            Math.round(
                ((i + batch.length) /
                    formEntries.length) * 20
            );

        progressFill.style.width =
            percent + "%";

        loadingText.textContent =
            `Reading form metadata... ${percent}%`;
    }

    // --------------------------------------------------
    // Version group → generation
    // --------------------------------------------------

    const generationByVersionGroup = new Map();

    const versionGroupEntries =
        Array.from(
            versionGroupResources.entries()
        );

    for (
        let i = 0;
        i < versionGroupEntries.length;
        i += batchSize
    ) {
        const batch =
            versionGroupEntries.slice(
                i,
                i + batchSize
            );

        const results = await Promise.all(
            batch.map(([url]) =>
                fetchJSON(url)
            )
        );

        for (const versionGroup of results) {
            const generationName =
                versionGroup.generation?.name ||
                null;

            const generation =
                parseGenerationName(
                    generationName
                );

            generationByVersionGroup.set(
                versionGroup.name,
                generation
            );
        }

        const percent =
            65 +
            Math.round(
                ((i + batch.length) /
                    versionGroupEntries.length) * 10
            );

        progressFill.style.width =
            percent + "%";

        loadingText.textContent =
            `Resolving form generations... ${percent}%`;
    }

    // --------------------------------------------------
    // Complete form metadata
    // --------------------------------------------------

    for (const metadata of formMetadata.values()) {
        if (!metadata.versionGroup) continue;

        metadata.formGeneration =
            generationByVersionGroup.get(
                metadata.versionGroup
            ) ?? null;
    }

    // --------------------------------------------------
    // Species resources
    // --------------------------------------------------

    const speciesResources = new Map();

    for (const pokemon of pokemonData) {
        const speciesUrl =
            pokemon.species?.url;

        if (!speciesUrl) continue;

        speciesResources.set(
            speciesUrl,
            pokemon.species.name
        );
    }

    const speciesEntries =
        Array.from(
            speciesResources.entries()
        );

    // --------------------------------------------------
    // Regional Pokédex numbers
    // --------------------------------------------------

    const speciesDexData = new Map();

    for (
        let i = 0;
        i < speciesEntries.length;
        i += batchSize
    ) {
        const batch =
            speciesEntries.slice(
                i,
                i + batchSize
            );

        const results = await Promise.all(
            batch.map(([url]) =>
                fetchJSON(url)
            )
        );

        for (const species of results) {
            const regionalDex = {};

            for (
                const dexNumber
                of species.pokedex_numbers || []
            ) {
                const pokedexName =
                    dexNumber.pokedex?.name;

                const entryNumber =
                    dexNumber.entry_number;

                if (
                    !pokedexName ||
                    entryNumber == null
                ) {
                    continue;
                }

                regionalDex[pokedexName] =
                    entryNumber;
            }

            speciesDexData.set(
                species.name,
                regionalDex
            );
        }

        const percent =
            75 +
            Math.round(
                ((i + batch.length) /
                    speciesEntries.length) * 15
            );

        progressFill.style.width =
            percent + "%";

        loadingText.textContent =
            `Reading Pokédex data... ${percent}%`;
    }

    // --------------------------------------------------
    // Build database
    // --------------------------------------------------

    const entries = [];

    for (const pokemon of pokemonData) {
        const defaultForm =
            pokemon.forms?.[0] || null;

        const metadata =
            defaultForm &&
            formMetadata.has(defaultForm.name)
                ? formMetadata.get(
                    defaultForm.name
                )
                : null;

        const regionalDex =
            speciesDexData.get(
                pokemon.species?.name
            ) || {};

        const entry = {
            id: pokemon.id,
            name: pokemon.name,
            species:
                pokemon.species?.name || null,

            default:
                pokemon.is_default,

            types:
                pokemon.types.map(
                    t => t.type.name
                ),

            sprite:
                pokemon.sprites
                    ?.front_default || null,

            generation:
                generationForId(
                    pokemon.id
                ),

            forms:
                pokemon.forms?.map(
                    f => f.name
                ) || [],

            formGeneration:
                metadata?.formGeneration ??
                null,

            isMega:
                metadata?.isMega ??
                false,

            regionalDex
        };

        entries.push(entry);
    }

    entries.sort(
        (a, b) => a.id - b.id
    );

    const database = {
        version: 4,
        created: Date.now(),
        entries
    };

    writeCache(database);

    progressFill.style.width =
        "100%";

    loadingText.textContent =
        `Loaded ${entries.length.toLocaleString()} Pokémon.`;

    return database;
}

export {
    fetchJSON,
    loadDatabase
};