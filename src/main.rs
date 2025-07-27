#![no_std]
#![no_main]

use esp_idf_sys as _; // link ESP-IDF
use log::*;
use anyhow::Error;

mod wifi;
mod server;

#[entry]
fn main() -> ! {
    esp_idf_sys::link_patches();
    esp_idf_svc::log::EspLogger::initialize_default();

    info!("Booting esp32-web-server…");

    // Setup Wi-Fi
    if let Err(e) = wifi::connect() {
        error!("WiFi connect error: {:?}", e);
    } else {
        info!("WiFi connected, starting HTTP server");
        // Start HTTP server (runs forever)
        if let Err(e) = server::start() {
            error!("Server error: {:?}", e);
        }
    }

    loop {
        // nothing: server runs in its own threads
    }
}
