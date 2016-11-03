var signup = document.querySelector('#signup')
// TODO: Mock Signup Response
// signup.addEventListener('click', signupHandler)
signup.addEventListener('click', mockResponse)

function signupHandler() {
    var email = document.querySelector('#email').value
    var password = document.querySelector('#password').value
    var name = document.querySelector('#name').value
    var avatar = document.querySelector('#avatar').value

    fetch('https://d3459c34.ngrok.io/users', {
        body: JSON.stringify({
            email: email,
            password: password,
            name: name,
            avatar: avatar,
        }),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(signedupHandler)
    // TODO: add error handling for fetch in signup
}

function mockResponse(){
    var response = {
        user: {
            api_token: 99999999999
        }
    }

    signedupHandler(response)
}

function signedupHandler(response){
    if(typeof response.user != 'undefined') {
        sessionStorage.setItem('chirp-api-token', response.user.api_token)
        // TODO: Add redirect after sign up
        console.log('signed up:', response)
        // window.location.href = '/photos.html'
    } else {
        response.forEach(function(error) {
            var errorDiv = document.createElement('div')
            errorDiv.classList.add('alert', 'alert-danger')
            errorDiv.innerHTML = error
            document.querySelector('#errors').appendChild(errorDiv)
        })
    }
}
