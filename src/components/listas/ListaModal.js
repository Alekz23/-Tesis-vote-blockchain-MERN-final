import React, { useEffect } from 'react';
import { useState } from 'react';
import Modal from 'react-modal';

import { useDispatch, useSelector } from 'react-redux';
import { uiCloseModal } from '../../actions/ui';
import { listaClearActiveLista, listaStartAddNew, listaStartLoading, listaStartUpdated } from '../../actions/lists';
import { electionStartLoading } from '../../actions/elections';

import 'react-toastify/dist/ReactToastify.css';
import { fileUpload } from '../../helpers/fileUpload';
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


const initEvent = {
  nombre: '',
  img: '',
  descripcion: '',
  eleccion: ''

}

export const ListaModal = ({ idEleccion }) => {

  const { modalOpen } = useSelector(state => state.ui);
  const dispatch = useDispatch(); //modifica el estado de las funciones
  const { activeLista } = useSelector(state => state.lista);

  const { election: elections } = useSelector(state => state.eleccion);

  useEffect(() => {
    dispatch(electionStartLoading());
  }, [dispatch])


  const [formValues, setFormValues] = useState(initEvent);
  const { nombre, descripcion, img } = formValues;

  //estados para validaciones+
  const [titleValid, setTitleValid] = useState(true);

  useEffect(() => {
    if (activeLista) {
      setFormValues(activeLista);
    } else {
      setFormValues(initEvent);
    }
  }, [activeLista, setFormValues])


  const closeModal = (e) => {
    //setIsOpen(false);
    dispatch(uiCloseModal());
    dispatch(listaClearActiveLista());
    //dispatch(listaStartLoading());
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
    // const nuevo= {...formValues, eleccion: formValues.eleccion.length===0?
    //    elections[0].id
    //     :formValues.eleccion}

    //funcionando
    const nuevo = {
      ...formValues, eleccion:
        idEleccion
    }

    //funcionando con errores
    // const nuevo= {...formValues, eleccion: idEleccion==='' ? elections[0].id
    // : idEleccion
    // }
    e.preventDefault();

    if (nombre.trim().length < 2) {
      return setTitleValid(false);
    }
    if (activeLista) {
      dispatch(listaStartUpdated(formValues))
    } else {
      dispatch(listaStartAddNew(nuevo));
    }

    setTitleValid(true);
    dispatch(listaStartLoading());
    closeModal();
  }


  //metodo par cargar las imagenes desde cloudflare
  // const handlePictureClick = () => {
  //   document.querySelector('#fileSelector').click();
  // }

  //pasa el valor al img del objeto antes de crearse
  const startUploading = (file) => {
    return async () => {
      //console.log(file);
      Swal.fire({
        title: 'Uploading...',
        text: 'Please wait...',
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
    console.log(e.target.files);
    const file = e.target.files[0];
    if (file) {
      dispatch(startUploading(file));
    }
    //console.log(img, 'haber q esta en el state')
  }

  if (elections.length === 0) return <span>Loading</span>

  return (
    <Modal
      isOpen={modalOpen}
      onRequestClose={closeModal}
      style={customStyles}
      closeTimeoutMS={200}
      className="modal"
      overlayClassName="modal-fondo"
    >
      <h2> {(activeLista) ? 'Editar lista' : 'Nueva lista'} </h2>
      <hr />
      <form className="container" onSubmit={handleSubmitForm}>



        <div className="form-group">
          <input
            type="file"
            name="file"
            accept="image/*"
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
        <br />
        <div className="form-group">
          <label>Nombre</label>
          <input
            type="text"
            className={`form-control ${!titleValid && 'is-invalid'} `}
            placeholder="Nombre de la lista"
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
            placeholder="Descripcion"
            rows="3"
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
