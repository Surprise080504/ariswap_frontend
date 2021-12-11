import { BEFORE_OFFER, GET_OFFERS, CREATE_OFFER, DELETE_OFFER, ACCEPT_OFFER } from '../../redux/types';

const initialState = {
    offer: null,
    offers: null,
    pagination: null,
    deleteAuth: false,
    createAuth: false,
    getAuth: false,
    acceptAuth: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_OFFERS:
            return {
                ...state,
                offers: action.payload.offers,
                pagination: action.payload.pagination,
                getAuth: true
            }
        case CREATE_OFFER:
            return {
                ...state,
                offer: action.payload,
                createAuth: true
            }
        case ACCEPT_OFFER:
            return {
                ...state,
                offer: action.payload,
                acceptAuth: true
            }
        case DELETE_OFFER:
            return {
                ...state,
                offer: action.payload,
                deleteAuth: true
            }
        case BEFORE_OFFER:
            return {
                ...state,
                offer: null,
                offers: null,
                pagination: null,
                deleteAuth: false,
                createAuth: false,
                getAuth: false,
                acceptAuth: false
            }
        default:
            return {
                ...state
            }
    }
}