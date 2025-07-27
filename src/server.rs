use esp_idf_svc::http::server::{Configuration, EspHttpServer};
use embedded_svc::http::Method;
use anyhow::Result;

// Embed website assets
const INDEX_HTML: &str = include_str!("../website/index.html");
const STYLE_CSS: &str  = include_str!("../website/style.css");
const SCRIPT_JS: &str  = include_str!("../website/script.js");

pub fn start() -> Result<()> {
    let server = EspHttpServer::new(&Configuration::default())?;

    // Route: /
    server.fn_handler("/", Method::Get, |_req| {
        Ok(embed_response("text/html; charset=utf-8", INDEX_HTML))
    })?;

    // Route: /style.css
    server.fn_handler("/style.css", Method::Get, |_req| {
        Ok(embed_response("text/css", STYLE_CSS))
    })?;

    // Route: /script.js
    server.fn_handler("/script.js", Method::Get, |_req| {
        Ok(embed_response("application/javascript", SCRIPT_JS))
    })?;

    Ok(())
}

// Helper to build a response
fn embed_response<'a>(content_type: &'a str, body: &'a str) -> esp_idf_svc::http::server::Response<'a> {
    let mut resp = esp_idf_svc::http::server::Response::new(200);
    resp.set_header("Content-Type", content_type);
    resp.send_str(body);
    resp
}
