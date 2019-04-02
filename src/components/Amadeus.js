import axios from 'axios';

function AmadeusApi() {
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    const params = {
        "client_id": "AAi8wQ9smqr53Ef0m4zIGY5fJ1UR0gux",
        "client_secret": "26iCTESef61KmCdc",
        "grant_type": "client_credentials"
    }
    const url = 'https://test.api.amadeus.com/v1/security/oauth2/token';

    var formBody = [];
    for (var property in params) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(params[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    return new Promise((resolve, reject) => {
        axios.post(url, formBody, config).then((response) => {
            resolve(response.data.access_token)
        }).catch((err) => {
            reject(err);
        })
    })
}


 function GetToken() {
   //return AmadeusApi();
}


export { GetToken , AmadeusApi }