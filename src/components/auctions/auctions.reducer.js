import { BEFORE_AUCTION, GET_AUCTIONS } from '../../redux/types';

const initialState = {
    auctions: null,
    pagination: null,
    getAuth: false,

    auctionsData: {},
    auctionsAuth: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_AUCTIONS:
            return {
                ...state,
                auctions: action.payload.auctions,
                pagination: action.payload.pagination,
                getAuth: true
            }
        case BEFORE_AUCTION:
            return {
                ...state,
                auctionsData: {},
                auctionsAuth: false
            }
        default:
            return {
                ...state
            }
    }
}