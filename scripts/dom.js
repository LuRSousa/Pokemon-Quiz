const $ = id => document.getElementById(id);

const board = $("board");
const loading = $("loading");
const loadingText = $("loadingText");
const progressFill = $("progressFill");
const answerInput = $("answerInput");
const answerButton = $("answerButton");
const answerForm = $("answerForm");
const message = $("message");
const pendingSettingsMessage = $("pending-settings-message");
const foundStat = $("foundStat");
const timer = $("timer");
const pauseBtn = $("pauseBtn");

const regionalToggle = $("regionalToggle");
const gimmickToggle = $("gimmickToggle");
const otherFormsToggle = $("otherFormsToggle");
const shinyToggle = $("shinyToggle");
const shadowToggle = $("shadowToggle");

const allModeBtn = $("allModeBtn");
const generationSelect = $("generationSelect");
const typeSelect = $("typeSelect");

const newGameBtn = $("newGameBtn");
const giveUpBtn = $("giveUpBtn");

export {
    board,
    loading,
    loadingText,
    progressFill,
    answerInput,
    answerButton,
    answerForm,
    message,
    pendingSettingsMessage,
    foundStat,
    timer,
    regionalToggle,
    gimmickToggle,
    otherFormsToggle,
    shinyToggle,
    shadowToggle,
    pauseBtn,
    allModeBtn,
    generationSelect,
    typeSelect,
    newGameBtn,
    giveUpBtn
};