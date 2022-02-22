import Swal from 'sweetalert2';

import { fetchConToken } from '../helpers/fetch';
import { types } from '../types/types';


export const cargoStartAddNew = ( cargo ) => {
    return async( dispatch, getState ) => {

        const { uid, name } = getState().auth;

        try {
            const resp = await fetchConToken('cargos', cargo, 'POST');
            const body = await resp.json();

            console.log(body)

            if ( body.ok ) {
                cargo.id = body.cargo.id;
                cargo.user = {
                    _id: uid,
                    name: name
                }
                console.log( cargo );
                dispatch( cargoAddNew( cargo ) );
            }


        } catch (error) {
            console.log(error);
        }

        

    }
}



const cargoAddNew = (cargo) => ({
    type: types.cargoAddNew,
    payload: cargo
});

export const cargoSetActive = (cargo) => ({
    type: types.cargoSetActive,
    payload: cargo
});

export const cargoClearActiveCargo = () => ({ type: types.cargoClearActiveCargo });





export const cargoStartDelete = () => {
    return async ( dispatch, getState ) => {

        const { id } = getState().cargo.activeCargo;
        try {
            const resp = await fetchConToken(`cargos/${ id }`, {}, 'DELETE' );
            const body = await resp.json();

            if ( body.ok ) {
                dispatch( cargoDeleted() );
            } else {
                Swal.fire('Error', body.msg, 'error');
            }


        } catch (error) {
            console.log(error)
        }

    }
}


const cargoDeleted = () => ({ type: types.cargoDeleted });


export const cargoStartLoading = () => {
    return async(dispatch) => {

        try {
            
            const resp = await fetchConToken( 'cargos' );
            const body = await resp.json();
            
            dispatch( cargoLoaded( body.cargos ) );

        } catch (error) {
            console.log(error)
        }

    }
}

const cargoLoaded = (cargo) => ({
    type: types.cargoLoaded,
    payload: cargo
})

export const cargoLogout =() => ({ type: types.cargoLogout });