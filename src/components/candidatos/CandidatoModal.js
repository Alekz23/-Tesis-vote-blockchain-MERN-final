import React, { useEffect } from 'react';
import { useState } from 'react';
import Modal from 'react-modal';

import { useDispatch, useSelector } from 'react-redux';
import { uiCloseModal } from '../../actions/ui';
import { listaStartLoading } from '../../actions/lists';
import { candidatoClearActiveCandidato, candidatoStartAddNew, candidatoStartLoading, candidatoStartUpdate } from '../../actions/candidates';
import Swal from 'sweetalert2';
import { fileUpload } from '../../helpers/fileUpload';
import { cargoStartLoading } from '../../actions/cargos';
import { toast } from 'react-toastify';



const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};
Modal.setAppElement('#root');

const initEvent = {
    nombre: '',
    apellido: '',
    cargo: '',
    lista: '',
    img: ''
}

export const CandidatoModal = ({ idLista }) => {


    //const [isOpen, setIsOpen] = useState(true); // abrir y cerrar el formulario
    // toma los valores del state ui
    const { modalOpen } = useSelector(state => state.ui);
    const dispatch = useDispatch(); //modifica el estado de las funciones
    const { activeCandidato } = useSelector(state => state.candidato);
    const [lists] = useSelector(state => [state.lista.lista]);
    const [cargos] = useSelector(state => [state.cargo.cargos]);


    useEffect(() => {
        dispatch(listaStartLoading());
    }, [dispatch])

    useEffect(() => {
        dispatch(cargoStartLoading());
    }, [dispatch])


    const [formValues, setFormValues] = useState(initEvent);
    const { nombre, apellido, cargo, img } = formValues;
    const [titleValid, setTitleValid] = useState(true);

    useEffect(() => {
        if (activeCandidato) {
            setFormValues(activeCandidato);
        } else {
            setFormValues(initEvent);
        }
    }, [activeCandidato, setFormValues])


    const closeModal = (e) => {
        dispatch(uiCloseModal());
        dispatch(candidatoClearActiveCandidato);
        setFormValues(initEvent); //se cierra el modal y los valores se borran
    }

    //con el valor de los inputs por medio del name, agrega al state del formValues
    const handleInputChange = ({ target }) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value
        });
    }

    //tomar todos los valores del formulario al dar al boton guardar
    const handleSubmitForm = (e) => {

        const nuevo = {
            ...formValues, lista:
                idLista, cargo: formValues.cargo === '' ?
                    cargos[0].nombre
                    : cargo
        }


        e.preventDefault();

        if (nombre.trim().length < 2) {

            toast.error('El nombre es obligatorio', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            return setTitleValid(false);
        }

        if (apellido.trim().length < 2) {

            return toast.error('El apellido es obligatorio', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            
        }

        if (activeCandidato) {
            dispatch(candidatoStartUpdate(formValues))
        } else {
            dispatch(candidatoStartAddNew(nuevo));
        }
        setTitleValid(true);
        dispatch(candidatoStartLoading());
        closeModal();

    }

    const startUploading = (file) => {
        return async () => {
            //console.log(file);
            Swal.fire({
                title: 'Cargando...',
                text: 'Espere por favor...',
                allowOutsideClick: false,
                onBeforeOpen: () => {
                    Swal.showLoading();
                }
            });
            const fileUrl = await fileUpload(file);
            //console.log(fileUrl)
            setFormValues({ ...formValues, img: fileUrl })
            Swal.close();

        }
    }
    //toma los valores del archivo seleccionado
    const handleFileChange = (e) => {
        //console.log(e.target.files);
        const file = e.target.files[0];
        if (file) {
            dispatch(startUploading(file));
        }
        //console.log(img, 'haber q esta en el state')
    }


    if (lists.length === 0) return <h1>Loading</h1>
    return (
        <Modal
            isOpen={modalOpen}
            onRequestClose={closeModal}
            style={customStyles}
            closeTimeoutMS={200}
            className="modal"
            overlayClassName="modal-fondo"
        >
            <h2> {(activeCandidato) ? 'Editar candidato' : 'Nuevo candidato'} </h2>
            <hr />
            <form className="container" onSubmit={handleSubmitForm}>
                <div className="form-group">
                    <input
                        type="file"
                        name="file"
                        onChange={handleFileChange}
                    />
                    <small id="emailHelp" className="form-text text-muted">Imagen de la lista</small>
                </div>
                {
                    (img)
                    && (
                        <div className="notes__image">
                            <img className='imgCentrar'
                                src={img}
                                alt=""
                            />
                        </div>
                    )}

                <div className="form-group">
                    <label>Nombre</label>
                    <input
                        type="text"
                        className={`form-control ${!titleValid && 'is-invalid'} `}
                        placeholder="Nombre del candidato"
                        name="nombre"
                        autoComplete="off"
                        value={nombre}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                <label>Apellido</label>
                    <input
                        type="text"
                        className={`form-control`}
                        placeholder="Apellido"
                        name="apellido"
                        autoComplete="off"
                        value={apellido}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                <label>Cargo</label>
                    <select className="form-control"
                        name="cargo"
                        value={cargo}
                        onChange={handleInputChange}>
                        {
                            cargos.map(cargo => (
                                <option key={cargo.id} > {cargo.nombre} </option>
                            ))
                        }

                    </select>
                    <small id="emailHelp" className="form-text text-muted">Cargo del candidato</small>
                </div>

                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                >
                    <i className="far fa-save"></i>
                    <span> Guardar</span>
                </button>
            </form>
        </Modal>
    )
}
