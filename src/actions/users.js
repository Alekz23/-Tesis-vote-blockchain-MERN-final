import Swal from 'sweetalert2';

import { fetchConToken } from '../helpers/fetch';
import { types } from '../types/types';


export const userStartAddNew = ( user ) => {
    return async( dispatch, getState ) => {

        const { uid, name } = getState().auth;

     
            const resp = await fetchConToken('auth/new', user, 'POST');
            const body = await resp.json();

            console.log(body, 'asi lega el body de usuarios')

            if ( body.ok ) {
                user._id = body.uid;
                user.user = {
                    _id: uid,
                    name: name
                }
                console.log( user );
                dispatch( userAddNew( user ) );
            }else{
                Swal.fire('Error', body.msg, 'error');

            }


    }
}



const userAddNew = (user) => ({
    type: types.userAddNew,
    payload: user
});

export const userSetActive = (user) => ({
    type: types.userSetActive,
    payload: user
});

export const userClearActiveUser = () => ({ type: types.userClearActiveUser });



export const userStartUpdate = ( user ) => {
    return async(dispatch) => {

        try {
            const resp = await fetchConToken(`auth/${ user._id }`, user, 'PUT' );
            const body = await resp.json();

            if ( body.ok ) {
                dispatch( userUpdated( user ) );
            } else {
                Swal.fire('Error', body.msg, 'error');
            }


        } catch (error) {
            console.log(error)
        }

    }
}

const userUpdated = ( user ) => ({
    type: types.userUpdated,
    payload: user
});


export const userStartDelete = () => {
    return async ( dispatch, getState ) => {

        const { _id } = getState().user.activeUser;
        try {
            const resp = await fetchConToken(`auth/${ _id }`, {}, 'DELETE' );
            const body = await resp.json();

            if ( body.ok ) {
                dispatch( userDeleted() );
            } else {
                Swal.fire('Error', body.msg, 'error');
            }


        } catch (error) {
            console.log(error)
        }

    }
}


const userDeleted = () => ({ type: types.userDeleted });


export const userStartLoading = () => {
    return async(dispatch) => {

        try {
            
            const resp = await fetchConToken( 'auth' );
            const body = await resp.json();
            
            dispatch( userLoaded( body.usuarios ) );

        } catch (error) {
            console.log(error)
        }

    }
}

const userLoaded = (user) => ({
    type: types.userLoaded,
    payload: user
})

export const userLogout =() => ({ type: types.userLogout });