/* eslint-disable */
import {createContext, useEffect, useState} from "react";
import PropTypes from 'prop-types';
import jwtDecode from 'jwt-decode';

import {useNavigate} from "react-router-dom";

const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({children}) => {
    let [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwtDecode(localStorage.getItem('authTokens')) : null)
    let [loading, setLoading] = useState(true)

    const navigator = useNavigate()

    let loginUser = async (e) => {
        e.preventDefault()
        if (!e.target.email.value) {
            alert("Don't forget to enter your email")
        } else if (!e.target.password.value) {
            alert("Don't forget to enter your password")
        } else {
            try {
                let response = await fetch('http://127.0.0.1:8000/api/token/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({'email': e.target.email.value, 'password': e.target.password.value})
                })
                let data = await response.json()
                if (response.status === 200) {
                    await createNotification()
                    setAuthTokens(data)
                    setUser(jwtDecode(data.access))
                    localStorage.setItem('authTokens', JSON.stringify(data))
                    navigator('../profile')
                } else if (response.status === 401) {
                    alert('Invalid email or password. Also ensure that you have verified your email.')
                } else {
                    alert('Auth service failed! Is it maybe down?')
                }
            } catch (e) {
                alert('Auth service failed! Is it maybe down?')
            }
        }
    }

    let createNotification = async () => {
        if (Notification.permission === "default") {
            Notification.requestPermission().then((permission) => {
                if (permission !== "granted") {
                    return null;
                }
            });
        }
        setTimeout(() => {
            showNotification("Item Expiration Reminder", "Your item will expire in 5 seconds.", "/path/to/icon.png");
        }, 5 * 1000);
    }

    let showNotification = (title, body, icon) => {
        new Notification(title, {
            body: body,
            icon: icon,
        });
    }

    let createUser = async (e) => {
        e.preventDefault()
        if (!e.target.name.value) {
            alert("Please enter a name")
        } else if (!e.target.email.value) {
            alert("Don't forget to enter your email")
        } else if (!e.target.password.value) {
            alert("Don't forget to enter your password")
        } else {
            let response = await fetch('http://127.0.0.1:8000/api/register/', {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({'full_name':e.target.name.value, 'email':e.target.email.value, 'password':e.target.password.value, 'is_business': e.target.is_business.checked})
            })
            let data = await response.json()
            if (response.status === 200 || response.status === 201) {
                navigator(0)
                alert('Account created!')
                alert('Please check your email and click on the link to activate your account');
            } else if (response.status === 401) {
                alert('Invalid email or password.')
            } else {
                alert('Auth service failed! Is it maybe down?')
            }
        }
    }

    let logoutUser = () => {
        setAuthTokens(null)
        setUser(null)
        localStorage.removeItem('authTokens')
        navigator('../login')
    }

    let updateToken = async () => {
        try {
            let response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({'refresh': authTokens?.refresh})
            })
            await handleResponse(response);
        } catch (e) {
            setAuthTokens(null);
            localStorage.removeItem('authTokens');
            setLoading(false);
            console.log("Auth service failed, is it maybe down?");
        }
    }

    let updateNewToken = async (oldToken) => {
        try {
            let response = await fetch(`http://127.0.0.1:8000/api/token/new/?jwt=${oldToken}`, {
                method:'GET'
            })
            await handleResponse(response);
        } catch (e) {
            setAuthTokens(null);
            localStorage.removeItem('authTokens');
            setLoading(false);
            console.log("Auth service failed, is it maybe down?");
        }
    }

    let handleResponse = async (response) => {
        let data = await response.json()
        if (response.status === 200) {
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
        } else {
            setAuthTokens(null)
            setUser(null)
            localStorage.removeItem('authTokens')
            if (!response.status === 400) {
                navigator('../')
            }
        }
        if (loading) {
            setLoading(false);
        }
    }

    let contextData = {
        user:user,
        authTokens:authTokens,
        loginUser:loginUser,
        logoutUser:logoutUser,
        createUser:createUser,
        updateNewToken:updateNewToken
    }

    useEffect(()=> {
        if (loading) {
            updateToken()
        }

        let refreshIntervalTime = 1000 * 60 * 9
        let interval = setInterval(()=> {
            if (authTokens) {
                updateToken()
            }
        }, refreshIntervalTime)
        return ()=> clearInterval(interval)
    }, [authTokens, loading])

    return(
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
