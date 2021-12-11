import { BEFORE_WALLET, SET_WALLET, GET_WALLET } from '../../redux/types';

const initialState = {
    connectedAddress: '',
    walletAuth: false,
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_WALLET:
            return {
                ...state,
                connectedAddress: action.payload,
                walletAuth: true
            }
        case GET_WALLET:
            return {
                ...state
            }
        case BEFORE_WALLET:
            return {
                ...state,
                connectedAddress: '',
                walletAuth: false,
                userAuth: false,
            }
        default:
            return {
                ...state
            }
    }
}