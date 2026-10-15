const state = {
    database: null,
    gameEntries: [],
    found: new Set(),
    
    mode: "all",
    generation: "1",
    type: "normal",
    inspiration: "all",
    color: "black",
    game: "all",
    special: "all",

    regional: true,
    gimmick: true,
    otherForms: true,
    shiny: false,
    shadow: false,

    pendingMode: "all",
    pendingGeneration: "1",
    pendingType: "normal",
    pendingInspiration: "all",
    pendingColor: "black",
    pendingGame: "all",
    pendingSpecial: "all",

    pendingRegional: true,
    pendingGimmick: true,
    pendingOtherForms: true,

    startTime: null,
    timerId: null,
    paused: false,
    pausedElapsed: 0,

    finished: false,
    endReason: null,
    elapsedAtEnd: null
};

export {
    state
};