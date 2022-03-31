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
import { toast} from 'react-toastify';

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

  const handleSubmitForm = (e) => {
   
    const nuevo = {
      ...formValues, eleccion:
        idEleccion
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

    if (descripcion.trim().length < 2) {
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
            placeholder="ej. Lista 1"
            name="nombre"
            autoComplete="off"
            value={nombre}
            onChange={handleInputChange}
          />
          
        </div>


        <div className="form-group">
        <label>Descripción corta (nombre que representa la lista)</label>
          <textarea
            type="text"
            className="form-control"
            placeholder="ej. Unidad popular"
            rows="3"
            name="descripcion"
            value={descripcion}
            onChange={handleInputChange}
          ></textarea>
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
