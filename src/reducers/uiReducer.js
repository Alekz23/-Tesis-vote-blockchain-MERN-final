import { types } from "../types/types";

const initialState = {
    modalOpen: false,
}


//agrega lo que quiere hacer con las funciones en types
export const uiReducer = ( state = initialState, action ) => {

    switch ( action.type ) {
        case types.uiOpenModal:
            return {
                ...state,
                modalOpen: true
            }

        case types.uiCloseModal:
            return {
                ...state,
                modalOpen: false
            }
    
        default:
            return state;
    }


}