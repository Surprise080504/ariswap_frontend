import { BEFORE_NFT, GET_NFTS, GET_NFT, UPSERT_NFT,NFTALL } from '../../redux/types';

const initialState = {
    nftsData: {},
    nftAll:{},
    nftsAuth: false,
    upsertAuth: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case UPSERT_NFT:
            return {
                ...state,
                nftsData: action.payload,
                upsertAuth: true
            }
        case GET_NFT:
            return {
                ...state,
                nftsData: action.payload,
                nftsAuth: true
            }
            case NFTALL:
        
                return {
                    ...state,
                    nftAll: action.payload,
                }
            
        case GET_NFTS:
            return {
                ...state,
                nftsData: action.payload,
                nftsAuth: true
            }
        case BEFORE_NFT:
            return {
                ...state,
                nftsData: {},
                nftsAuth: false,
                upsertAuth: false
            }
        default:
            return {
                ...state
            }
    }
}