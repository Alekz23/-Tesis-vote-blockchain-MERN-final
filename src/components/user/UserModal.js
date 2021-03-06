import React, { useEffect } from 'react';
import { useState } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { uiCloseModal } from '../../actions/ui';

import 'react-toastify/dist/ReactToastify.css';
import { userClearActiveUser, userStartAddNew, userStartUpdate } from '../../actions/users';
import { toast } from 'react-toastify';

const { verificarCedula } = require('udv-ec');
var validator = require("email-validator");


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
  cedula: '',
  nombre: '',
  correo: '',
  password: '',
  rol: ""
}


export const UserModal = () => {

  const { modalOpen } = useSelector(state => state.ui);
  const dispatch = useDispatch(); //modifica el estado de las funciones
  const { activeUser } = useSelector(state => state.user);
  const [formValues, setFormValues] = useState(initEvent);
  const { cedula, nombre, correo, password, rol } = formValues;

  //estados para validaciones+
  const [titleValid, setTitleValid] = useState(true);
  const [cedulaValid, setCedulaValid] = useState(true);
  const [correoValid, setCorreoValid] = useState(true);



  useEffect(() => {
    if (activeUser) {
      setFormValues(activeUser);
    } else {
      setFormValues(initEvent);
    }
  }, [activeUser, setFormValues])


  const closeModal = (e) => {
    //setIsOpen(false);
    dispatch(uiCloseModal());
    dispatch(userClearActiveUser());
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

    const nuevo= {...formValues, rol: formValues.rol===''?
        "Elector"
       :formValues.rol}
    
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

    if(verificarCedula(cedula)=== false){
      toast.error('Cedula inv??lida', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
      return setCedulaValid(false);
    }

    if(validator.validate(correo)===false){
      toast.error('Correo inv??lido', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
      return setCorreoValid(false);
    }

    if(password.trim().length<6){
      return toast.error('La contrase??a debe ser mayor a 6 caracteres', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
      
    }

    if (activeUser) {
      dispatch(userStartUpdate(formValues))
    } else {
      dispatch(userStartAddNew(nuevo));
    }

    setTitleValid(true);
    setCedulaValid(true);
    setCorreoValid(true);
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
  
      <h2> {(activeUser) ? 'Editar usuario' : 'Nuevo usuario'} </h2>
      <hr />
      <form className="container" onSubmit={handleSubmitForm}>
        <div className="form-group">
          <label>Nombre completo</label>
          <input
            type="text"
            className={`form-control ${!titleValid && 'is-invalid'} `}
            placeholder="Nombre "
            name="nombre"
            autoComplete="off"
            value={nombre}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>C??dula</label>
          <input
            type="text"
            className={`form-control ${!cedulaValid && 'is-invalid'} `}
            placeholder="c??dula"
            name="cedula"
            autoComplete="off"
            value={cedula}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label>Correo</label>
          <input
            type="text"
            className={`form-control ${!correoValid && 'is-invalid'} `}
            placeholder="correo"
            name="correo"
            autoComplete="off"
            value={correo}
            onChange={handleInputChange}
          />
        </div>


        <hr />
        <div className="form-group">
          <label>Contrase??a</label>
          <input
            type="password"
            className={`form-control ${!titleValid && 'is-invalid'} `}
            placeholder="******"
            name="password"
            autoComplete="off"
            value={password}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <select className="form-control"
            name="rol"
            value={rol}
            onChange={handleInputChange}>
            <option value="Elector">Elector</option>
            <option value="Administrador">Administrador</option>
          </select>
          <small id="emailHelp" className="form-text text-muted">Rol de Usuario</small>
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
