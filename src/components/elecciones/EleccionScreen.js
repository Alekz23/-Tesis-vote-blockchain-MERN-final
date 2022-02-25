import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { electionSetActive, electionStartLoading, electionStartDelete } from '../../actions/elections';
import { uiOpenModal } from '../../actions/ui';
import moment from 'moment'
import Swal from 'sweetalert2';

import { EleccionModal } from './EleccionModal';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';





export const EleccionScreen = () => {


  const [elections] = useSelector(state => [state.eleccion.election]);

  //para controlar si tiene listas cada eleccion 

  //console.log(elections, "si llega estos datos");

  const dispatch = useDispatch();


  useEffect(() => {

    dispatch(electionStartLoading());

  }, [dispatch])

  const openModal = () => {
    dispatch(uiOpenModal());
  }

  const onSelectElection = (e) => {
    dispatch(electionSetActive(e));
    dispatch(uiOpenModal());
    //console.log(e)
  }

  const onDeletElection = (e) => {
    dispatch(electionSetActive(e));



    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    Swal.fire({
      title: 'Eliminar',
      text: "Estas seguro de eliminar esta elección?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delet it!',

    }).then((result) => {
      if (result.isConfirmed) {

        if (e.lists?.length > 0) {
          toast.error('Tiene Listas', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          dispatch(electionStartDelete());
        }

      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'Tu eleccion sigue activa :(',
          'error'
        )
      }
    })

  }

  // console.log('llega a elecc');
  return (



    <div >
      <br />
      <h2 className="titulos">Elecciones</h2>
      <button
        className="btn btn-success fab " onClick={openModal}>
        <i className="fas fa-plus"></i>

      </button>

      <br />
      <ToastContainer></ToastContainer>
      <div className="form-screen">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripcion</th>
              <th>Fecha Inicio</th>
              <th>Fecha Fin</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {
              elections.map((eleccion) => {
                return (
                  <tr key={eleccion.id}>
                    <td>{eleccion.nombre}</td>
                    <td>{eleccion.descripcion}</td>
                    <td>{moment(eleccion.start).format('YYYY-MM-DD HH:mm:ss')}</td>
                    <td>{moment(eleccion.end).format('YYYY-MM-DD HH:mm:ss')}</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => onSelectElection(eleccion)}

                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      {"   "}
                      <button
                        className="btn btn-danger"
                        onClick={() => onDeletElection(eleccion)}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <EleccionModal />



    </div>
  );
}