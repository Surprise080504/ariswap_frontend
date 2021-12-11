import { GET_ERRORS, BEFORE_CONTACT, CREATE_CONTACT } from '../../redux/types';
import { ENV } from './../../config/config';
import { emptyError } from '../../redux/shared/error/error.action'

export const beforeContact = () => {
    return {
        type: BEFORE_CONTACT
    }
}

export const submitContact = (body) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}contact/submit`;
    
    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'Access-Control-Allow-Origin': '*',
            'x-access-token': ENV.getUserKeys('accessToken') && ENV.getUserKeys('accessToken').accessToken ? ENV.getUserKeys('accessToken').accessToken : ''
        },
        body
    }).then(res => res.json()).then(data => {
        if (data.status) {
            dispatch({
                type: CREATE_CONTACT,
                payload: data.data
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