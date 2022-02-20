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




export const ListaScreen = () => {

  let listasBlockchain = [];
  const [lists] = useSelector(state => [state.lista.lista]);
  const [proposal, setproposal] = useState([]);

  //console.log(elections, "si llega estos datos");

  //testeando elecciones 
  const [elections] = useSelector(state => [state.eleccion.election]);
  const [idEleccion, setIdEleccion] = useState("");
  const [openList, setOpenList] = useState(false);

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
    Swal.fire({
      title: "Are you sure about deleting this list?",
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


      } else {

      }

    }
    )
  }




  const obtenerListas = () => {

    getStats()
      .then(tx => {
        console.log(tx);
        setproposal(tx)
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



    if (lists.length > 0) {
      for (let index = 0; index < lists.length; index++) {
        //setproposal(prop => [...prop, (lists[index].nombre)]);
        listasBlockchain.push((lists[index].nombre));
      }
    }


    console.log(listasBlockchain, 'lo q esta en listblocks');

    Swal.fire({
      title: "Guardar Listas",
      text: "¿Está seguro de guardar las listas en la blockchain?",
      imageUrl: "https://wetech.mx/wp-content/uploads/2020/12/kisspng-blockchain-vector-graphics-computer-icons-illustra-flvr-calculator-chasing-coins-5bf69839402611.9278574715428874812628.png",
      imageWidth: 300,
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


        for (let i = 0; i < listasBlockchain.length; i++) {
          console.log(listasBlockchain[i])
          AddListas(listasBlockchain[i])
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

      
      <button className="btn btn-primary btn-compact" onClick={agregarListas}>
        <i className="fa-brands fa-ethereum"></i>
        Agregar Listas
      </button>
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
              <th>ID</th>
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
                      <> <td >{lista.id}</td>
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
      <ListaModal idEleccion={idEleccion} />



    </div>
  );
}
