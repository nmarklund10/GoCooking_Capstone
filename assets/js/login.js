function loginSetup() {
    gapi.auth2.getAuthInstance().attachClickHandler(document.getElementById("googleButton"), {}, sendLoginRequest, null);
}

function sendLoginRequest(googleUser) {
    var authResult = googleUser.getAuthResponse();
    var id_token = authResult.id_token;
    sendPostRequest("/verifyToken/",{"id_token":id_token},
    function(response)
    {
        if (response.create) {
            if (confirm("No account found with the email: " + response.email + ".\nPressing OK will create a new one.")) {
                sendPostRequest("create", {"name":response.name, "email":response.email},
                    function(r)
                    {
                        if (r.success) {
                            window.name = response.name;
                            goToUrl("/recipes/");
                        }
                        else {
                            alert(r.reason);
                        }
                    });
            }
        }
        else if(response.success)
        {
            window.name = response.name;
            goToUrl("/recipes/");
        }
        else
        {
            alert(response.reason);
        }
    });
}