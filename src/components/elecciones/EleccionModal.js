import React, { useEffect } from 'react';
import { useState } from 'react';
import Modal from 'react-modal';
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { uiCloseModal } from '../../actions/ui';
import { electionClearActiveElection, electionStartAddNew, electionStartUpdated} from '../../actions/elections';


import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';


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
//const now = moment().minutes(0).seconds(0).add(0, 'hours'); // 3:00:00
const now = moment().seconds(0).add(0, 'hours'); // 3:00:00
const nowPlus1 = now.clone().add(1, 'hours');

const initEvent = {
  nombre: '',
  descripcion: '',
  start: now.toDate(),
  end: nowPlus1.toDate()
}


export const EleccionModal = () => {


  //const [isOpen, setIsOpen] = useState(true); // abrir y cerrar el formulario
  // toma los valores del state ui
  const { modalOpen } = useSelector(state => state.ui);
  const dispatch = useDispatch(); //modifica el estado de las funciones
  const { activeElection } = useSelector(state => state.eleccion);


  //const [dateStart, setDateStart] = useState(now.toDate()); //estado de las fechas del form
  //const [dateEnd, setDateEnd] = useState(nowPlus1.toDate()); //estdo fin de la fecha del form

  const [formValues, setFormValues] = useState(initEvent);
  const { nombre, descripcion, start, end } = formValues;

  //estados para validaciones+
  const [titleValid, setTitleValid] = useState(true);

  useEffect(() => {
    if (activeElection) {
      setFormValues(activeElection);
    } else {
      setFormValues(initEvent);
    }
  }, [activeElection, setFormValues])

  const closeModal = (e) => {
    //setIsOpen(false);
    dispatch(uiCloseModal());
    dispatch(electionClearActiveElection());
    setFormValues(initEvent); //se cierra el modal y los valores se borran
  }

  const handleStartDateChange = (e) => {
    //setDateStart(e);
    setFormValues({
      ...formValues,
      start: e
    })
  }

  const handleEndDateChange = (e) => {
    // setDateEnd(e);
    setFormValues({
      ...formValues,
      end: e
    })
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
    //console.log(formValues, 'enviados desde el form')

    //validaciones fecha
    const momentStart = moment(start);
    const momentEnd = moment(end);

    if (momentStart.isSameOrAfter(momentEnd)) {
      return Swal.fire('Error', 'La fecha de fin debe ser mayor a la fecha de inicio', 'error');
    }

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

    if(descripcion.trim().length<2){
      return toast.error('La descripción es obligatoria', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    if (activeElection) {
      dispatch(electionStartUpdated(formValues))
    } else {
      dispatch(electionStartAddNew(formValues));
    }


    setTitleValid(true);
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

      <h2> {(activeElection) ? 'Editar elección' : 'Nueva elección'} </h2>
      <hr />
      <form className="container" onSubmit={handleSubmitForm}>

        <div className="form-group">
          <label>Fecha y hora inicio</label>
          <DateTimePicker
            onChange={handleStartDateChange}
            value={start}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Fecha y hora fin</label>
          <DateTimePicker
            onChange={handleEndDateChange}
            value={end}
            minDate={start}
            className="form-control"
          />
        </div>

        <hr />
        <div className="form-group">
          <label>Nombre</label>
          <input
            type="text"
            className={`form-control ${!titleValid && 'is-invalid'} `}
            placeholder="Nombre de la eleccion"
            name="nombre"
            autoComplete="off"
            value={nombre}
            onChange={handleInputChange}
          />
          <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
        </div>

        <div className="form-group">
          <textarea
            type="text"
            className="form-control"
            placeholder="Descripción"
            rows="5"
            name="descripcion"
            value={descripcion}
            onChange={handleInputChange}
          ></textarea>
          <small id="emailHelp" className="form-text text-muted">Descripcion adicional</small>
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
