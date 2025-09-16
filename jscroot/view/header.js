import {getJSON} from "https://cdn.jsdelivr.net/gh/jscroot/api@0.0.7/croot.js";
import {getCookie} from "https://cdn.jsdelivr.net/gh/jscroot/cookie@0.0.1/croot.js";
import {setInner} from "https://cdn.jsdelivr.net/gh/jscroot/element@0.1.5/croot.js";
import {backend} from "../url/config.js";

export function main() {
    // Load user data and update header
    getJSON(backend.user.data, "login", getCookie("login"), function(response) {
        if (response.success && response.data) {
            const user = response.data;

            // Update user avatar and name in header
            const userAvatar = document.getElementById('userAvatar');
            const userName = document.getElementById('userName');

            if (userAvatar) {
                userAvatar.src = user.picture || '/assets/img/default-avatar.png';
            }

            if (userName) {
                userName.textContent = user.name || 'User';
            }
        }
    });

    console.log("Header view loaded");
}