import React from 'react'
import { Link, browserHistory } from 'react-router'
import classAutoBind from 'react-helpers/dist/classAutoBind'
import { sharedState, attachSharedState, detachSharedState } from 'react-helpers/dist/sharedState'

import WelcomeLayout from './WelcomeLayout'

class Login extends React.Component {
    constructor(props) {
        super(props)
        classAutoBind(this)
        // this.state = sharedState()
        this.state = {
            email: '',
            password: '',
            mock: false
        }
    }

    componentDidMount() {
        attachSharedState(this, (state) => this.setState({sharedState: state}))
        // attachSharedState(this)
    }

    componentWillUnmount() {
        detachSharedState(this)
    }

    mockResponse() {
        var response = {
            user: {
                id: 1,
                name: 'Tom',
                email: 'me@me.com',
                avatar: '',
                api_token: 'xxxxxxxxxxxxx'
            }
        }

        this.loggedInHandler(response)
    }

    login() {

        if (!this.state.mock) {
            console.log(this.state)
            fetch('https://stormy-oasis-22187.herokuapp.com/api/login', {
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password
                }),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function(response) {
              if(response.ok) {
                return response.json()
              } else {
                  throw 'Network response was not ok.'              }
            })
            .then(this.loggedInHandler)
            .catch(function(error) {
              console.log('There has been a problem with your fetch operation: ' + error.message)
            })
        } else {
            this.mockResponse()
        }
    }

    loggedInHandler(response) {
        // response = ['error 1', 'error 2']
        // response.user = undefined
        console.log(typeof response.user)

        if(typeof response.user != 'undefined') {
            sessionStorage.setItem('chirp-api-token', response.user.api_token)
            sessionStorage.setItem('chirp-user-id', response.user.id)
            sharedState({
                user: {
                    id: response.user.id,
                    name: response.user.name,
                    email: response.user.email,
                    avatar: response.user.avatar,
                    api_token: response.user.api_token
                }})
            // TODO: add redirect after signin
            console.log('logged in: ', response)
            // window.location.href = '/chirp.html'
            browserHistory.push('/chirp?loggedin=true')
            // document.cookie = 'phetchly=' + response.user.api_token + '; expires=Thu, 2 Aug 2001 20:47:11 UTC'
        } else {
            response.forEach(function(error) {
                var errorDiv = document.createElement('div')
                errorDiv.classList.add('alert', 'alert-danger')
                errorDiv.innerHTML = error
                document.querySelector('#errors').appendChild(errorDiv)
            })
        }
    }

    handleClick() {
        this.login()
    }

    handleEmailChange(e) {
        this.setState({
            email: e.target.value
            })
    }

    handlePasswordChange(e) {
        this.setState({
                password: e.target.value
            })
    }

    render() {
        // TODO: Login: Add the rest of the form bindings
        return <WelcomeLayout>
                <div className="well">
                          <h2>Login</h2>
                          <br/>
                          <div id="errors"></div>
                          <br/>
                          <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" className="form-control" required value={this.state.email} onChange={this.handleEmailChange}/>
                          </div>
                          <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" className="form-control" required value={this.state.password} onChange={this.handlePasswordChange}/>
                          </div>
                          <div className="form-group">
                              <button id="signin" type="button" className="btn btn-primary btn-block" onClick={this.handleClick}>Log In</button>
                          </div>
                          <div className="form-group">
                            <Link to="/" className="btn btn-danger btn-block">Cancel</Link>
                        </div>
                    </div>
        </WelcomeLayout>
    }
}

export default Login
