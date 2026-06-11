export function isTauri() {
    return typeof window !== 'undefined' && '__TAURI__' in window;
}
export async function sendNotification(title, body) {
    if (!isTauri())
        return;
    const { invoke } = await import('@tauri-apps/api/core');
    await invoke('send_notification', { title, body });
}
export async function getAppVersion() {
    if (!isTauri())
        return null;
    const { invoke } = await import('@tauri-apps/api/core');
    return invoke('get_app_version');
}
