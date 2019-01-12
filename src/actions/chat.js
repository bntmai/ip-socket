/**
 * 
 * @param {*} index 
 * return all users information
 */
export const sendMessage = (fromUserId, toUserId, content) => {
    return (dispatch, getState) => {
        let headers = { "Content-Type": "application/json" };
        let { token } = getState().auth;

        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }
        let body = JSON.stringify({ "fromUserId": fromUserId, "toUserId": toUserId, "content":  content });
        return fetch("http://127.0.0.1:5000/api/chat/sendMessages", { headers, method: "POST", body })
            .then(res => {
                if (res.status < 500) {
                    return res.json().then(data => {
                        return { status: res.status, data };
                    })
                } else {
                    console.log("Server Error!");
                    throw res;
                }
            })
            .then(res => {
                if (res.status === 201) {
                    return dispatch({ type: 'SEND_MESSAGE', note: res.data });
                } else if (res.status === 401 || res.status === 403) {
                    dispatch({ type: "AUTHENTICATION_ERROR", data: res.data });
                    throw res.data;
                }
            })
    }
}

/**
 * 
 * @param {*} index 
 * return current user infomation by id include their blogs in ascending order (front end will send a params id to backend)
 */
export const loadMessages = (fromUserId, toUserId, content) => {
    return (dispatch, getState) => {
        let headers = { "Content-Type": "application/json" };
        let { token } = getState().auth;

        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }
        let body = JSON.stringify({ "fromUserId": fromUserId, "toUserId": toUserId, "content":  content });
        return fetch("http://127.0.0.1:5000/api/add-blogs/", { headers, method: "POST", body })
            .then(res => {
                if (res.status < 500) {
                    return res.json().then(data => {
                        return { status: res.status, data };
                    })
                } else {
                    console.log("Server Error!");
                    throw res;
                }
            })
            .then(res => {
                if (res.status === 201) {
                    return dispatch({ type: 'LOAD_MESSAGE', note: res.data });
                } else if (res.status === 401 || res.status === 403) {
                    dispatch({ type: "AUTHENTICATION_ERROR", data: res.data });
                    throw res.data;
                }
            })
    }
}