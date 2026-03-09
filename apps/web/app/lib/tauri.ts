export function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI__' in window;
}

export async function sendNotification(title: string, body: string) {
  if (!isTauri()) return;

  const { invoke } = await import('@tauri-apps/api/core');
  await invoke('send_notification', { title, body });
}

export async function getAppVersion(): Promise<string | null> {
  if (!isTauri()) return null;

  const { invoke } = await import('@tauri-apps/api/core');
  return invoke('get_app_version');
}
