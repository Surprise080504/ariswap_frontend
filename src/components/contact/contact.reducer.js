import { BEFORE_CONTACT, CREATE_CONTACT } from '../../redux/types';

const initialState = {
    contactAuth: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case CREATE_CONTACT:
            return {
                ...state,
                contactAuth: true
            }
        case BEFORE_CONTACT:
            return {
                ...state,
                contactAuth: false
            }
        default:
            return {
                ...state
            }
    }
}