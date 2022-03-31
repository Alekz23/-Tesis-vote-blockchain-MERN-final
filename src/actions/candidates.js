import Swal from 'sweetalert2';

import { fetchConToken } from '../helpers/fetch';
import { types } from '../types/types';


export const candidatoStartAddNew = ( candidato ) => {
    return async( dispatch, getState ) => {

        const { uid, name } = getState().auth;

        try {
            const resp = await fetchConToken('candidatos', candidato, 'POST');
            const body = await resp.json();

            //console.log(body)

            if ( body.ok ) {
                candidato.id = body.candidato.id;
                candidato.user = {
                    _id: uid,
                    name: name
                }
                //console.log( candidato );
                dispatch( candidatoAddNew( candidato ) );
            }


        } catch (error) {
            console.log(error);
        }

        

    }
}



const candidatoAddNew = (candidato) => ({
    type: types.candidatoAddNew,
    payload: candidato
});

export const candidatoSetActive = (candidato) => ({
    type: types.candidatoSetActive,
    payload: candidato
});

export const candidatoClearActiveCandidato = () => ({ type: types.candidatoClearActiveCandidato });



export const candidatoStartUpdate = ( candidato ) => {
    return async(dispatch) => {

        try {
            const resp = await fetchConToken(`candidatos/${ candidato.id }`, candidato, 'PUT' );
            const body = await resp.json();

            if ( body.ok ) {
                dispatch( candidatoUpdated( candidato ) );
            } else {
                Swal.fire('Error', body.msg, 'error');
            }


        } catch (error) {
            console.log(error)
        }

    }
}

const candidatoUpdated = ( event ) => ({
    type: types.candidatoUpdated,
    payload: event
});


export const candidatoStartDelete = () => {
    return async ( dispatch, getState ) => {

        const { id } = getState().candidato.activeCandidato;
        try {
            const resp = await fetchConToken(`candidatos/${ id }`, {}, 'DELETE' );
            const body = await resp.json();

            if ( body.ok ) {
                dispatch( candidatoDeleted() );
            } else {
                Swal.fire('Error', body.msg, 'error');
            }


        } catch (error) {
            console.log(error)
        }

    }
}


const candidatoDeleted = () => ({ type: types.candidatoDeleted });


export const candidatoStartLoading = () => {
    return async(dispatch) => {

        try {
            
            const resp = await fetchConToken( 'candidatos' );
            const body = await resp.json();
            
            dispatch( candidatoLoaded( body.candidatos ) );

        } catch (error) {
            console.log(error)
        }

    }
}

const candidatoLoaded = (candidato) => ({
    type: types.candidatoLoaded,
    payload: candidato
})

export const candidatoLogout =() => ({ type: types.candidatoLogout });