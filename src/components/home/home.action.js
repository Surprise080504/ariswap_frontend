import { EMPTY_ERRORS, GET_ERRORS, BEFORE_HOME, HOME_PAGE_DATA, } from '../../redux/types';
import { ENV } from './../../config/config';

export const emptyError = () => {
    return {
        type: EMPTY_ERRORS
    }
}

export const beforeHome = () => {
    return {
        type: BEFORE_HOME
    }
}

export const getHomePageData = () => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}/PATH`;
    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'Access-Control-Allow-Origin': '*',
            'x-auth-token': ENV.x_auth_token
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            dispatch({
                type: HOME_PAGE_DATA,
                payload: data
            })
        } else {
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(errors => {
        dispatch({
            type: GET_ERRORS,
            payload: errors
        })
    })
};