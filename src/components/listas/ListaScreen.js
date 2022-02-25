import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uiOpenModal } from '../../actions/ui';

import { listaSetActive, listaStartDelete, listaStartLoading } from '../../actions/lists';
import { ListaModal } from './ListaModal';
import { AddListas, getStats, init } from '../../helpers/getWeb3Vote';
import Swal from 'sweetalert2';
import { electionStartLoading } from '../../actions/elections';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CargoScreen } from '../cargos/CargoScreen';


let tamaño = 0;

export const ListaScreen = () => {

  let listasBlockchain = [];
  const [lists] = useSelector(state => [state.lista.lista]);
  //const [proposal, setproposal] = useState([]);

  //console.log(elections, "si llega estos datos");

  //testeando elecciones 
  const [elections] = useSelector(state => [state.eleccion.election]);
  const [idEleccion, setIdEleccion] = useState("");
  //const [openList, setOpenList] = useState(false);

  //const [tamaño, setTamaño] = useState(0);

  //const [listas] = useSelector(state => [state.byId.election]);
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

    //setOpenList(false);
    //console.log(idEleccion, 'esto viene select ')
  }

  //borrando
  // useEffect(() => {
  //   console.log('haver');

  // }, [idEleccion])


  // useEffect(() => {

  //   dispatch(electionStartLoadingByList(idEleccion))

  // }, [dispatch, idEleccion])




  const handleSubmitForm = (e) => {


    setIdEleccion(e.target.value)


    //const nuevo= {...idEleccion, idEleccion === ''? setIdEleccion(elections[0].id) : e.target.value}
    //console.log(elections[0].id, 'eso iniciai');
    //console.log(idEleccion, 'ver como esta el state');

    e.preventDefault();



    //dispatch(electionStartLoadingByList(idEleccion))



  }
  //termina test



  useEffect(() => {
    init();
    obtenerListas();



  }, [])

  useEffect(() => {

    dispatch(listaStartLoading());

  }, [dispatch])

  const openModal = () => {
    dispatch(uiOpenModal())




  }

  const onSelectElection = (e) => {
    dispatch(listaSetActive(e));
    dispatch(uiOpenModal());
    //console.log(e)
  }

  const onDeletElection = (e) => {

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
      text: "Estas seguro de eliminar esta lista?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delet it!',

    }).then((result) => {
      if (result.isConfirmed) {

        if (e.candidates?.length > 0) {
          toast.error('Tiene candidatos', {
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

  }




  const obtenerListas = () => {


    getStats()
      .then(tx => {
        console.log(tx);
        tamaño = tx.length;
        console.log('es lo q va ', tx.length);
        //setproposal(tx)
      })
      .catch(err => console.log(err))

  }


  // useEffect(() => {
  //   //guardar las propuestas en un arraya y mandarlas a la blockchain
  //   if (lists.length > 0) {
  //     for (let index = 0; index < lists.length; index++) {
  //       setproposal(prop => [...prop, (lists[index].nombre)]);
  //     }
  //   }

  // }, [lists])



  const agregarListas = () => {

    obtenerListas();

    if (lists.length > 0) {
      for (let index = 0; index < lists.length; index++) {
        //setproposal(prop => [...prop, (lists[index].nombre)]);
        listasBlockchain.push((lists[index].nombre));
      }
      listasBlockchain.push("Voto Blanco");
      listasBlockchain.push("Voto Nulo");

    }


    console.log(listasBlockchain, 'lo q esta en listblocks');

    Swal.fire({
      title: "Guardar Listas",
      text: "¿Está seguro de guardar las listas en la blockchain? Una vez guardadas no se podrán modificar, ni agregar más listas a la blockchain",
      imageUrl: "https://wetech.mx/wp-content/uploads/2020/12/kisspng-blockchain-vector-graphics-computer-icons-illustra-flvr-calculator-chasing-coins-5bf69839402611.9278574715428874812628.png",
      imageWidth: 275,
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

        console.log('como llega el tamaño blockchain', tamaño)
        if (tamaño > 0) {
          toast.error('Ya tiene listas en la blockchain', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

        } else {
          // for (let i = 0; i < listasBlockchain.length; i++) {
          //   console.log(listasBlockchain[i])
          //   AddListas(listasBlockchain[i])
          //     .then(tx => {
          //       //listasBlockchain.pop();
          //       console.log(tx, 'addd a block');
          //       //setproposal("");
          //     })
          //     .catch(err => {
          //       console.log(err);

          //     })
          // }


          console.log(listasBlockchain, 'esto es lo q se piensa enviar')
          AddListas(listasBlockchain)
            .then(tx => {
              //listasBlockchain.pop();
              console.log(tx, 'addd a block');
              //setproposal("");
            })
            .catch(err => {
              console.log(err);

            })

        }


        for (let i = listasBlockchain.length; i > 0; i--) {
          listasBlockchain.pop();
        }
      } else {

        for (let i = listasBlockchain.length; i > 0; i--) {
          listasBlockchain.pop();
        }
      }
    }
    )





  }

  //if (lists.length === 0) return <h1>Loading</h1>
  if (elections.length === 0) return <h1>Loading</h1>

  if (idEleccion === '') {
    setIdEleccion(elections[0].id)
  }

  if (idEleccion === '') return <h1>Loading</h1>




  return (


    <div >


      <br />
      <h2 className="titulos">Listas</h2>
      <ToastContainer></ToastContainer>
      <form className="container" onSubmit={handleSubmitForm}>
        <div className="form-group">
          <label>Elecciones</label>

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



      <button
        className="btn btn-success fab " onClick={openModal}>
        <i className="fas fa-plus"></i>

      </button>



      <br />
      <br />
      <div className="form-screen ">
        <table className="table ">
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
                            className="btn btn-primary"
                            onClick={() => onSelectElection(lista)}

                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          {"   "}
                          <button
                            className="btn btn-danger"
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
        </table>
      </div>



      <button type="button" name="vote" id="vote" className="btn btn-success fab-danger" onClick={agregarListas}>Agregar a Blockchain</button>

      <ListaModal idEleccion={idEleccion} />



    </div>
  );
}
