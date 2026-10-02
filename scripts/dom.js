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
const completion = $("completion");

const regionalToggle = $("regionalToggle");
const gimmickToggle = $("gimmickToggle");
const otherFormsToggle = $("otherFormsToggle");

const allModeBtn = $("allModeBtn");
const generationSelect = $("generationSelect");
const typeSelect = $("typeSelect");

const newGameBtn = $("newGameBtn");
const giveUpBtn = $("giveUpBtn");

export{
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
    completion,
    regionalToggle,
    gimmickToggle,
    otherFormsToggle,
    allModeBtn,
    generationSelect,
    typeSelect,
    newGameBtn,
    giveUpBtn
};