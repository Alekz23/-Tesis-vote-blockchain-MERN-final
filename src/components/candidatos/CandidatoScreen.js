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
import { Table } from 'react-bootstrap';


export const CandidatoScreen = () => {


  const [candidatos] = useSelector(state => [state.candidato.candidatos]);
  const [cargos] = useSelector(state => [state.cargo.cargos]);

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

    if (cargos.length >0) {
      dispatch(uiOpenModal());
    } else {
      toast.error('Por favor agrege los cargos para los candidatos!', {
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
    dispatch(candidatoSetActive(e));
    dispatch(uiOpenModal());
    //console.log(e)
  }

  const onDeletElection = (e) => {
    dispatch(candidatoSetActive(e));


    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    Swal.fire({
      title: 'Eliminar',
      text: "Estas seguro de eliminar este candidato?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delet it!',

    }).then((result) => {
      if (result.isConfirmed) {

        dispatch(candidatoStartDelete());
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'Tu candidato sigue activo :(',
          'error'
        )
      }
    })

  }

  //if (candidatos.length === 0) return <h1>Loading</h1>
  if (lists.length === 0) return <h1>Loading</h1>
  if (idLista === '') {
    setIdLista(lists[0].id)
  }

  if (idLista === '') return <h1>Loading</h1>



  return (
    <div className="container py-4">

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
      <button
        className="btn btn-success fab" onClick={openModal}>
        <i className="fas fa-plus"></i>
      </button>
      <br/>
      <div>

        <div className="row">
          <div className="col-md-4">
            <CargoScreen />
          </div>
          <div className="col-md-8">
            <br/>
            <br/>
            <Table className="titulos">
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
                                  <div>
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
                                className="btn btn-primary userListEdit"
                                onClick={() => onSelectElection(candidate)}
                              >
                                <i className="fas fa-edit"></i>
                              </button>

                              <button
                                className="btn btn-danger userListEdit"
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
            </Table>
          </div>
        </div>
      </div>
      <CandidatoModal idLista={idLista} />
    </div>
  );
}
