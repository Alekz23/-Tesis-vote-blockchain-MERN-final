import { types } from '../types/types';

const initialState = {
    usuarios: [],
    activeUser: null
};


export const userReducer = ( state = initialState, action ) => {

    switch ( action.type ) {
        
        case types.userSetActive:
            return {
                ...state,
                activeUser: action.payload
            }
        
        case types.userAddNew:
            return {
                ...state,
                usuarios: [
                    ...state.usuarios,
                    action.payload
                ]
            }
    
        case types.userClearActiveUser:
            return {
                ...state,
                activeUser: null
            }


        case types.userUpdated:
            return {
                ...state,
                usuarios: state.usuarios.map(
                    e => ( e._id === action.payload._id ) ? action.payload : e
                )
            }
        
        case types.userDeleted:
            return {
                ...state,
                usuarios: state.usuarios.filter(
                    e => ( e._id !== state.activeUser._id )
                ),
                activeUser: null
            }

        case types.userLoaded:
            return {
                ...state,
                usuarios: [ ...action.payload ]
            }

        case types.userLogout:
            return {
                ...initialState
            }

        default:
            return state;
    }


}
