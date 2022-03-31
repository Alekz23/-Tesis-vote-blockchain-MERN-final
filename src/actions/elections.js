import Swal from "sweetalert2";
import { fetchConToken } from "../helpers/fetch";
import { prepareElections } from "../helpers/prepareElections";
import { types } from "../types/types";
import { toast } from 'react-toastify';


export const electionStartAddNew= (election) => {
    return async( dispatch, getState ) => {

        const { uid, name } = getState().auth;

        try {
            const resp = await fetchConToken('elecciones', election, 'POST');
            const body = await resp.json();

            //console.log(body)

            if ( body.ok ) {
                election.id = body.eleccion.id; //id de la eleccion una vez en la bdd
                election.user = {
                    _id: uid,
                    name: name
                }
                //console.log( election );
                dispatch( electionAddNew( election ) );
            }else{
                toast.error( body.errors?.nombre?.msg ||
                    body.errors?.start?.msg ||
                    body.errors?.end?.msg ||
                    body.errors?.descripcion?.msg
                    || body.msg, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
            }


        } catch (error) {
            console.log(error);
        }

        

    }
};


//estas funciones se muestran en los screens para llamarlas y modificarlas
const electionAddNew = (election) => ({
    type: types.electionAddNew,
    payload: election
});

export const electionSetActive = (election) => ({
    type: types.electionSetActive,
    payload: election
});

export const electionClearActiveElection = () => ({
    type: types.electionClearActiveElection
});

export const  electionStartUpdated=(election)=>{
    return async (dispatch) => {

        try {
            const resp = await fetchConToken(`elecciones/${election.id}`, election, 'PUT');
            const body = await resp.json();

            //console.log(election)

            if ( body.ok ) {
                dispatch(electionUpdated(election));
                //console.log('sie entra al update')
            }else{
                Swal.fire('Error', body.msg, 'error')
               
            }
        } catch (error) {
            console.log(error);
            
        }
    }
}


const electionUpdated = ( election ) => ({
    type: types.electionUpdated,
    payload: election
});



export const electionStartLoading = () => {
    return async(dispatch) => {

        try {
            
            const resp = await fetchConToken( 'elecciones' );
            const body = await resp.json();
            //console.log(body)
            const elections = prepareElections( body.elecciones );
            dispatch( electionLoaded( elections ) );

        } catch (error) {
            console.log(error)
        }

    }
}

const electionLoaded = (elections) => ({
    type: types.electionLoaded,
    payload: elections
})

export const electionStartDelete = () => {
    return async ( dispatch, getState ) => {

        const { id } = getState().eleccion.activeElection;
        //console.log(id)
        try {
            const resp = await fetchConToken(`elecciones/${ id }`, {}, 'DELETE' );
            const body = await resp.json();

            if ( body.ok ) {
                dispatch( electionDeleted() );
               // console.log('entra a eliminar')
            } else {
                Swal.fire('Error', body.msg, 'error');
            }


        } catch (error) {
            console.log(error)
        }

    }
}


 const electionDeleted = () => ({ type: types.electionDeleted });

 export const electionLogout =() => ({ type: types.electionLogout });



 //metodo para obtener el estado global de la eleccion para obtener resultados/votaciones /addd usuarios
 //y buscar las elecciones conforme a la eleccion activacion
export const electionEnable = (election) => ({
    type: types.electionEnabled,
    payload: election
});

export const electionClearEnable = () => ({
    type: types.electionClearEnable
});
