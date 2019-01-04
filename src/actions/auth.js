export const loadUser = () => {
    return (dispatch, getState) => {
        dispatch({type: "USER_LOADING"});
        const token = getState().auth.token;

        let headers = {
            "Content-Type": "application/json",
        }

        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }
        return fetch("/api/auth/user", {headers, })
        .then(res => {
            if (res.status < 500) {
                return res.json().then(data => {
                    return {status: res.status, data};
                })
            } else {
                console.log("Server Error!");
                throw res;
            }
        })
        .then(res => {
            if (res.status === 200) {
              dispatch({type: 'REGISTRATION_SUCCESSFUL', data: res.data });
              return res.data;
            } else if (res.status === 403 || res.status === 401) {
              dispatch({type: "AUTHENTICATION_ERROR", data: res.data});
              throw res.data;
            } else {
              dispatch({type: "REGISTRATION_FAILED", data: res.data});
              throw res.data;
            }
          })
    }
}