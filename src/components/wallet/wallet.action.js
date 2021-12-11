import { SET_WALLET, GET_WALLET, BEFORE_WALLET } from '../../redux/types';
import { emptyError } from '../../redux/shared/error/error.action';

export const beforeWallet = () => {
    return {
        type: BEFORE_WALLET
    }
}

// method to set wallet address
export const setWalletAddress = (address) => dispatch => {
    dispatch(emptyError())
    dispatch({
        type: SET_WALLET,
        payload: address
    })
}

// method to get wallet address
export const getWalletAddress = () => dispatch => {
    dispatch({
        type: GET_WALLET
    })
}