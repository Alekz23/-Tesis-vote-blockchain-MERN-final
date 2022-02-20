import { types } from '../types/types';

const initialState = {
    candidatos: [],
    activeCandidato: null
};


export const candidatoReducer = ( state = initialState, action ) => {

    switch ( action.type ) {
        
        case types.candidatoSetActive:
            return {
                ...state,
                activeCandidato: action.payload
            }
        
        case types.candidatoAddNew:
            return {
                ...state,
                candidatos: [
                    ...state.candidatos,
                    action.payload
                ]
            }
    
        case types.candidatoClearActiveCandidato:
            return {
                ...state,
                activeCandidato: null
            }


        case types.candidatoUpdated:
            return {
                ...state,
                candidatos: state.candidatos.map(
                    e => ( e.id === action.payload.id ) ? action.payload : e
                )
            }
        
        case types.candidatoDeleted:
            return {
                ...state,
                candidatos: state.candidatos.filter(
                    e => ( e.id !== state.activeCandidato.id )
                ),
                activeCandidato: null
            }

        case types.candidatoLoaded:
            return {
                ...state,
                candidatos: [ ...action.payload ]
            }

        case types.candidatoLogout:
            return {
                ...initialState
            }

        default:
            return state;
    }


}
