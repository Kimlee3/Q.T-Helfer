const BOARD_EDIT_TOKENS_KEY = 'qt_helper_board_edit_tokens';

function readTokenMap() {
  try {
    return JSON.parse(window.localStorage.getItem(BOARD_EDIT_TOKENS_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeTokenMap(tokens) {
  try {
    window.localStorage.setItem(BOARD_EDIT_TOKENS_KEY, JSON.stringify(tokens));
  } catch {
    // Editing stays unavailable if this browser cannot persist local tokens.
  }
}

export function getBoardEditToken(postId) {
  if (!postId) return '';
  return readTokenMap()[postId] || '';
}

export function saveBoardEditToken(postId, editToken) {
  if (!postId || !editToken) return;
  writeTokenMap({
    ...readTokenMap(),
    [postId]: editToken,
  });
}

export function removeBoardEditToken(postId) {
  if (!postId) return;
  const tokens = readTokenMap();
  delete tokens[postId];
  writeTokenMap(tokens);
}
