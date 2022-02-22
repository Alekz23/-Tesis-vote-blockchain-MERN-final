import { types } from '../types/types';

const initialState = {
    cargos: [],
    activeCargo: null
};


export const cargoReducer = (state = initialState, action) => {

    switch (action.type) {

        case types.cargoSetActive:
            return {
                ...state,
                activeCargo: action.payload
            }

        case types.cargoAddNew:
            return {
                ...state,
                cargos: [
                    ...state.cargos,
                    action.payload
                ]
            }

        case types.cargoClearActiveCargo:
            return {
                ...state,
                activeCargo: null
            }



        case types.cargoDeleted:
            return {
                ...state,
                cargos: state.cargos.filter(
                    e => (e.id !== state.activeCargo.id)
                ),
                activeCargo: null
            }

        case types.cargoLoaded:
            return {
                ...state,
                cargos: [...action.payload]
            }

        case types.cargoLogout:
            return {
                ...initialState
            }

        default:
            return state;
    }


}
