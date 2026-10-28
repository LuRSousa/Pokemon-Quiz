const API = "https://pokeapi.co/api/v2";

const CACHE_KEY = "pokemonQuizDatabase_v1";
const SAVE_KEY = "pokemonQuizSave_v1";
const DATABASE_VERSION = 8;

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

const gameOptions = [
    { value: "red", label: "Red" },
    { value: "blue", label: "Blue" },
    { value: "yellow", label: "Yellow" },

    { value: "gold", label: "Gold" },
    { value: "silver", label: "Silver" },
    { value: "crystal", label: "Crystal" },

    { value: "ruby", label: "Ruby" },
    { value: "sapphire", label: "Sapphire" },
    { value: "emerald", label: "Emerald" },
    { value: "firered", label: "FireRed" },
    { value: "leafgreen", label: "LeafGreen" },

    { value: "diamond", label: "Diamond" },
    { value: "pearl", label: "Pearl" },
    { value: "platinum", label: "Platinum" },
    { value: "heartgold", label: "HeartGold" },
    { value: "soulsilver", label: "SoulSilver" },

    { value: "black", label: "Black" },
    { value: "white", label: "White" },
    { value: "black-2", label: "Black 2" },
    { value: "white-2", label: "White 2" },

    { value: "x", label: "X" },
    { value: "y", label: "Y" },
    { value: "omega-ruby", label: "Omega Ruby" },
    { value: "alpha-sapphire", label: "Alpha Sapphire" },

    { value: "sun", label: "Sun" },
    { value: "moon", label: "Moon" },
    { value: "ultra-sun", label: "Ultra Sun" },
    { value: "ultra-moon", label: "Ultra Moon" },

    { value: "lets-go-pikachu", label: "Let's Go, Pikachu!" },
    { value: "lets-go-eevee", label: "Let's Go, Eevee!" },

    { value: "sword", label: "Sword" },
    { value: "shield", label: "Shield" },

    { value: "brilliant-diamond", label: "Brilliant Diamond" },
    { value: "shining-pearl", label: "Shining Pearl" },
    { value: "legends-arceus", label: "Legends: Arceus" },

    { value: "scarlet", label: "Scarlet" },
    { value: "violet", label: "Violet" },
    { value: "legends-za", label: "Legends: Z-A" }
];


const gameAreaGroups = {
    red: [
        {
            name: "Seafoam Islands",
            areas: [
                "seafoam-islands-1f",
                "seafoam-islands-b1f",
                "seafoam-islands-b2f",
                "seafoam-islands-b3f",
                "seafoam-islands-b4f"
            ]
        },
        {
            name: "Pokémon Mansion",
            areas: [
                "pokemon-mansion-1f",
                "pokemon-mansion-2f",
                "pokemon-mansion-3f",
                "pokemon-mansion-b1f"
            ]
        },
        {
            name: "Pokémon Tower",
            areas: [
                "pokemon-tower-3f",
                "pokemon-tower-4f",
                "pokemon-tower-5f",
                "pokemon-tower-6f",
                "pokemon-tower-7f"
            ]
        },
        {
            name: "Mt. Moon",
            areas: [
                "mt-moon-1f",
                "mt-moon-b1f",
                "mt-moon-b2f"
            ]
        },
        {
            name: "Safari Zone",
            areas: [
                "kanto-safari-zone-middle",
                "kanto-safari-zone-area-1-east",
                "kanto-safari-zone-area-2-north",
                "kanto-safari-zone-area-3-west"
            ]
        }
    ]
};


export {
    API,
    CACHE_KEY,
    SAVE_KEY,
    DATABASE_VERSION,
    generationNames,
    generationRanges,
    generationRegions,
    regionOrder,
    regionGenerations,
    regionNames,
    regionalDisplayPrefixes,
    regionalNames,
    megaWords,
    gmaxWords,
    gameOptions,
    gameAreaGroups
};