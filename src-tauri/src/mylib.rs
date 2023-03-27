use std::env;
use std::{collections::HashSet, path::PathBuf};
use sysinfo::{ProcessExt, System, SystemExt, UserExt};
use std::io::prelude::*;
use std::net::TcpListener;

#[derive(Clone, Debug, serde::Serialize)]
pub struct ItemJson {
    name: String,
    uptime: u32,
}

pub fn user_processes() -> Result<Vec<ItemJson>, String> {
    let mut system = System::new_all();
    system.refresh_all();
    // let current_uid = unsafe { libc::getuid() }; // get the user ID of the current user
                                                 // let apps_dir = dirs::home_dir().expect("Could not determine applications directory.");
    let current_uid = whoami::username();
    let apps_dir = match env::consts::OS {
        "macos" => match dirs::home_dir() {
            Some(home) => vec![home.join("Applications"), PathBuf::from("/Applications")],
            None => panic!("Could not determine applications directory."),
        },
        "windows" => {
            let program_files =
                env::var_os("ProgramFiles").unwrap_or_else(|| "C:\\Program Files".into());
            vec![program_files.into(), "C:\\Program Files (x86)".into()]
        }
        "linux" => vec!["/usr/local/bin".into()],
        _ => panic!("Unsupported operating system."),
    };
    // let current_uid1 = unsafe { libc::kevent(kq, changelist, nchanges, eventlist, nevents, timeout) }; // get the user ID of the current user
    // println!("userid:{}", current_uid.to_string());
    let mut exe_set = HashSet::new();
    let mut name_set = HashSet::new();
    let processes = system.processes();
    // println!("processes number:{}", processes.len());
    // println!("appdir:{:#?}", apps_dir);
    let mut user_processes = processes
        .into_iter()
        .filter(|(_, process)| {

                let user = if let Some(uid) = process.user_id() {
                    system.get_user_by_id(uid)
                } else {
                    None
                };
                process.user_id().is_some()
                && user.is_some()
                && user.unwrap().name() == current_uid.to_string()
                && apps_dir
                    .iter()
                    .find(|s| process.exe().starts_with(s.as_os_str()))
                    .is_some()
                && exe_set.insert(process.root().to_owned())
                && name_set.insert(process.name().to_owned())
                && process.disk_usage().total_written_bytes > 0
        })
        .collect::<Vec<_>>();
    user_processes.sort_by_key(|(_, process)| process.name().to_lowercase());
    let results_processes = user_processes
        .iter()
        .map(|(_, process)| ItemJson {
            name: process.name().to_string(),
            uptime: process.start_time() as u32,
        })
        .collect::<Vec<_>>();
    Ok(results_processes)
}

pub async fn start_server(port: u16) -> std::io::Result<String> {
    let listener = TcpListener::bind(format!("127.0.0.1:{}", port))?;
    let mut incoming = listener.incoming();

    while let Some(stream) = incoming.next() {
        let mut stream = stream?;
        let mut buf = [0; 1024];
        stream.read(&mut buf)?;

        let request_str = String::from_utf8_lossy(&buf[..]);
        let request_line = request_str.lines().next().unwrap();

        let request_url = request_line.split_whitespace().nth(1).unwrap().to_string();

        // Send a response back to the client
        let response_str = format!("HTTP/1.1 200 OK\r\n\r\nReceived request for {}", request_url);
        stream.write(response_str.as_bytes())?;
        stream.flush()?;

        return Ok(request_url);
    }

    Err(std::io::Error::new(
        std::io::ErrorKind::Other,
        "No request was received",
    ))
}