//lib call
import {getHash} from "https://cdn.jsdelivr.net/gh/jscroot/url@0.0.2/croot.js";
//internal call
import { url } from "./config.js";

export function getContentURL(){
    let hashlink=getHash();
    switch (hashlink) {
        case "home":
            return url.template.content+"home.html";
        case "auth":
        case "login":
            return url.template.content+"auth.html";
        case "dashboard":
            return url.template.content+"dashboard.html";
        case "profile/accounts":
            return url.template.content+"profile/accounts.html";
        case "profile/mail":
            return url.template.content+"profile/mail.html";
        case "settings/config":
            return url.template.content+"settings/config.html";
        case "settings/security":
            return url.template.content+"settings/security.html";
        case "docs/api":
            return url.template.content+"docs/api.html";
        case "docs/guide":
            return url.template.content+"docs/guide.html";
        default:
            return url.template.content+"home.html";
    }
}

export function getURLContentJS(){
    let hashlink=getHash();
    switch (hashlink) {
        case "home":
            return url.view.content+"home.js";
        case "auth":
        case "login":
            return url.view.content+"auth.js";
        case "dashboard":
            return url.view.content+"dashboard.js";
        case "profile/accounts":
            return url.view.content+"profile/accounts.js";
        case "profile/mail":
            return url.view.content+"profile/mail.js";
        case "settings/config":
            return url.view.content+"settings/config.js";
        case "settings/security":
            return url.view.content+"settings/security.js";
        case "docs/api":
            return url.view.content+"docs/api.js";
        case "docs/guide":
            return url.view.content+"docs/guide.js";
        default:
            return url.view.content+"home.js";
    }
}