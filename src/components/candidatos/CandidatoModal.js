import React, { useEffect } from 'react';
import { useState } from 'react';
import Modal from 'react-modal';

import { useDispatch, useSelector } from 'react-redux';
import { uiCloseModal } from '../../actions/ui';
import { listaStartLoading } from '../../actions/lists';
import { candidatoClearActiveCandidato, candidatoStartAddNew, candidatoStartLoading, candidatoStartUpdate } from '../../actions/candidates';



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
    lista: ''
}


export const CandidatoModal = ({idLista}) => {


    //const [isOpen, setIsOpen] = useState(true); // abrir y cerrar el formulario
    // toma los valores del state ui
    const { modalOpen } = useSelector(state => state.ui);
    const dispatch = useDispatch(); //modifica el estado de las funciones
    const { activeCandidato } = useSelector(state => state.candidato);
    const [lists] = useSelector(state => [state.lista.lista]);

   // const [lists] = useSelector(state => [state.lista.lista]);

    useEffect(() => {

        dispatch(listaStartLoading());

    }, [dispatch])


    //const [dateStart, setDateStart] = useState(now.toDate()); //estado de las fechas del form
    //const [dateEnd, setDateEnd] = useState(nowPlus1.toDate()); //estdo fin de la fecha del form

    const [formValues, setFormValues] = useState(initEvent);
    const { nombre, apellido, cargo, lista } = formValues;

    //estados para validaciones+
    const [titleValid, setTitleValid] = useState(true);

    useEffect(() => {
        if (activeCandidato) {
            setFormValues(activeCandidato);
            //console.log('complet stado')
        } else {
            setFormValues(initEvent);
            //console.log('borrando stado')
        }
    }, [activeCandidato, setFormValues])

    //console.log(activeElection)



    const closeModal = (e) => {
        //setIsOpen(false);
        dispatch(uiCloseModal());
        dispatch(candidatoClearActiveCandidato);
        //dispatch(candidatoStartLoading());
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

 
        const nuevo= {...formValues, lista: 
            idLista , cargo: formValues.cargo===''?
              "Presidente"
             :formValues.cargo}
          
    
        e.preventDefault();
        //console.log(nuevo, 'como envia el candidato')
        //console.log(formValues, 'enviados desde el form')

        //validaciones


        if (nombre.trim().length < 2) {
            return setTitleValid(false);
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

    if(lists.length===0) return <h1>Loading</h1>
    return (
        <Modal
            isOpen={modalOpen}
            onRequestClose={closeModal}
            style={customStyles}
            closeTimeoutMS={200}
            className="modal"
            overlayClassName="modal-fondo"
        >

            <h1> {(activeCandidato) ? 'Editar candidato' : 'Nuevo candidato'} </h1>
            <hr />
            <form className="container" onSubmit={handleSubmitForm}>

                {/* <div className="form-group">
                    <select className="form-control"
                        name="lista"
                        value={lista}
                        onChange={handleInputChange}>

                        {
                            lists.map(lista => (
                                <option key={lista.id} value={lista.id} > {lista.nombre} </option>
                            ))
                        }

                    </select>
                    <small id="emailHelp" className="form-text text-muted">Listas de las elecciones</small>
                </div> */}

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
                    <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
                </div>

                <div className="form-group">
                    <input
                        type="text"
                        className={`form-control ${!titleValid && 'is-invalid'} `}
                        placeholder="Apellido"
                        name="apellido"
                        autoComplete="off"
                        value={apellido}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <select className="form-control"
                        name="cargo"
                        value={cargo}
                        onChange={handleInputChange}>

                        <option value="Presidente"> Presidente</option>
                        <option value="Vicepresidente">Vicepresidente</option>
                        <option value="Secretario">Secretario</option>
                        <option value="Tesorero">Tesorero</option>

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
