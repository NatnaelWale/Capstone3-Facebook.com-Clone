/* Landing Page JavaScript */

"use strict";

const logInForm = document.querySelector("#logIn");

logInForm.onsubmit = function (event) {
    // Prevent the form from refreshing the page,
    // as it will do by default when the Submit event is triggered:
    event.preventDefault();

    // We can use loginForm.username (for example) to access
    // the input element in the form which has the ID of "username".
    const loginData = {
        username: logInForm.username.value,
        password: logInForm.password.value,
    }
    // console.log(loginData)

    // Disables the button after the form has been submitted already:
    logInForm.logInButton.disabled = true;

    // Time to actually process the login using the function from auth.js!
    login(loginData);
};

//Popover
const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
const popoverList = popoverTriggerList.map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

