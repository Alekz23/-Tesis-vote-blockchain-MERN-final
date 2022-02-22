import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uiOpenModal } from '../../actions/ui';
import { candidatoSetActive, candidatoStartDelete, candidatoStartLoading } from '../../actions/candidates';
import { CandidatoModal } from './CandidatoModal';
import Swal from 'sweetalert2';
import { listaStartLoading } from '../../actions/lists';
import { useState } from 'react';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CargoScreen } from '../cargos/CargoScreen';
import { CargoModal } from '../cargos/CargoModal';


export const CandidatoScreen = () => {


  const [candidatos] = useSelector(state => [state.candidato.candidatos]);


  const [lists] = useSelector(state => [state.lista.lista]);
  //testeando listas
  const [idLista, setIdLista] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {

    dispatch(listaStartLoading());

  }, [dispatch])

  useEffect(() => {
    dispatch(candidatoStartLoading());

  }, [dispatch, idLista])


  const handleInputChange = ({ target }) => {
    const selectedLista = target.value;
    setIdLista(selectedLista);
    //console.log(idLista, 'esto viene select ')
  }

  const handleSubmitForm = (e) => {



    setIdLista(e.target.value)



    e.preventDefault();

    //console.log(idLista, 'enviados desde el form')


  }


  //console.log(elections, "si llega estos datos");




  useEffect(() => {

    dispatch(candidatoStartLoading());

  }, [dispatch])

  const openModal = () => {

    dispatch(uiOpenModal());

  }

  const onSelectElection = (e) => {
    dispatch(candidatoSetActive(e));
    dispatch(uiOpenModal());
    //console.log(e)
  }

  const onDeletElection = (e) => {
    dispatch(candidatoSetActive(e));
    Swal.fire({
      title: "Are you sure about deleting this candidate?",
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
        dispatch(candidatoStartDelete());

      } else {

      }

    }
    )


  }

  //if (candidatos.length === 0) return <h1>Loading</h1>
  if (lists.length === 0) return <h1>Loading</h1>
  if (idLista === '') {
    setIdLista(lists[0].id)
  }

  if (idLista === '') return <h1>Loading</h1>



  return (
    <div>
      <br />
      <h2 className="titulos">Candidatos</h2>
      <ToastContainer></ToastContainer>

      <form className="container" onSubmit={handleSubmitForm}>
        <div className="form-group">
          <label>Listas</label>

          <select className="form-control"
            name="idLista"
            value={idLista}

            onChange={handleInputChange}>

            {

              lists.map(list => (
                <option key={list.id} value={list.id} >{list.nombre}</option>
              ))
            }


          </select>

        </div>


      </form>

      {/* <CargoScreen/> */}
      <button
        className="btn btn-success fab" onClick={openModal}>
        <i className="fas fa-plus"></i>

      </button>


      <br />
      <div className="form-screen">
        <table className="table">
          <thead>
            <tr>
              <th>Candidato</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Cargo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {

              candidatos.map((candidate) => {
                return (
                  <tr key={candidate.id}>
                    {candidate.lista._id && candidate.lista._id.search(idLista) ? '' :
                      <> 
                        <td>
                          {
                            (candidate.img)
                            && (
                              <div >
                                <img className='userListImg'
                                  src={candidate.img}
                                  alt=""
                                />
                              </div>
                            )}
                        </td>
                        <td>{candidate.nombre}</td>
                        <td>{candidate.apellido}</td>
                        <td>{candidate.cargo}</td>



                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => onSelectElection(candidate)}

                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          {"   "}
                          <button
                            className="btn btn-danger"
                            onClick={() => onDeletElection(candidate)}
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
      <CandidatoModal idLista={idLista} />
     



    </div>
  );
}
