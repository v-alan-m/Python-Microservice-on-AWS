// This code initializes AWS Cognito authentication settings in the browser using the provided config to enable user sign-in and sign-out with a hosted UI.
const config={
    cognito:{
        identityPoolId:"eu-west-2_JiLixDadf", // put your AWS Cognito Identity Pool ID here
        cognitoDomain:"eu-west-2jilixdadf.auth.eu-west-2.amazoncognito.com", // put your AWS Cognito domain here. The value is in AWS Console, under AWS Cognito -> Domains.
        appId:"pf1q4bvca7etg6lccoqi4ilc3" // Create a Client App (Application) in AWS Cognito (under User Pool) and put its ID here.
    }
}

var cognitoApp={
    auth:{},
    Init: function()
    {

        var authData = {
            ClientId : config.cognito.appId,
            AppWebDomain : config.cognito.cognitoDomain,
            TokenScopesArray : ['email', 'openid', 'profile'],
            RedirectUriSignIn : 'http://localhost:8080/hotel/',
            RedirectUriSignOut : 'http://localhost:8080/hotel/',
            UserPoolId : config.cognito.identityPoolId,
            AdvancedSecurityDataCollectionFlag : false,
                Storage: null
        };

        cognitoApp.auth = new AmazonCognitoIdentity.CognitoAuth(authData);
        cognitoApp.auth.userhandler = {
            onSuccess: function(result) {

            },
            onFailure: function(err) {
            }
        };
    }
}