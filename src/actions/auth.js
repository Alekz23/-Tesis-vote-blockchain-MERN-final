import Swal from 'sweetalert2';
import { fetchSinToken,  fetchConToken} from '../helpers/fetch';
import { types } from '../types/types';
import { electionLogout } from './elections';

export const startLogin=(correo, password) => {
    return async(dispatch)=>{
        const resp= await fetchSinToken('auth/login', {correo, password}, 'POST');
        const body= await resp.json();

        if( body.ok ) {
            localStorage.setItem('token', body.token );
            localStorage.setItem('token-init-date', new Date().getTime() );

          //busca en la respuesat json del body si tiene objetos ir esacalando user.name o name
            dispatch( login({
                uid: body.uid,
                name: body.name,
                cedula: body.cedula,
                rol: body.rol,
                
                
            }) )
        } else {
            Swal.fire('Error', body.msg, 'error');
            console.log(body.errors)
        }
        

    }
}

export const startChecking = () => {
    return async(dispatch) => {

        const resp = await  fetchConToken( 'auth/renew' );
        const body = await resp.json();

        console.log(body,'renew');
        if( body.ok ) {
            localStorage.setItem('token', body.token );
            localStorage.setItem('token-init-date', new Date().getTime() );

            dispatch( login({
                uid: body.uid,
                name: body.nombre,
                cedula: body.cedula,
                rol: body.rol,
            }) )
        } else {
            dispatch( checkingFinish() );
        }
    }
}


export const startRegister=(cedula, nombre, correo, password) => {
    return async(dispatch)=>{
        const resp= await fetchSinToken('auth/new', {cedula, nombre, correo, password, rol:"ADMIN_ROLE"}, 'POST');
        const body= await resp.json();
        console.log(body)
        if( body.ok ) {
            
            localStorage.setItem('token', body.token );
            localStorage.setItem('token-init-date', new Date().getTime() );
          
            dispatch( login({
                //busca en la respuesat json del body si tiene objetos ir esacalando user.name o name
                uid: body.uid,
                name: body.nombre,
               
                
            }) )
        } else {
            Swal.fire('Error', body.msg, 'error');
            
        }
        

    }
}



const checkingFinish = () => ({ type: types.authCheckingFinish });


const login = ( user ) => ({
    type: types.authLogin,
    payload: user
});

export const startLogout = () => {
    return ( dispatch ) => {

        localStorage.clear();
        dispatch( electionLogout());
        dispatch( logout() );
    }
}

const logout = () => ({ type: types.authLogout })