#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
    AppHandle, Manager,
    menu::{Menu, MenuItem, PredefinedMenuItem},
    tray::{TrayIconBuilder, TrayIconEvent, MouseButton, MouseButtonState},
};
use tauri_plugin_autostart::MacosLauncher;
use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut, ShortcutState};

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(
            tauri_plugin_global_shortcut::Builder::new()
                .with_handler(|app, shortcut, event| {
                    if event.state() != ShortcutState::Pressed {
                        return;
                    }
                    handle_global_shortcut(app, shortcut);
                })
                .build(),
        )
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            Some(vec!["--hidden"]),
        ))
        .setup(|app| {
            // Build system tray menu
            let open = MenuItem::with_id(app, "open", "Open Sheetz Labs OS", true, None::<&str>)?;
            let sep1 = PredefinedMenuItem::separator(app)?;
            let quick_capture = MenuItem::with_id(app, "quick_capture", "Quick Capture  ⌘⇧N", true, None::<&str>)?;
            let command_palette = MenuItem::with_id(app, "command_palette", "Command Palette  ⌘⇧K", true, None::<&str>)?;
            let sep2 = PredefinedMenuItem::separator(app)?;
            let dashboard = MenuItem::with_id(app, "dashboard", "Dashboard", true, None::<&str>)?;
            let inbox = MenuItem::with_id(app, "inbox", "Inbox", true, None::<&str>)?;
            let tasks = MenuItem::with_id(app, "tasks", "Tasks", true, None::<&str>)?;
            let chat = MenuItem::with_id(app, "chat", "Chat", true, None::<&str>)?;
            let sep3 = PredefinedMenuItem::separator(app)?;
            let quit = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;

            let menu = Menu::with_items(app, &[
                &open, &sep1,
                &quick_capture, &command_palette,
                &sep2,
                &dashboard, &inbox, &tasks, &chat,
                &sep3, &quit,
            ])?;

            // Build tray icon (embed PNG at compile time to avoid missing-resource panic)
            let tray_icon = tauri::image::Image::from_bytes(
                include_bytes!("../icons/tray.png")
            ).map_err(|e| format!("failed to load tray icon: {e}"))?;

            TrayIconBuilder::new()
                .icon(tray_icon)
                .menu(&menu)
                .show_menu_on_left_click(false)
                .on_menu_event(|app, event| {
                    handle_tray_menu_click(app, event.id.as_ref());
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        show_main_window(app);
                    }
                })
                .build(app)?;

            // Register global shortcuts
            app.global_shortcut().register("CmdOrCtrl+Shift+K")?;
            app.global_shortcut().register("CmdOrCtrl+Shift+N")?;

            Ok(())
        })
        .on_window_event(|window, event| {
            // Hide to tray instead of closing
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                let _ = window.hide();
                api.prevent_close();
            }
        })
        .invoke_handler(tauri::generate_handler![
            send_notification,
            get_app_version,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn handle_global_shortcut(app: &AppHandle, shortcut: &Shortcut) {
    let cmd_k = "CmdOrCtrl+Shift+K".parse::<Shortcut>().unwrap();
    let cmd_n = "CmdOrCtrl+Shift+N".parse::<Shortcut>().unwrap();

    if shortcut == &cmd_k {
        // Command Palette: CmdOrCtrl+Shift+K
        if let Some(window) = app.get_webview_window("main") {
            let _ = window.show();
            let _ = window.set_focus();
            let _ = window.eval("window.dispatchEvent(new KeyboardEvent('keydown', {key: 'k', metaKey: true, bubbles: true}))");
        }
    } else if shortcut == &cmd_n {
        // Quick Capture: CmdOrCtrl+Shift+N
        if let Some(window) = app.get_webview_window("main") {
            let _ = window.show();
            let _ = window.set_focus();
            let _ = window.eval("window.location.href = '/dashboard/knowledge/captures'");
        }
    }
}

fn show_main_window(app: &AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.show();
        let _ = window.set_focus();
    }
}

fn handle_tray_menu_click(app: &AppHandle, id: &str) {
    match id {
        "open" => show_main_window(app),
        "quick_capture" => {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.set_focus();
                let _ = window.eval("window.location.href = '/dashboard/knowledge/captures'");
            }
        }
        "command_palette" => {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.set_focus();
                let _ = window.eval("window.dispatchEvent(new KeyboardEvent('keydown', {key: 'k', metaKey: true, bubbles: true}))");
            }
        }
        "dashboard" => {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.eval("window.location.href = '/dashboard'");
            }
        }
        "inbox" => {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.eval("window.location.href = '/dashboard/inbox'");
            }
        }
        "tasks" => {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.eval("window.location.href = '/dashboard/tasks'");
            }
        }
        "chat" => {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.eval("window.location.href = '/dashboard/chat'");
            }
        }
        "quit" => {
            std::process::exit(0);
        }
        _ => {}
    }
}

#[tauri::command]
fn send_notification(title: String, body: String) -> Result<(), String> {
    let _ = (title, body);
    Ok(())
}

#[tauri::command]
fn get_app_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}
