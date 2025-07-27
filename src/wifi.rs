use embedded_svc::wifi::{ClientConfiguration, Configuration, Wifi};
use esp_idf_svc::wifi::EspWifi;
use esp_idf_svc::eventloop::EspSystemEventLoop;
use anyhow::Result;

const SSID: &str = "YOUR_SSID";
const PASS: &str = "YOUR_PASSWORD";

pub fn connect() -> Result<()> {
    let sysloop = EspSystemEventLoop::take()?;
    let mut wifi = EspWifi::new_default(sysloop.clone(), None)?;
    let conf = Configuration::Client(ClientConfiguration {
        ssid: SSID.into(),
        password: PASS.into(),
        ..Default::default()
    });
    wifi.set_configuration(&conf)?;
    wifi.start()?;
    wifi.connect()?;
    info!("Waiting for IP...");
    // block until got IP
    while wifi.is_connected()? == false {}
    let ip_info = wifi.sta_netif().get_ip_info()?;
    info!("Got IP: {}", ip_info.ip);
    Ok(())
}
