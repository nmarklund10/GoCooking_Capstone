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
            var dialog = document.getElementById('alertDialog');
            var dialogContent = document.getElementById('alertDialogText');
            document.getElementById('closeDialogButton').addEventListener('click', function() {dialog.close();})
            dialogContent.innerHTML = "No account found with the email: " + response.email.bold() + ".<br>Pressing OK will create a new one.";
            dialog.showModal();
            document.getElementById("alertDialogButton").addEventListener('click', function() {
                sendPostRequest("create", {"name":response.name, "email":response.email},
                    function(r)
                    {
                        if (r.success) {
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
            goToUrl("/dashboard");
        }
        else
        {
            alert(response.reason);
        }
    });
}