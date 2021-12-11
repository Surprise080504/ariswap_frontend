import { toast } from 'react-toastify';
import { GET_ERRORS, BEFORE_BID, GET_BIDS, DELETE_BID, CREATE_BID, ACCEPT_BID } from '../../redux/types';
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from './../../config/config';
import {placeBidNft, acceptNftOffer} from '../../utils/web3'
export const beforeBid = () => {
    return {
        type: BEFORE_BID
    }
};

export const placeBid = (body,tokenId,price,toAddress,fromAddress) => dispatch => {
    alert("in herer")
    // dispatch(emptyError());
    const url = `${ENV.url}bid/create`;

    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'Access-Control-Allow-Origin': '*',
            'x-access-token': ENV.getUserKeys('accessToken') && ENV.getUserKeys('accessToken').accessToken ? ENV.getUserKeys('accessToken').accessToken : ''
        },
        body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
      console.log('data', data)
        if (data.success) {
    //    placeBidNft(body,tokenId,price,toAddress,fromAddress)
           
            toast.success(data.message)
            dispatch({
                type: CREATE_BID,
                payload: data
            })
        } else {
            toast.error(data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
      console.log('listing', error)
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
 
};

export const getBids = (qs = '') => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}bid/list`;
    // if (qs)
    //     url += `?${qs}`

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
                type: GET_BIDS,
                payload: data.data
            })
        } else {
            if (!qs)
                toast.error(data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};

export const deleteBid = (bidId) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}bid/delete/${bidId}`;

    fetch(url, {
        method: 'DELETE',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'Access-Control-Allow-Origin': '*',
            'x-access-token': ENV.getUserKeys('accessToken') && ENV.getUserKeys('accessToken').accessToken ? ENV.getUserKeys('accessToken').accessToken : ''
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            dispatch({
                type: DELETE_BID,
                payload: data
            })
        } else {
            toast.error(data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};

export const acceptBid = (body,tokenId) => dispatch => {
    dispatch(emptyError());
   
    const url = `${ENV.url}bid/accept`;
    fetch(url, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'Access-Control-Allow-Origin': '*',
            'x-access-token': ENV.getUserKeys('accessToken') && ENV.getUserKeys('accessToken').accessToken ? ENV.getUserKeys('accessToken').accessToken : ''
        },
        body: JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
           
        //   acceptNftOffer(tokenId,body);
            
            toast.success(data.message)

            dispatch({
                type: ACCEPT_BID,
                payload: data
            })
        } else {
            toast.error(data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};