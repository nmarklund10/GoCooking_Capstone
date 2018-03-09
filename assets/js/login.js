function loginSetup() {
    gapi.auth2.getAuthInstance().attachClickHandler(document.getElementById("googleButton"), {}, sendLoginRequest, null);
}

function sendLoginRequest(googleUser) {
    goToUrl('/recipes')
}