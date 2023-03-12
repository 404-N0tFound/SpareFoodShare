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
            let response = await fetch('http://127.0.0.1:8000/api/token/', {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({'username':e.target.email.value, 'password':e.target.password.value})
            })
            let data = await response.json()
            if (response.status === 200) {
                setAuthTokens(data)
                setUser(jwtDecode(data.access))
                localStorage.setItem('authTokens', JSON.stringify(data))
                navigator('../profile')
            } else if (response.status === 401) {
                alert('Invalid username or password.')
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
        let response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'refresh':authTokens?.refresh})
        })
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
            setLoading(false)
        }
    }

    let contextData = {
        user:user,
        authTokens:authTokens,
        loginUser:loginUser,
        logoutUser:logoutUser
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
        }, 11000)
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
