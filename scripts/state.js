const state = {
    database: null,
    gameEntries: [],
    found: new Set(),

    // Configuração atual do jogo
    mode: "all",
    generation: null,
    type: null,
    inspiration: "all",
    color: "all",
    game: "all",
    special: "all",

    regional: true,
    gimmick: true,
    otherForms: true,
    shiny: false,
    shadow: false,

    // Configuração selecionada na interface,
    // mas ainda não aplicada ao jogo
    pendingMode: "all",
    pendingGeneration: null,
    pendingType: null,
    pendingInspiration: "all",
    pendingColor: "all",
    pendingGame: "all",
    pendingSpecial: "all",

    pendingRegional: true,
    pendingGimmick: true,
    pendingOtherForms: true,

    startTime: null,
    timerId: null,
    paused: false,
    pausedElapsed: 0
};

export {
    state
};