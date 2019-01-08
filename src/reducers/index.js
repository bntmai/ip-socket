import auth from "./auth";
import { combineReducers } from 'redux'

const ipApp = combineReducers({
     auth,
})

export default ipApp;