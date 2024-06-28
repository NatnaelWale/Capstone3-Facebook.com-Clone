/* auth.js provides LOGIN-related functions */

"use strict";

const apiBaseURL = "http://microbloglite.us-east-2.elasticbeanstalk.com";
// Backup server (mirror):   "https://microbloglite.onrender.com"


function getLoginData () {
    const loginJSON = window.localStorage.getItem("login-data");
    return JSON.parse(loginJSON) || {};
}


function isLoggedIn () {
    const loginData = getLoginData();
    return Boolean(loginData.token);
}


function login (loginData) {
    // POST /auth/login
    const options = { 
        method: "POST",
        headers: {
            
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
    };

    return fetch(apiBaseURL + "/auth/login", options)
        .then(response => response.json())
        .then(loginData => {
            if (loginData.message === "Invalid username or password") {
                console.error(loginData)
               document.querySelector("#messageDiv").innerHTML = "***Invalid username or password***"
                return null
            }

            window.localStorage.setItem("login-data", JSON.stringify(loginData));
            window.location.assign("/posts");  // redirect

            return loginData;
        });
}


function logout () {
    const loginData = getLoginData();

    // GET /auth/logout
    const options = { 
        method: "GET",
        headers: { 
          
            Authorization: `Bearer ${loginData.token}`,
        },
    };

    fetch(apiBaseURL + "/auth/logout", options)
        .then(response => response.json())
        .then(data => console.log(data))
        .finally(() => {

            window.localStorage.removeItem("login-data");
            window.location.assign("/"); 
        });
}
