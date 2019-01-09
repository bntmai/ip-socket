const initialState = {
    access_token: localStorage.getItem("access_token"),
    isAuthenticated: null,
    isLoading: false,
    user: null,
    errors: {},
};


export default function auth(state = initialState, action) {

    switch (action.type) {

        case 'USER_LOADING':
            return { ...state, isLoading: true };

        case 'USER_LOADED':
            return { ...state, isAuthenticated: true, isLoading: false, user: action.user };

        case 'LOGIN_SUCCESSFUL':
            localStorage.setItem("access_token", action.data['access_token']);
            console.log('Hi')
            return { ...state, ...action.data, isAuthenticated: true, isLoading: false, errors: null };

        case 'AUTHENTICATION_ERROR':return {...state, ...action.data};
        case 'LOGIN_FAILED':return {...state, ...action.data};
        case 'LOGOUT_SUCCESSFUL':
            localStorage.removeItem("access_token");
            console.log('Hii')
            return {
                ...state, errors: action.data, access_token: null, user: null,
                isAuthenticated: false, isLoading: false
            };
        case 'REGISTRATION_SUCCESSFUL':
            localStorage.setItem("access_token", action.data["result"]["access_token"]);
            return {...state, ...action.data, isAuthenticated: true, isLoading: false, errors: null};
        default:
            return state;
    }
}

