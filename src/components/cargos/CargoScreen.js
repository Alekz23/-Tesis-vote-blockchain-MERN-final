import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { electionStartDelete } from '../../actions/elections';
import { uiOpenModal } from '../../actions/ui';
import Swal from 'sweetalert2';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { cargoSetActive, cargoStartDelete, cargoStartLoading } from '../../actions/cargos';
import { CargoModal } from './CargoModal';





export const CargoScreen = () => {


  const [cargos] = useSelector(state => [state.cargo.cargos]);

  const dispatch = useDispatch();


  useEffect(() => {

    dispatch(cargoStartLoading());

  }, [dispatch])

  const openModal = () => {
    dispatch(uiOpenModal());
  }

 

  const onDeletElection = (e) => {
    dispatch(cargoSetActive(e));

    

    Swal.fire({
      title: "Are you sure about deleting this cargo?",
      type: "info",
      showCancelButton: true,
      confirmButtonText: "Delete It",
      confirmButtonColor: "#ff0055",
      cancelButtonColor: "#999999",
      reverseButtons: true,
      focusConfirm: false,
      focusCancel: true
    }).then(resultado => {
      if (resultado.value) {

          dispatch(cargoStartDelete());
      
      } else {

      }

    }
    )

  }

 // console.log('llega a elecc');
  return (



    <div >
      <br />
      <h3 className="titulos">Cargos</h3>
      <button
        className="btn btn-primary " onClick={openModal}>
       Add Cargos

      </button>

      <br />
      <ToastContainer></ToastContainer>
      <div className="form-screen ">
        <table className="table ">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {
              cargos.map((cargo) => {
                return (
                  <tr key={cargo.id}>
                    <td>{cargo.id}</td>
                    <td>{cargo.nombre}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => onDeletElection(cargo)}
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

      <CargoModal />



    </div>
  );
}
