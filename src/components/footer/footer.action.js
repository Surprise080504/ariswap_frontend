import { ENV } from './../../config/config';
import { GET_ERRORS, BEFORE_FOOTER, GET_FOOTER } from '../../redux/types';
import { emptyError } from '../../redux/shared/error/error.action';

export const beforeFooter = () => {
    return {
        type: BEFORE_FOOTER
    }
}

export const getFooter = () => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}/settings/get`;
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'Access-Control-Allow-Origin': '*',
            'x-access-token': ENV.getUserKeys('accessToken') && ENV.getUserKeys('accessToken').accessToken ? ENV.getUserKeys('accessToken').accessToken : ''
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            dispatch({
                type: GET_FOOTER,
                payload: data.settings
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


