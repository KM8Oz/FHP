// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::{Manager, PhysicalPosition, SystemTrayEvent, Window};
use tauri::{PhysicalSize, SystemTray};
use tauri_plugin_oauth::{start_with_config, OauthConfig};
mod mylib;
mod getuidwin;
// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
async fn user_processes(_window: Window) -> Result<Vec<mylib::ItemJson>, String>{
    mylib::user_processes()
}
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
#[derive(Clone, serde::Serialize)]
struct Payload {
  uri: String,
}
#[tauri::command]
async fn start_server(window: Window) -> Result<u16, String>{
    // start(move |url| {
    //     println!("Redirect_uri server ({}) already started✅",url);
    //     // Because of the unprotected localhost port, you must verify the URL here.
    //     // Preferebly send back only the token, or nothing at all if you can handle everything else in Rust.
    //     let _ = window.emit("redirect_uri", url);
    // })
    // .map_err(|err| {
    //     println!("Redirect_uri server err : ({})",err.to_string());
    //     err.to_string()
    // })
    // let app = App::new(
    //     _app.app_handle().package_info().version.build.to_string(),
    //     _app.app_handle().package_info().package_name(),
    //     "FHP".into(),
    //     "FHP".into(),
    //     None,
    // );
    // let _ = thisinstall(&app, &vec!["fhp://*".into()]);
    let serverconfig = OauthConfig {
        ports: Some(vec![62235 as u16]),
        ..OauthConfig::default()
    };
    start_with_config(serverconfig, move |uri| {
        window.emit_all("event-uri", Payload { uri }).unwrap();
    }).map_err(|err| err.to_string())
}

fn main() {
    let system_tray = SystemTray::new().with_id("FHPtray");
    tauri::Builder::default()
        .system_tray(system_tray)
        .enable_macos_default_menu(false)
        .setup(|app| {
            let _main_window = app.get_window("main").unwrap();
            let _ = _main_window.set_resizable(false);
            let _ = _main_window.set_always_on_top(true);
            let _ = _main_window.hide();
            if let Ok(Some(monitor)) = _main_window.primary_monitor() {
                let monitorsize = monitor.size();
                let _ = _main_window.set_size(PhysicalSize {
                    width: 600 * monitorsize.width / 3360,
                    height: 900 * monitorsize.height / 2100,
                });
                let _ = _main_window.set_position(PhysicalPosition { x: -1000, y: -1000 });
            }
            // let _ = start_server(app.get_window("main").unwrap());
            Ok(())
        })
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::Focused(focused) => {
                // hide window whenever it loses focus
                if !focused {
                    event.window().hide().unwrap();
                }
            }
            tauri::WindowEvent::CloseRequested { api, .. } => {
                api.prevent_close();
            }
            _ => {}
        })
        .on_system_tray_event(|_app, event| match event {
            SystemTrayEvent::LeftClick {
                tray_id,
                position,
                size,
                ..
            } => {
                let main_window = _app.app_handle().get_window("main").unwrap();
                if let Ok(Some(monitor)) = main_window.primary_monitor() {
                    let monitorsize = monitor.size();
                    let winposition = if position.x as u32 > monitorsize.width / 2 {
                        if position.y > (monitorsize.height / 2).into() {
                            PhysicalPosition {
                                x: ((position.x as u32) - (600 * monitorsize.width / 3360) / 2)
                                    + 32,
                                y: ((position.y as u32) + (900 * monitorsize.height / 2100)),
                            }
                        } else {
                            PhysicalPosition {
                                x: ((position.x as u32) - (600 * monitorsize.width / 3360) / 2)
                                    + 32,
                                y: position.y as u32,
                            }
                        }
                    } else {
                        if position.y > (monitorsize.height / 2).into() {
                            PhysicalPosition {
                                x: ((position.x as u32) - (600 * monitorsize.width / 3360) / 2)
                                    - 32,
                                y: ((position.y as u32) + (900 * monitorsize.height / 2100)),
                            }
                        } else {
                            PhysicalPosition {
                                x: ((position.x as u32) - (600 * monitorsize.width / 3360) / 2)
                                    - 32,
                                y: position.y as u32,
                            }
                        }
                    };
                    let _ = main_window.set_position(winposition);
                    match main_window.is_visible() {
                        Ok(status) => {
                            if status {
                                let _ = main_window.hide();
                            } else {
                                let _ = main_window.show();
                            }
                        }
                        Err(_err) => {
                            let _ = main_window.hide();
                        }
                    };
                    // println!(
                    //     "systray: {}:{}, monitor: {}, {}",
                    //     position.x, position.y, monitorsize.height, monitorsize.width
                    // );
                }
            }
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![greet, start_server, user_processes])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
