/* Posts Page JavaScript */

"use strict";

const logoutBtn = document.querySelector("#logoutBtn");

logoutBtn.onclick = function (e) {
    e.preventDefault();
    logout();
};
const loginData = getLoginData();
console.log(loginData.token)