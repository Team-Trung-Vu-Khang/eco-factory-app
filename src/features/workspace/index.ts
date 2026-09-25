const SELECTED_WORKSPACE_KEY = "selected_workspace_id";

// TODO: replace with the real workspace feature (store + switcher)
export function getSelectedWorkspaceIdFromStorage(): string | null {
  return localStorage.getItem(SELECTED_WORKSPACE_KEY);
}
