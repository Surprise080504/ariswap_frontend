import { BEFORE_HOME, HOME_PAGE_DATA } from '../../redux/types';

const initialState = {
    featuredItems: [], // list of featured items
    featuredItemsAuth: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case HOME_PAGE_DATA:
            return {
                ...state,
                featuredItems: true,
                featuredItems: action.payload
            }
        case BEFORE_HOME:
            return {
                ...state,
                featuredItems: [],
                featuredItemsAuth: false,
            }
        default:
            return {
                ...state
            }
    }
}