import { BEFORE_FOOTER, GET_FOOTER } from '../../redux/types';

const initialState = {
    settings: null,
    settingsAuth: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_FOOTER:
            return{
                ...state,
                settings: action.payload,
                settingsAuth: true
            }
        case BEFORE_FOOTER:
            return {
                ...state,
                settings: null,
                settingAuth: false
            }
        default:
            return {
                ...state
            }
    }
}