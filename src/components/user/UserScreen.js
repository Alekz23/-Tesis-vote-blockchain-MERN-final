import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uiOpenModal } from '../../actions/ui';
import Swal from 'sweetalert2';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { userSetActive, userStartAddNew, userStartDelete, userStartLoading } from '../../actions/users';
import { UserModal } from './UserModal';
import { Table } from 'react-bootstrap';
import * as XLSX from 'xlsx';


let file;

export const UserScreen = () => {

  let XL_row_object = [];

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

  const handleFileChange = (e) => {
    console.log(e.target.files);
    file = e.target.files[0];
    const target = e.target;

    if (file) {
      // dispatch(startUploading(file));
      let reader = new FileReader();
      reader.readAsArrayBuffer(target.files[0])
      reader.onloadend = (e) => {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, { type: 'array' });
        console.log(workbook, 'workbook');

        workbook.SheetNames.forEach(function (sheetName) {

          XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
          console.log(XL_row_object, 'xl');
          console.log(XL_row_object.length, 'xl deimesnsion');

        })
        console.log(XL_row_object, 'ya converido de xls');

      }
    }
  }

  const saveListasBDD = () => {

    file = "";
    setTimeout(() => {
      for (let i = 0; i < XL_row_object.length; i++) {
        dispatch(userStartAddNew(XL_row_object[i]))
      }
    }, (2000));

    dispatch(userStartLoading())
    document.getElementById("file").value = '';
    //console.log(XL_row_object, 'metodo add bdd');
  }



  // console.log('llega a elecc');
  return (



    <div >
      <br />
      <h2 className="titulos">Usuarios</h2>

      <br/>
      <div className="container">
        <div className="row">
          <div className="col">
         
            <input 
              id="file"
              type="file"
              name="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              // style={{ display: 'none' }}
              onChange={handleFileChange}
            />
             <small id="emailHelp" className="form-text text-muted">Archivo de Excel</small>
            
          </div>

          <div className="col">
            <button
              className="btn btn-dark userListEdit" onClick={saveListasBDD}>
              <i className="fa-solid fa-file-csv"> </i>
              Cargar listas
            </button>
          </div>

          <div className="col">

          </div>


        </div>
      </div>


      <button
        className="btn btn-success fab " onClick={openModal}>
        <i className="fas fa-plus"></i>

      </button>

      <br />
      <ToastContainer></ToastContainer>
      <div >
        <Table className="titulos">
          <thead>
            <tr>

              <th>Nombre</th>
              <th>Cedula</th>
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
                      usuario.vote === true && usuario.rol!=='ADMIN_ROLE'?
                        <button
                          className="btn btn-success userListStatus"
                        >
                          <i className="fa-solid fa-check"></i>
                        </button>
                        : usuario.vote === false && usuario.rol!=='ADMIN_ROLE'?
                        <button
                          className="btn btn-dark userListStatus">
                          <i class="fa-brands fa-mixer"></i>
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
                      {"   "}
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
        </Table>
      </div>

      <UserModal />



    </div>
  );
}
