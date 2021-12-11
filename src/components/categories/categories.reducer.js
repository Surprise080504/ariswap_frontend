import { BEFORE_CATEGORY, GET_CATEGORIES } from '../../redux/types';

const initialState = {
    categories: null,
    getAuth: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_CATEGORIES:
            return {
                ...state,
                categories: action.payload,
                getAuth: true
            }
        case BEFORE_CATEGORY:
            return {
                ...state,
                categories: null,
                getAuth: false
            }
        default:
            return {
                ...state
            }
    }
}