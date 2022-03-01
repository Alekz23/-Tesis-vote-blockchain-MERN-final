import Swal from "sweetalert2";
import { fetchConToken } from "../helpers/fetch";
import { fileUpload } from "../helpers/fileUpload";
import { types } from "../types/types";
import { toast } from 'react-toastify';


export const listaStartAddNew = (lista) => {
    return async (dispatch, getState) => {

        const { uid, name } = getState().auth;

        try {
            const resp = await fetchConToken('listas', lista, 'POST');
            const body = await resp.json();

            console.log(body, 'lo q viene del formulario')

            if (body.ok) {
                lista.id = body.lista.id; //id de la eleccion una vez en la bdd
                lista.user = {
                    _id: uid,
                    name: name
                }
                console.log(lista, 'lo q se guarda en la bdd');
                dispatch(listaAddNew(lista));
            } else {

                toast.error( body.errors?.eleccion?.msg ||
                    body.errors?.nombre?.msg
                    || body.msg, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });
                  
                // Swal.fire('Error', body.errors?.eleccion?.msg ||
                //     body.errors?.nombre?.msg
                //     || body.msg, 'error');

            }


        } catch (error) {
            console.log(error);
        }



    }
};


//estas funciones se muestran en los screens para llamarlas y modificarlas
const listaAddNew = (lista) => ({
    type: types.listaAddNew,
    payload: lista
});

export const listaSetActive = (lista) => ({
    type: types.listaSetActive,
    payload: lista
});

export const listaClearActiveLista = () => ({
    type: types.listaClearActiveElection
});

export const listaStartUpdated = (lista) => {
    return async (dispatch) => {

        try {
            const resp = await fetchConToken(`listas/${lista.id}`, lista, 'PUT');
            const body = await resp.json();

            console.log(lista)

            if (body.ok) {
                dispatch(listaUpdated(lista));
                console.log('sie entra al update')
            } else {
                Swal.fire('Error', body.msg, 'error')

            }
        } catch (error) {
            console.log(error);

        }
    }
}


const listaUpdated = (lista) => ({
    type: types.listaUpdated,
    payload: lista
});


export const listaStartLoading = () => {
    return async (dispatch) => {

        try {

            const resp = await fetchConToken('listas');
            const body = await resp.json();
            console.log(body)
            //const listas = prepareElections( body.lista );
            dispatch(listaLoaded(body.listas));

        } catch (error) {
            console.log(error)
        }

    }
}

const listaLoaded = (lists) => ({
    type: types.listaLoaded,
    payload: lists
})

export const listaStartDelete = () => {
    return async (dispatch, getState) => {

        const { id } = getState().lista.activeLista;
        console.log(id)
        try {
            const resp = await fetchConToken(`listas/${id}`, {}, 'DELETE');
            const body = await resp.json();

            if (body.ok) {
                dispatch(listaDeleted());
                console.log('entra a eliminar')
            } else {
                Swal.fire('Error', body.msg, 'error');
            }


        } catch (error) {
            console.log(error)
        }

    }
}


const listaDeleted = () => ({ type: types.listaDeleted });

export const listaLogout = () => ({ type: types.listaLogout });


//metodo para agregar imagenes
export const startUploading = (file) => {
    return async () => {


        console.log(file);
        //console.log(activeLista);


        Swal.fire({
            title: 'Uploading...',
            text: 'Please wait...',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading();
            }
        });

        const fileUrl = await fileUpload(file);
        console.log(fileUrl)
        Swal.close();

        return fileUrl;

    }
    // activeLista.url = fileUrl;

    // dispatch( startSaveNote( activeLista ) )



}