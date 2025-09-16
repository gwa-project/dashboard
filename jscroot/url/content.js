//lib call
import {getHash} from "https://cdn.jsdelivr.net/gh/jscroot/url@0.0.2/croot.js";
//internal call
import { url } from "./config.js";

export function getContentURL(){
    let hashlink=getHash();
    switch (hashlink) {
        case "home":
            return url.template.content+"home.html";
        case "profile/accounts":
            return url.template.content+"profile/accounts.html";
        case "profile/mail":
            return url.template.content+"profile/mail.html";
        case "messages":
            return url.template.content+"messages.html";
        case "users/list":
            return url.template.content+"users/list.html";
        case "users/create":
            return url.template.content+"users/create.html";
        case "users/edit":
            return url.template.content+"users/edit.html";
        case "proyek/lihat":
            return url.template.content+"proyek/lihat.html";
        case "proyek/anggota":
            return url.template.content+"proyek/anggota.html";
        case "proyek/assessment":
            return url.template.content+"proyek/assessment.html";
        case "proyek/bimbingan":
            return url.template.content+"proyek/bimbingan.html";
        case "settings/config":
            return url.template.content+"settings/config.html";
        case "settings/security":
            return url.template.content+"settings/security.html";
        case "logs/activity":
            return url.template.content+"logs/activity.html";
        case "logs/errors":
            return url.template.content+"logs/errors.html";
        case "docs/api":
            return url.template.content+"docs/api.html";
        case "docs/guide":
            return url.template.content+"docs/guide.html";
        case "health":
            return url.template.content+"health.html";
        case "logout":
            return url.template.content+"logout.html";
        default:
            return url.template.content+"home.html";
    }
}

export function getURLContentJS(){
    let hashlink=getHash();
    switch (hashlink) {
        case "home":
            return url.view.content+"home.js";
        case "profile/accounts":
            return url.view.content+"profile/accounts.js";
        case "profile/mail":
            return url.view.content+"profile/mail.js";
        case "messages":
            return url.view.content+"messages.js";
        case "users/list":
            return url.view.content+"users/list.js";
        case "users/create":
            return url.view.content+"users/create.js";
        case "users/edit":
            return url.view.content+"users/edit.js";
        case "proyek/lihat":
            return url.view.content+"proyek/lihat.js";
        case "proyek/anggota":
            return url.view.content+"proyek/anggota.js";
        case "proyek/assessment":
            return url.view.content+"proyek/assessment.js";
        case "proyek/bimbingan":
            return url.view.content+"proyek/bimbingan.js";
        case "settings/config":
            return url.view.content+"settings/config.js";
        case "settings/security":
            return url.view.content+"settings/security.js";
        case "logs/activity":
            return url.view.content+"logs/activity.js";
        case "logs/errors":
            return url.view.content+"logs/errors.js";
        case "docs/api":
            return url.view.content+"docs/api.js";
        case "docs/guide":
            return url.view.content+"docs/guide.js";
        case "health":
            return url.view.content+"health.js";
        case "logout":
            return url.view.content+"logout.js";
        default:
            return url.view.content+"home.js";
    }
}