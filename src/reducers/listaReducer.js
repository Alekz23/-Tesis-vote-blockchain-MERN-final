
import { types } from '../types/types';

const initialState = {
    lista: [],
    activeLista: null
};


export const listaReducer = ( state = initialState, action ) => {

    switch ( action.type ) {
        
        case types.listaSetActive:
            return {
                ...state,
                activeLista: action.payload
            }
        
        case types.listaAddNew:
            return {
                ...state,
                lista: [
                    ...state.lista,
                    action.payload
                ]
            }
    
        case types.listaClearActiveElection:
            return {
                ...state,
                activeLista: null
            }


        case types.listaUpdated:
            return {
                ...state,
                lista: state.lista.map(
                    e => ( e.id === action.payload.id ) ? action.payload : e
                )
            }
        
        case types.listaDeleted:
            return {
                ...state,
                lista: state.lista.filter(
                    //e => ( e.id !== state.activeElection.id )
                    e => ( e.id !== state.activeLista.id )
                ),
                activeLista: null
            }

            case types.listaLoaded:
                return {
                    ...state,
                    lista: [ ...action.payload ]
                }

                case types.listaLogout:
                    return {
                        ...initialState
                    }
        
    

        default:
            return state;
    }


}
