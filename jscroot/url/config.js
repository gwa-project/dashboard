//lib call
import {folderPath} from "https://cdn.jsdelivr.net/gh/jscroot/url@0.0.9/croot.js";
//please always use trailing slash(/) for folder or extension for file.
//never use slash in front of file or directory
//u might change croot parameter based on your path

export const backend = {
    user: {
        data: 'https://asia-southeast2-gwa-project-472118.cloudfunctions.net/go-gcp-function/data/user',
        all: 'https://asia-southeast2-gwa-project-472118.cloudfunctions.net/go-gcp-function/users',
        create: 'https://asia-southeast2-gwa-project-472118.cloudfunctions.net/go-gcp-function/data/user',
        update: 'https://asia-southeast2-gwa-project-472118.cloudfunctions.net/go-gcp-function/data/user',
        delete: 'https://asia-southeast2-gwa-project-472118.cloudfunctions.net/go-gcp-function/data/user',
    },
    auth: {
        login: 'https://asia-southeast2-gwa-project-472118.cloudfunctions.net/go-gcp-function/auth/login',
        register: 'https://asia-southeast2-gwa-project-472118.cloudfunctions.net/go-gcp-function/auth/register',
        refresh: 'https://asia-southeast2-gwa-project-472118.cloudfunctions.net/go-gcp-function/auth/refresh',
        logout: 'https://asia-southeast2-gwa-project-472118.cloudfunctions.net/go-gcp-function/auth/logout',
    },
    config: 'https://asia-southeast2-gwa-project-472118.cloudfunctions.net/go-gcp-function/config',
    health: 'https://asia-southeast2-gwa-project-472118.cloudfunctions.net/go-gcp-function/health',
    home: 'https://asia-southeast2-gwa-project-472118.cloudfunctions.net/go-gcp-function/',
};

export const croot = folderPath()+"jscroot/";

export const folder={
    template:croot+"template/",
    controller : croot+"controller/",
    view : croot+"view/",
}

export const url={
    template:{
        content : folder.template+"content/",
        header: folder.template+"header.html",
        navbar:folder.template+"navbar.html" ,
        settings:folder.template+"settings.html" ,
        sidebar:folder.template+"sidebar.html" ,
        footer:folder.template+"footer.html",
        rightbar:folder.template+"rightbar.html"
    },
    controller:{
        main : folder.controller+"main.js",
        navbar : folder.controller+"navbar.js",
        content : croot+"url/content.js"
    },
    view : {
        content:folder.view+"content/",
        header: folder.view+"header.js",
        search:folder.view+"search.js" ,
        settings:folder.view+"settings.js" ,
        navbar:folder.view+"navbar.js" ,
        footer:folder.view+"footer.js"
    }
}

export const id={
    header:"header__container",
    navbar:"navbar",
    content:"content"
}