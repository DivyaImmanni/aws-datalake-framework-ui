import * as Constants from 'components/Constants/Constants';
import { combineReducers } from "redux";

const authentication = (state = {}, action) => {
    switch (action.type) {
        case Constants.SET_AUTHENTICATION:
            return {
                 ... action.payload
            }
        default:
            return { ...state }
    }
}

const authenticationReducer = combineReducers({
    authentication
})

export default authenticationReducer;