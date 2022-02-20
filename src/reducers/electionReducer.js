
// election:[{
//     id: new Date().getTime(),
//     name: 'election 2021',
//     start: moment().toDate(),
//     end: moment().add( 2, 'hours' ).toDate(),
//     description: 'elections students',
//     user: {
//         _id: '123',
//         name: 'Fernando'
//     }
// }]

import { types } from '../types/types';

const initialState = {
    election: [],
    activeElection: null,
    enableElection: null
};


export const electionReducer = ( state = initialState, action ) => {

    switch ( action.type ) {
        
        case types.electionSetActive:
            return {
                ...state,
                activeElection: action.payload
            }
            //eleccion global habilitada 
            case types.electionEnabled:
            return {
                ...state,
                enableElection: action.payload
            }
        
        case types.electionAddNew:
            return {
                ...state,
                election: [
                    ...state.election,
                    action.payload
                ]
            }
    
        case types.electionClearActiveElection:
            return {
                ...state,
                activeElection: null
            }

            case types.electionClearEnable:
                return {
                    ...state,
                    enableElection: null
                }
    

        case types.electionUpdated:
            return {
                ...state,
                election: state.election.map(
                    e => ( e.id === action.payload.id ) ? action.payload : e
                )
            }
        
        case types.electionDeleted:
            return {
                ...state,
                election: state.election.filter(
                    //e => ( e.id !== state.activeElection.id )
                    e => ( e.id !== state.activeElection.id )
                ),
                activeElection: null
            }

            case types.electionLoaded:
                return {
                    ...state,
                    election: [ ...action.payload ]
                }

            
                
                case types.electionLogout:
                    return {
                        ...initialState
                    }
        
    

        default:
            return state;
    }


}
