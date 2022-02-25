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


    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    Swal.fire({
      title: 'Eliminar',
      text: "Estas seguro de eliminar este usuario?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delet it!',

    }).then((result) => {
      if (result.isConfirmed) {

        dispatch(userStartDelete());

      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'Tu usuario sigue activo :(',
          'error'
        )
      }
    })
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

      <UserModal />



    </div>
  );
}
