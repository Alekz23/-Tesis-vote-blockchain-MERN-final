import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { cargoSetActive, cargoStartAddNew, cargoStartDelete, cargoStartLoading } from '../../actions/cargos';
import { CargoModal } from './CargoModal';


export const CargoScreen = () => {

  const [cargos] = useSelector(state => [state.cargo.cargos]);
  const dispatch = useDispatch();

  useEffect(() => {

    dispatch(cargoStartLoading());

  }, [dispatch])

 
  const onDeletElection = (e) => {
    dispatch(cargoSetActive(e));

    Swal.fire({
      title: "¿Estás seguro de eliminar el cargo?",
      type: "info",
      showCancelButton: true,
      confirmButtonText: "Si, eliminar",
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

  const addCargos = async () => {

    const { value: text } = await Swal.fire({
      input: 'text',
      title: 'Ingrese un cargo',
      inputLabel: 'para los candidatos (ej. Presidente)',
      inputPlaceholder: 'ej. Presidente'
    })

    if (text) {
      const nuevo = {
        nombre: text
      }
      toast.success( `cargo: ${text} agregado`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      dispatch(cargoStartAddNew(nuevo));
    }
  }

  return (
    <div >
      <button
        className="btn btn-dark userListEdit" onClick={addCargos}>
        Agregar cargos
      </button>
      <div className="form-screen ">
        <table className="table table-hover table-sm">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {
              cargos.map((cargo) => {
                return (
                  <tr key={cargo.id}>
                    <td>{cargo.nombre}</td>
                    <td>
                      <button
                        className="cargosListDelete"
                        onClick={() => onDeletElection(cargo)}>
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      
      <CargoModal/>
    </div>
  );
}
