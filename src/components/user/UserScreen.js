import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uiOpenModal } from '../../actions/ui';
import Swal from 'sweetalert2';


import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { userSetActive, userStartAddNew, userStartDelete, userStartLoading, userStartUpdate } from '../../actions/users';
import { UserModal } from './UserModal';
//import { Table } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import { getStats, init } from '../../helpers/getWeb3Vote';

let cont = 0;
let file;
let $ = require("jquery");
$.DataTable = require('datatables.net')


export const UserScreen = () => {

  let XL_row_object = [];

  const [users] = useSelector(state => [state.user.usuarios]);
  const [stats, setStats] = useState()
  const dispatch = useDispatch();


  useEffect(() => {

    dispatch(userStartLoading());
    //   $(document).ready(function() {
    //     $('#example').DataTable();
    // } );

  }, [dispatch])



  const openModal = () => {
    dispatch(uiOpenModal());

  }

  const onSelectUser = (e) => {
    console.log({...e, password: ""});
    dispatch(userSetActive({...e, password: ""}));
    dispatch(uiOpenModal());
    //console.log(e)
  }


  useEffect(() => {


    init();
    obtenerListas();
  }, [])



  const obtenerListas = () => {


    getStats()
      .then(tx => {


        console.log(tx);
        let tamaño = tx.length;

        setStats(tamaño);


        console.log('es lo q va ', tx.length);

        //en caso de error al no desplegar la blockchain , borrar este if y metdoo
        // if (tamaño === 0) {
        //   resetStatusVote()
        // }
        //setproposal(tx)
      })
      .catch(err => console.log(err))
  }



  const resetStatusVote = () => {

    console.log('ingresa a cambiar ststaus', users.length);
    for (let i = 0; i < users.length; i++) {
      //console.log(users.length)
      const data = {
        _id: users[i]._id,
        cedula: users[i].cedula,
        nombre: users[i].nombre,
        correo: users[i].correo,
        rol: users[i].rol,
        vote: false //true
      }
      console.log('esto pasa maldita', data);
      dispatch(userStartUpdate(data));
    }


    dispatch(userStartLoading());
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
      text: "¿Estás seguro de eliminar este usuario?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!',

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


  const saveSwal = async () => {

    const { value: file } = await Swal.fire({
      title: 'Seleccione un archivo excel con usuarios',
      input: 'file',
      inputAttributes: {
        'accept': '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
        'aria-label': 'Upload your profile picture'
      }
    })

    if (file) {
      let reader = new FileReader();
      reader.readAsArrayBuffer(file)
      reader.onloadend = (e) => {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, { type: 'array' });
        workbook.SheetNames.forEach(function (sheetName) {

          XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);

        })

        setTimeout(() => {
          for (let i = 0; i < XL_row_object.length; i++) {
            dispatch(userStartAddNew(XL_row_object[i]))
          }
        }, (2000));

        dispatch(userStartLoading())
      }
    }

  }


  //console.log(stats, 'stas cargado 1');

  if (users.length === 0) return <div className="padre">

    <div className="spinner">
      <span>Loading users...</span>
      <div className="half-spinner"></div>
    </div>
  </div>



  if (stats === undefined) return <div className="padre">

    <div className="spinner">
      <span>Loading...</span>
      <div className="half-spinner"></div>
    </div>
  </div>
  //console.log(stats, 'stas cargado');

  if (stats === 0 && cont === 0) {
    resetStatusVote()
    //console.log('cuantas veces entra', cont);
    cont = 1;
  }

  //   $(document).ready(function() {
  //     $('#example').DataTable();
  // } );

  return (



    <div className="container py-3">

      <h3 className="titulos">Usuarios</h3>

      <br />
      <div className="container">
        <div className="row">

          <div className="col">
            <button
              className="btn btn-dark userListEdit" onClick={saveSwal}>
              <i className="fa-solid fa-file-csv"> </i>
              <span> Cargar usuarios</span>
            </button>
          </div>


        </div>
      </div>

      <button
        className="btn btn-success fab " onClick={openModal}>
        <i className="fas fa-plus"></i>

      </button>

      <br />
      <ToastContainer></ToastContainer>
      <div className="table-responsive-sm" >
        <table className="titulos table table-hover table-borderless table-sm " id="example">
          <thead>
            <tr>

              <th>Nombre</th>
              <th>Cédula</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Vote</th>
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
                    <td>{
                      usuario.vote === true && usuario.rol !== 'Administrador' ?
                        <button
                          className="btn btn-success userListStatus"
                        >
                          <i className="fa-solid fa-check"></i>
                        </button>
                        : usuario.vote === false && usuario.rol !== 'Administrador' ?
                          <button
                            className="btn btn-dark userListStatus">
                            <i className="fa-brands fa-mixer"></i>
                          </button>
                          : ''

                    }</td>

                    <td>
                      <button
                        className="btn btn-primary userListEdit"
                        onClick={() => onSelectUser(usuario)}

                      >
                        <i className="fas fa-edit "></i>
                      </button>
                      <button
                        className="btn btn-danger userListEdit"
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
        <script src='https://code.jquery.com/jquery-3.5.1.js'></script>
        <script src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.min.js"></script>
        <script src="https://cdn.datatables.net/1.11.5/js/dataTables.bootstrap5.min.js"></script>


      </div>
      <UserModal />





    </div>
  );
}
