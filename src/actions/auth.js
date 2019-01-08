import axios from 'axios'

/**
 * 
 * this API use to check if a new login user is real or not
 * 
 */
export const loadUser = () => {
    return (dispatch, getState) => {
        dispatch({ type: "USER_LOADING" });

        const token = getState().auth.token;

        let headers = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }
        return fetch("/api/auth/user/", { headers, })
            .then(res => {
                console.log(res);
                if (res.status < 500) {
                    return { status: res.status, data: res };
                } else {
                    console.log("Server Error!");
                    throw res;
                }
            })
            .then(res => {
                if (res.status === 200) {
                    dispatch({ type: 'USER_LOADED', user: res.data });
                    return res.data;
                } else if (res.status >= 400 && res.status < 500) {
                    dispatch({ type: "AUTHENTICATION_ERROR", data: res.data });
                    throw res.data;
                }
            })
    }
}
/**
 * 
 * this API use to send login information to backend to authentication
 * 
 */
export const login = (username, password) => {
    return axios
    .post('/api/auth/login/', {
      email: username,
      password:  password
    })
    .then(response => {
      localStorage.setItem('usertoken', response.data)
      return response.data
    })
    .catch(err => {
      console.log(err)
    })
}
/**
 * 
 * this API use to send register information to backend to add new user
 * 
 */
export const register = (username, password, dob) => {
    return axios 
    .post('/api/auth/register/', {
      username: username,
      password: password,
      dob: dob,
    })
    .then(response => {
      console.log('Registered')
    })
}