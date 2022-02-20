
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
    activeElection: null
};


export const electionByIdReducer = ( state = initialState, action ) => {

    switch ( action.type ) {
        
       

                case types.electionLoadedByList:
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
