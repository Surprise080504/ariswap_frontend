import { GET_ERRORS, BEFORE_AUCTION, GET_AUCTIONS } from '../../redux/types';
import { ENV } from './../../config/config';
import { emptyError } from '../../redux/shared/error/error.action'

export const beforeAuction = () => {
    return {
        type: BEFORE_AUCTION
    }
}

export const getLiveAuctions = (qs = null) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}auctions/live`;
   


    if (qs)
        url += `?${qs}`
       
    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'Access-Control-Allow-Origin': '*',
            'x-access-token': ENV.getUserKeys('accessToken') && ENV.getUserKeys('accessToken').accessToken ? ENV.getUserKeys('accessToken').accessToken : ''
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            dispatch({
                type: GET_AUCTIONS,
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