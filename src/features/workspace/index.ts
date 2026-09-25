/** Same key eco-shared-ui's layout writes when the user picks a workspace */
export const SELECTED_WORKSPACE_STORAGE_KEY = "admin_selected_workspace";

export function getSelectedWorkspaceIdFromStorage(): string | null {
  const value = sessionStorage.getItem(SELECTED_WORKSPACE_STORAGE_KEY);
  return value || null;
}
