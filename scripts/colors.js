// Exceções de cor visual para formas alternativas.
// A PokéAPI fornece a cor da espécie, que nem sempre representa
// a aparência predominante de cada forma regional ou alternativa.

const COLOR_OVERRIDES = {
    // Black
    "raticate-alola": "black",
    "rattata-alola": "black",
    "stunfisk-galar": "black",
    "tauros-paldea-combat": "black",
    "tauros-paldea-blaze": "black",
    "tauros-paldea-aqua": "black",
    "moltres-galar": "black",
    "charizard-mega-x": "black",
    "floette-mega": "black",
    "absol-mega-z": "black",
    "zeraora-mega": "black",

    // Blue
    "necrozma-dawn": "blue",
    "vulpix-alola": "blue",
    "ninetales-alola": "blue",
    "baxcalibur-mega": "blue",
    "castform-rainy": "blue",
    "ogerpon-wellspring-mask": "blue",
    "sandshrew-alola": "blue",
    "sandslash-alola": "blue",
    "darmanitan-zen": "blue",
    "dialga-origin": "blue",

    // Brown
    "wooper-paldea": "brown",
    "castform-sunny": "brown",
    "voltorb-hisui": "brown",
    "electrode-hisui": "brown",
    "meowth-galar": "brown",
    "zapdos-galar": "brown",
    "meloetta-pirouette": "brown",

    // Gray
    "sneasel-hisui": "gray",
    "geodude-alola": "gray",
    "graveler-alola": "gray",
    "golem-alola": "gray",
    "zigzagoon-galar": "gray",
    "gimmighoul-roaming": "gray",
    "ogerpon-cornerstone-mask": "gray",
    "weezing-galar": "gray",
    "linoone-galar": "gray",
    "drampa-mega": "gray",
    "meowth-alola": "gray",
    "persian-alola": "gray",

    // Green
    "grimer-alola": "green",
    "muk-alola": "green",
    "castform-snowy": "green",
    "butterfree-mega": "green",

    // Pink
    "oricorio-pau": "pink",

    // Purple
    "latios-mega": "purple",
    "calyrex-shadow": "purple",
    "mr-mime-galar": "purple",
    "ponyta-galar": "purple",
    "rapidash-galar": "purple",
    "latias-mega": "purple",
    "oricorio-sensu": "purple",
    "morpeko-hangry": "purple",
    "galarian-articuno": "purple",

    // Red
    "decidueye-hisui": "red",
    "growlithe-hisui": "red",
    "arcanine-hisui": "red",
    "heatran-mega": "red",
    "lycanroc-midnight": "red",
    "magearna-mega": "red",
    "magearna-original": "red",
    "oinkologne-female": "brown",
    "ogerpon-hearthflame-mask": "red",
    "cinderace-mega": "red",

    // White
    "necrozma-dusk": "white",
    "necrozma-ultra": "white",
    "calyrex-ice": "white",
    "audino-mega": "white",
    "corsola-galar": "white",
    "braviary-hisui": "white",
    "darumaka-galar": "white",
    "darmanitan-galar": "white",
    "darmanitan-galar-zen": "white",
    "scrafty-mega": "white",

    // Yellow
    "skarmory-mega": "yellow",
    "wormadam-sandy": "yellow",
    "wormadam-trash": "yellow",
    "tatsugiri-stretchy": "yellow",
    "oricorio-pom-pom": "yellow"
};

function getEntryColor(entry) {
    const name = entry?.name ?? entry?.apiName ?? "";

    // As formas ativas de Minior são exibidas como uma única entrada
    // "Minior Active" no quiz.
    if (name.startsWith("minior-") && !name.endsWith("-meteor")) {
        return "pink";
    }

    const overrideName = name.endsWith("-breed")
        ? name.slice(0, -6)
        : name;

    return COLOR_OVERRIDES[name] ?? COLOR_OVERRIDES[overrideName] ?? entry?.color ?? null;
}

export {
    COLOR_OVERRIDES,
    getEntryColor
};
