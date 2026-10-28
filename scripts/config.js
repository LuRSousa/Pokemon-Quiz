const API = "https://pokeapi.co/api/v2";

const CACHE_KEY = "pokemonQuizDatabase_v1";
const SAVE_KEY = "pokemonQuizSave_v1";

const generationNames = {
    1: "Kanto",
    2: "Johto",
    3: "Hoenn",
    4: "Sinnoh",
    5: "Unova",
    6: "Kalos",
    7: "Alola",
    8: "Galar",
    9: "Paldea"
};

const generationRanges = {
    1: [1, 151],
    2: [152, 251],
    3: [252, 386],
    4: [387, 493],
    5: [494, 649],
    6: [650, 721],
    7: [722, 809],
    8: [810, 905],
    9: [906, 1025]
};

const generationRegions = {
    1: "kanto",
    2: "johto",
    3: "hoenn",
    4: "sinnoh",
    5: "unova",
    6: "kalos",
    7: "alola",
    8: "galar",
    9: "paldea"
};

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

const regionGenerations = {
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

const regionalDisplayPrefixes = {
    alola: "Alolan",
    galar: "Galarian",
    hisui: "Hisuian",
    paldea: "Paldean"
};

const regionalNames = [
    "alola",
    "galar",
    "hisui",
    "paldea"
];

const megaWords = ["mega"];

const gmaxWords = [
    "gmax",
    "gigantamax"
];

export {
    API,
    CACHE_KEY,
    SAVE_KEY,
    generationNames,
    generationRanges,
    generationRegions,
    regionOrder,
    regionGenerations,
    regionNames,
    regionalDisplayPrefixes,
    regionalNames,
    megaWords,
    gmaxWords
};