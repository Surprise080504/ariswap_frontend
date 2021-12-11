import { BEFORE_USER, SET_USER, SET_CREATORS, TOP_SELLERS, SET_INDIVIDUAL_USER, GET_USER } from '../../redux/types';

const initialState = {
    userData: null,
    userAuth: false,
    creatorsAuth: false,
    topSellersAuth: false,
    individualUserAuth: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_USER:
            return {
                ...state,
                userData: action.payload,
                userAuth: true
            }
        case GET_USER:
            return {
                ...state
            }
        case SET_CREATORS:
            return {
                ...state,
                creators: action.payload,
                creatorsAuth: true
            }
        case TOP_SELLERS:
            return {
                ...state,
                sellers: action.payload,
                topSellersAuth: true
            }
        case SET_INDIVIDUAL_USER:
            return {
                ...state,
                individualUser: action.payload,
                individualUserAuth: true
            }
        case BEFORE_USER:
            return {
                ...state,
                userData: null,
                userAuth: false,
                creatorsAuth: false,
                topSellersAuth: false,
                individualUserAuth: false,
            }
        default:
            return {
                ...state
            }
    }
}