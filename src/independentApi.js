// Compatibility barrel. Callers may keep importing independentApi.js.
export {
    API_REQUEST_DIAGNOSTIC_EVENT,
    WORLD_INFO_BOOKS_CHANGED_EVENT,
    getLastIndependentApiRequestDiagnostic,
    getIndependentConnectionProfiles,
    importCurrentSillyTavernConnection,
    getIndependentSavedModels,
    getObservedWorldInfoBooks,
    fetchWorldInfoBooks,
    scanCurrentChatIndependentContextTags,
    getLastIndependentModelListDiagnostic,
    fetchIndependentModels,
    testIndependentConnection,
} from './independentApi/connection.js?rmv=1.6';
export { remeasureRabbitMirrorFaceGeometry, undoRabbitMirrorFaceAutoWidth, repairRabbitMirrorFaceAutoWidth } from './independentApi/geometry.js?rmv=1.6';
export { hydrateIndependentFavoriteHtml } from './independentApi/mount.js?rmv=1.6';
export { listMissingIndependentRetryFloors, resyncMissingIndependentRetryShells } from './independentApi/earlyBody.js?rmv=1.6';
export { refreshRabbitMirrorGenerationMode, initIndependentRabbitMirror, destroyIndependentRabbitMirror } from './independentApi/lifecycle.js?rmv=1.6';
