/**
 * 
 * @param {*} index 
 * return all blogs in db
 */
export const fetchBlog = () => {
    return (dispatch, getState) => {
        let headers = { "Content-Type": "application/json" };
        let { token } = getState().auth;

        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }

        return fetch("/api/blogs/", { headers, })
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
                if (res.status === 200) {
                    return dispatch({ type: 'FETCH_BLOGS', notes: res.data });
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
 * insert new blog into database
 */
export const addBlog = text => {
    return (dispatch, getState) => {
        let headers = { "Content-Type": "application/json" };
        let { token } = getState().auth;

        if (token) {
            headers["Authorization"] = `Token ${token}`;
        }

        let body = JSON.stringify({ text, });
        return fetch("/api/blogs/", { headers, method: "POST", body })
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
                    return dispatch({ type: 'ADD_BLOGS', note: res.data });
                } else if (res.status === 401 || res.status === 403) {
                    dispatch({ type: "AUTHENTICATION_ERROR", data: res.data });
                    throw res.data;
                }
            })
    }
}

// export const updateBlogs = (index, text) => {
//     return (dispatch, getState) => {

//         let headers = { "Content-Type": "application/json" };
//         let { token } = getState().auth;

//         if (token) {
//             headers["Authorization"] = `Token ${token}`;
//         }

//         let body = JSON.stringify({ text, });
//         let blogId = getState().blogs[index].id;

//         return fetch(`/api/blogs/${blogId}/`, { headers, method: "PUT", body })
//             .then(res => {
//                 if (res.status < 500) {
//                     return res.json().then(data => {
//                         return { status: res.status, data };
//                     })
//                 } else {
//                     console.log("Server Error!");
//                     throw res;
//                 }
//             })
//             .then(res => {
//                 if (res.status === 200) {
//                     return dispatch({ type: 'UPDATE_BLOGS', note: res.data, index });
//                 } else if (res.status === 401 || res.status === 403) {
//                     dispatch({ type: "AUTHENTICATION_ERROR", data: res.data });
//                     throw res.data;
//                 }
//             })
//     }
// }

// export const deleteBlogs = index => {
//     return (dispatch, getState) => {

//         let headers = { "Content-Type": "application/json" };
//         let { token } = getState().auth;

//         if (token) {
//             headers["Authorization"] = `Token ${token}`;
//         }

//         let blogId = getState().blogs[index].id;

//         return fetch(`/api/blogs/${blogId}/`, { headers, method: "DELETE" })
//             .then(res => {
//                 if (res.status === 204) {
//                     return { status: res.status, data: {} };
//                 } else if (res.status < 500) {
//                     return res.json().then(data => {
//                         return { status: res.status, data };
//                     })
//                 } else {
//                     console.log("Server Error!");
//                     throw res;
//                 }
//             })
//             .then(res => {
//                 if (res.status === 204) {
//                     return dispatch({ type: 'DELETE_BLOGS', index });
//                 } else if (res.status === 401 || res.status === 403) {
//                     dispatch({ type: "AUTHENTICATION_ERROR", data: res.data });
//                     throw res.data;
//                 }
//             })
//     }
// }