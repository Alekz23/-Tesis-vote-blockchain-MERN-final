import React, { useEffect } from 'react';
import { useState } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { uiCloseModal } from '../../actions/ui';


import 'react-toastify/dist/ReactToastify.css';
import { cargoClearActiveCargo, cargoStartAddNew } from '../../actions/cargos';


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

}


export const CargoModal = () => {

  const { modalOpen } = useSelector(state => state.ui);
  const dispatch = useDispatch(); //modifica el estado de las funciones
  const { activeCargo } = useSelector(state => state.cargo);

  const [formValues, setFormValues] = useState(initEvent);
  const { nombre } = formValues;

  //estados para validaciones+
  const [nameValid, setNameValid] = useState(true);

  useEffect(() => {
    if (activeCargo) {
      setFormValues(activeCargo);
    } else {
      setFormValues(initEvent);
    }
  }, [activeCargo, setFormValues])


  const closeModal = (e) => {
    dispatch(uiCloseModal());
    dispatch(cargoClearActiveCargo());
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
    e.preventDefault();

    if (nombre.trim().length < 2) {
      return setNameValid(false);
    }

    if (activeCargo) {
      //dispatch(cargoStartUpdated(formValues))
    } else {
      dispatch(cargoStartAddNew(formValues));
    }

    setNameValid(true);
    closeModal();

  }

  return (
    <Modal
      isOpen={modalOpen}
      onRequestClose={closeModal}
      style={customStyles}
      closeTimeoutMS={200}
      className="modal"
      overlayClassName="modal-fondo"
    >

      <h1> {(activeCargo) ? 'Editar eleccion' : 'Nueva eleccion'} </h1>
      <hr />
      <form className="container" onSubmit={handleSubmitForm}>

        <hr />
        <div className="form-group">
          <label>Nombre</label>
          <input
            type="text"
            className={`form-control ${!nameValid && 'is-invalid'} `}
            placeholder="Nombre del cargo"
            name="nombre"
            autoComplete="off"
            value={nombre}
            onChange={handleInputChange}
          />
          <small id="emailHelp" className="form-text text-muted">Cargo para los candidatos</small>
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
