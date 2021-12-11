import { BEFORE_FAQ, GET_FAQS } from '../../redux/types';

const initialState = {
    faqs: null,
    faqsAuth: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_FAQS:
            return {
                ...state,
                faqs: action.payload,
                faqsAuth: true
            }
        case BEFORE_FAQ:
            return {
                ...state,
                faqs: null,
                faqsAuth: false
            }
        default:
            return {
                ...state
            }
    }
}