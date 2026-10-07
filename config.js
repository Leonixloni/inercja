/**
 * Runtime configuration for the client application.
 * Keep feature switches and non-secret Firebase identifiers out of UI logic.
 */

export const APP_CONFIG = Object.freeze({
    locale: "pl",
    maxScore: 100_000_000,
    guestSessionKey: "fizyka-tryb-goscia",
    activeUserKey: "fizyka-aktywny-uzytkownik",
    transferProgressKey: "fizyka-postep-do-przeniesienia"
});

export const FEATURE_FLAGS = Object.freeze({
    starsVisible: false
});
