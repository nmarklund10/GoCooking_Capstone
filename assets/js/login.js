function loginSetup() {
    gapi.auth2.getAuthInstance().attachClickHandler(document.getElementById("googleButton"), {}, sendLoginRequest, null);
    window.dialog = document.getElementById('alertDialog');
    window.dialogText = document.getElementById('alertDialogText');
}

function sendLoginRequest(googleUser) {
    var authResult = googleUser.getAuthResponse();
    var id_token = authResult.id_token;
    sendPostRequest("/verifyToken/",{"id_token":id_token},
    function(response)
    {
        if (response.create) {
            window.dialogText.innerText = "No account found with the email: " + response.email + ".\n\nPressing OK will create a new one.";
            window.dialog.showModal();
            document.getElementById("alertDialogButton").addEventListener('click', function() {
                sendPostRequest("create", {"name":response.name, "email":response.email},
                    function(r)
                    {
                        if (r.success) {
                            window.name = response.name;
                            goToUrl("/dashboard");
                        }
                        else {
                            alert(r.reason);
                        }
                    });
            });
        }
        else if(response.success)
        {
            window.name = response.name;
            goToUrl("/dashboard");
        }
        else
        {
            alert(response.reason);
        }
    });
}