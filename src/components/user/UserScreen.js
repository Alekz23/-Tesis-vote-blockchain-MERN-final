import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uiOpenModal } from '../../actions/ui';
import Swal from 'sweetalert2';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { userSetActive, userStartDelete, userStartLoading } from '../../actions/users';
import { UserModal } from './UserModal';





export const UserScreen = () => {


  const [users] = useSelector(state => [state.user.usuarios]);

  //para controlar si tiene listas cada eleccion 

  //console.log(elections, "si llega estos datos");

  const dispatch = useDispatch();


  useEffect(() => {

    dispatch(userStartLoading());

  }, [dispatch])

  const openModal = () => {
    dispatch(uiOpenModal());
  }

  const onSelectUser = (e) => {
    dispatch(userSetActive(e));
    dispatch(uiOpenModal());
    //console.log(e)
  }

  const onDeletUser = (e) => {
    dispatch(userSetActive(e));

    

    Swal.fire({
      title: "Are you sure about deleting this user?",
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
          dispatch(userStartDelete());
      } else {

      }

    }
    )

  }

 // console.log('llega a elecc');
  return (



    <div >
      <br />
      <h2 className="titulos">Usuarios</h2>
      <button
        className="btn btn-success fab " onClick={openModal}>
        <i className="fas fa-plus"></i>

      </button>

      <br />
      <ToastContainer></ToastContainer>
      <div className="form-screen ">
        <table className="table ">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Cedula</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {
              users.map((usuario) => {
                return (
                  <tr key={usuario._id}>
                    <td>{usuario._id}</td>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.cedula}</td>
                    <td>{usuario.correo}</td>
                    <td>{usuario.rol}</td>
                 
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => onSelectUser(usuario)}

                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      {"   "}
                      <button
                        className="btn btn-danger"
                        onClick={() => onDeletUser(usuario)}
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

      <UserModal/>



    </div>
  );
}
