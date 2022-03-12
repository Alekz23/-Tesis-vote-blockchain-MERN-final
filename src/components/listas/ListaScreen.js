import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uiOpenModal } from '../../actions/ui';

import { listaSetActive, listaStartAddNew, listaStartDelete, listaStartLoading, listaStartUpdated } from '../../actions/lists';
import { ListaModal } from './ListaModal';
import { AddListas, addressContract, getStats, init } from '../../helpers/getWeb3Vote';
import Swal from 'sweetalert2';
import { electionStartLoading } from '../../actions/elections';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Table } from 'react-bootstrap';

import * as XLSX from 'xlsx';


let tamaño = 0;
let file;
export const ListaScreen = () => {

  let listasBlockchain = [];
  let XL_row_object = [];


  const [lists] = useSelector(state => [state.lista.lista]);
  const [elections] = useSelector(state => [state.eleccion.election]);
  const [idEleccion, setIdEleccion] = useState("");
  const [stats, setStats] = useState()

  const dispatch = useDispatch();


  useEffect(() => {

    dispatch(electionStartLoading());

  }, [dispatch])

  //solo de test eset useEffect
  useEffect(() => {
    dispatch(listaStartLoading());

  }, [dispatch, idEleccion])

  const handleInputChange = ({ target }) => {
    const selectedElection = target.value;
    setIdEleccion(selectedElection)
  }


  const handleSubmitForm = (e) => {

    setIdEleccion(e.target.value)
    e.preventDefault();
  }

  useEffect(() => {
    init();
    console.log('iniciando blockchain');
    obtenerListas();
  }, [])

  useEffect(() => {

    dispatch(listaStartLoading());

  }, [dispatch])

  const openModal = () => {


    if (tamaño === 0) {
      dispatch(uiOpenModal())
    } else {
      toast.error('Tiene listas agregadas a blockchain!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  const onSelectElection = (e) => {


    if (tamaño === 0) {
      dispatch(listaSetActive(e));
      dispatch(uiOpenModal());
    } else {
      toast.error('Tiene listas agregadas a blockchain!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

  }

  const onDeletElection = (e) => {

    if (tamaño === 0) {

      dispatch(listaSetActive(e));
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })

      Swal.fire({
        title: 'Eliminar',
        text: "¿Estás seguro de eliminar esta lista?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar',

      }).then((result) => {
        if (result.isConfirmed) {

          if (e.candidates?.length > 0) {
            toast.error('Tiene candidatos!', {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          } else {
            dispatch(listaStartDelete());
          }
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelado',
            'Tu lista sigue activa :(',
            'error'
          )
        }
      })

    } else {
      toast.error('Tiene listas agregadas a blockchain!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

  }

  const obtenerListas = () => {

    //setStats('true');
    getStats()
      .then(tx => {
        //console.log(tx,'estado actual');
        tamaño = tx.length;
        let tamaño2 = tx.length;

        setStats(tamaño2);
        //console.log('es lo q va ', tx.length);
      })
      .catch(err => console.log(err))
  }


  const test = (estado) => {

    const data = {
      ...lists[0],
      voteBN: estado //true
    }
    dispatch(listaStartUpdated(data));
    dispatch(listaStartLoading());
  }

  const limpiarListas = () => {
    for (let i = listasBlockchain.length; i > 0; i--) {
      //console.log('entra a borrar 1')
      listasBlockchain.pop();
    }
  }


  const agregarListas = () => {
    limpiarListas()

    obtenerListas();
    if (lists.length > 0) {
      for (let index = 0; index < lists.length; index++) {
        listasBlockchain.push((lists[index].nombre));
      }
      if (tamaño === 0) {
        test(false);

      }



      Swal.fire({
        title: "Blockchain",
        text: "¿Está seguro de guardar las listas en la blockchain? Una vez guardadas no se podrán agregar,editar o eliminar más listas",
        imageUrl: "https://wetech.mx/wp-content/uploads/2020/12/kisspng-blockchain-vector-graphics-computer-icons-illustra-flvr-calculator-chasing-coins-5bf69839402611.9278574715428874812628.png",
        imageWidth: 250,
        imageHeight: 225,
        imageAlt: "Guardar Listas",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        confirmButtonColor: "#00ff55",
        cancelButtonColor: "#999999",
        reverseButtons: true,

      }).then(resultado => {
        if (resultado.value) {
          //console.log('como llega el tamaño blockchain', tamaño)
          if (tamaño > 0) {
            toast.error('Ya tienes listas en la blockchain!', {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });

          } else {
            const swalWithBootstrapButtons = Swal.mixin({
              customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger',
                denyButton: 'btn btn-secondary'

              },
              buttonsStyling: false
            })
            Swal.fire({
              title: 'Voto Nulo y Blanco',
              text: "¿Desea habilitar el voto Nulo y Blanco al proceso electoral?",
              icon: 'question',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Si, agregar voto N/B',
              cancelButtonText: 'No, solo listas',

            }).then((result) => {
              if (result.isConfirmed) {

                listasBlockchain.push("Voto Blanco");
                listasBlockchain.push("Voto Nulo");
                //console.log(listasBlockchain, 'esto es lo con votos bn')

                Swal.fire({
                  title: 'Agregando a blockchain...',
                  text: 'Espere por favor...',
                  allowOutsideClick: false,
                  onBeforeOpen: () => {
                    Swal.showLoading();
                  }
                });

                AddListas(listasBlockchain)
                  .then(tx => {
                    test(true);
                    Swal.close();
                    //console.log(tx, 'addd a block');
                    tamaño = 4;
                    //console.log('cuando se agrega a block con N/B', tamaño);
                    Swal.fire('Guardado!', 'Se encuentra habilitado los votos nulos y blancos en el proceso electoral', 'success')
                  })
                  .catch(err => {
                    console.log(err);
                    //Swal.fire('Error', 'Falla en conexión a la blockchain', 'error')
                  })
              } else if (
                /* Read more about handling dismissals below */
                result.dismiss === Swal.DismissReason.cancel
              ) {
                //console.log(listasBlockchain, 'esto es lo q se piensa enviar sin voto nb')

                Swal.fire({
                  title: 'Agregando a blockchain...',
                  text: 'Espere por favor...',
                  allowOutsideClick: false,
                  onBeforeOpen: () => {
                    Swal.showLoading();
                  }
                });

                AddListas(listasBlockchain)
                  .then(tx => {
                    Swal.close();
                    //console.log(tx, 'addd a block');
                    tamaño = 4;
                    //console.log('cuando se agrega a block sin N/B', tamaño);
                    swalWithBootstrapButtons.fire(
                      'Guardado!', 'Inhabilitado los votos nulos y blancos para el proceso electoral', 'info')
                  })
                  .catch(err => {
                    console.log(err);
                    //Swal.fire('Error', 'Falla en conexión a la blockchain', 'error')
                  })
              }
            })
          }

        } else {
          limpiarListas()
        }
      }
      )
    } else {
      toast.error('Por favor agregue listas antes de agregar a la blockchain!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  const saveSwal = async () => {

    if (tamaño === 0) {

      const { value: file } = await Swal.fire({
        title: 'Seleccione un archivo excel con listas',
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

          for (let i = 0; i < XL_row_object.length; i++) {
            XL_row_object[i].eleccion = idEleccion;
          }

          setTimeout(() => {
            for (let i = 0; i < XL_row_object.length; i++) {
              dispatch(listaStartAddNew(XL_row_object[i]))
            }
          }, (2000));

          dispatch(listaStartLoading())

        }
      }


    } else {
      toast.error('Tienes listas agregadas a blockchain!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }



  if (elections.length === 0) return <span>Loading</span>

  if (idEleccion === '') {
    setIdEleccion(elections[0].id)
  }

  if (idEleccion === '') return <span>Loading</span>

  if (stats === undefined) return <div className="padre">

    <div className="spinner">
      <span>Loading...</span>
      <div className="half-spinner"></div>
    </div>
  </div>

  //console.log(stats, 'esto seria blockchain');

  return (
    <div className="container py-3">

    <h3 className="titulos">Listas</h3>
      <ToastContainer></ToastContainer>
      <form className="container" onSubmit={handleSubmitForm}>
        <div className="form-group">
          <small id="emailHelp" className="form-text text-muted">Elecciones</small>
          <select className="form-control"
            name="idEleccion"
            value={idEleccion}
            onChange={handleInputChange}>
            {
              elections.map(election => (
                <option key={election.id} value={election.id} >{election.nombre}</option>
              ))
            }
          </select>
        </div>
      </form>


      <div className="container">
        <div className="row">
          
          <div className="col">
            <button
              className="btn btn-dark userListEdit" onClick={saveSwal}>
              <i className="fa-solid fa-file-csv"> </i>
              <span> Cargar listas</span>
            </button>
          </div>


        </div>
      </div>

      <button
        className="btn btn-success fab " onClick={openModal}>
        <i className="fas fa-plus"></i>
      </button>

      <div className="row">
        <div className="col-md-3">
          <br /><br />

          <div className="card card-body bg-light rounded-3 mb-4">
            <div className="d-flex align-items-center">
              <span className="material-icons">
                <i className="fa-solid fa-wallet"></i>
                Contract BSC: </span>
            </div>
            <span id="account">{addressContract}</span>
          </div>

        </div>
        <div className="col-md-1">
        </div>

        <div className="col-md-8">
          <br /><br />
          <Table className="titulos table table-hover">
            <thead>
              <tr>

                <th>Lista</th>
                <th>Nombre</th>
                <th>Descripcion</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {

                lists.map((lista) => {
                  return (

                    <tr key={lista.id} >

                      {lista.eleccion._id && lista.eleccion._id.search(idEleccion) ? '' :
                        <>
                          <td>
                            {
                              (lista.img)
                              && (

                                <div >
                                  <img className='userListImg'
                                    src={lista.img}
                                    alt=""
                                  />
                                </div>
                              )}
                          </td>
                          <td>{lista.nombre}</td>
                          <td>{lista.descripcion}</td>


                          <td>
                            <button
                              className="btn btn-primary userListEdit"
                              onClick={() => onSelectElection(lista)}

                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            {"   "}
                            <button
                              className="btn btn-danger userListEdit"
                              onClick={() => onDeletElection(lista)}
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </td>
                        </>}
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </div>
      </div>


      <button type="button" name="vote" id="vote" className="btn btn-success fab-danger userListEdit" onClick={agregarListas}>
        <i className="fa-brands fa-ethereum "></i>
        <span> Agregar a blockchain</span>
      </button>

      <ListaModal idEleccion={idEleccion} />



    </div>
  );
}
