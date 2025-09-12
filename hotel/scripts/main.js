// This is the page for customers to view the page and make bookings.

const currentUserToken={
        currentUserId:"",
        idToken:"",
        role:""
}
function pageLoad()
{
    cognitoApp.auth.parseCognitoWebResponse(window.location.href);
            var currentUser =cognitoApp.auth.getCurrentUser();

            if (currentUser) {

                cognitoApp.auth.getSession();

                currentSession = cognitoApp.auth.signInUserSession;

                currentUserToken.currentUserId = currentUser;
                currentUserToken.idToken = currentSession.idToken.jwtToken;
                console.info(currentUserToken);

                var tokenDetails = parseJwt(currentSession.idToken.jwtToken)
                if (tokenDetails['cognito:groups'])
                {
                    var groups = tokenDetails['cognito:groups'][0];
                    currentUserToken.role = groups;
                }

            }

            $("#btnSignIn").on('click', function(btn){
                cognitoApp.auth.getSession();
            });

            $("#btnSignOut").on('click', function(btn){
                currentUserToken.role ="";
                currentUserToken.idToken="";
                currentUserToken.currentUserId="";
                cognitoApp.auth.signOut();
            });

            $("#btnSignOut").hide();
            $("#btnSignIn").hide();

            if (currentUserToken.currentUserId==="")
            {
                $("#btnSignIn").show();
            }
            else
            {
                $("#btnSignOut").show();
            }

}



        function parseJwt (token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        }

function setAuthHeader() {
  form = $("form");
  form.submit(function (event) {
    event.preventDefault(); // prevent the form from submitting normally
    const xhr = new XMLHttpRequest();
    xhr.open("POST", form.attr("action"));
    xhr.setRequestHeader("Authorization", "Bearer " + currentUserToken.idToken);
    xhr.setRequestHeader("Content-Type", "multipart/form-data");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        console.log(xhr.responseText);
      }
    };

    xhr.send(form.serialize());
  });

}
