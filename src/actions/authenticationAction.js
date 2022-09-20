import * as constants from 'components/Constants/Constants';

export const setAuthentication= (info) => dispatch => {
    dispatch({
        type: constants.SET_AUTHENTICATION,
        payload: info
    })
}
