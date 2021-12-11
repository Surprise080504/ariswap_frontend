import { BEFORE_COLLECTION, GET_COLLECTION, SET_AUTH_STATE, GET_COLLECTIONS, UPSERT_COLLECTION, DELETE_COLLECTION, ALL_COLLECTIONS } from '../../redux/types';

const initialState = {
    collection: null,
    collections: null,
    allCollections:null,
    pagination: null,
    deleteAuth: false,
    upsertAuth: false,
    getAuth: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_COLLECTION:
            return {
                ...state,
                collection: action.payload.collection,
                getAuth: true
            }
            case ALL_COLLECTIONS:
                return {
                    ...state,
                    collection: action.payload.allCollections,
                    getAuth: true
                }
        case SET_AUTH_STATE:
            return {
                ...state,
                getAuth: false
            }

        case UPSERT_COLLECTION:
            return {
                ...state,
                collection: action.payload,
                upsertAuth: true
            }
        case DELETE_COLLECTION:
            return {
                ...state,
                collection: action.payload,
                deleteAuth: true
            }
        case GET_COLLECTIONS:
            return {
                ...state,
                collections: action.payload.collections,
                pagination: action.payload.pagination,
                getAuth: true
            }
        case BEFORE_COLLECTION:
            return {
                ...state,
                collection: null,
                collections: null,
                pagination: null,
                deleteAuth: false,
                upsertAuth: false,
                getAuth: false
            }
        default:
            return {
                ...state
            }
    }
}