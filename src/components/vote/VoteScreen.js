import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { candidatoStartLoading } from '../../actions/candidates';
import { listaStartLoading } from '../../actions/lists';

import { init, vote } from '../../helpers/getWeb3Vote';


import Swal from 'sweetalert2';
import { electionStartLoading } from '../../actions/elections';
import moment from 'moment';



// const initialState = [
//   'Proposal 1', 'Proposal 2', 'Proposal 3'
// ]

export const VoteScreen = () => {


  const [lists] = useSelector(state => [state.lista.lista]);
  const [cedula] = useSelector(state => [state.auth.cedula]);
  const dispatch = useDispatch();


  const initialState = {}
  const [state, setState] = useState(initialState);



  const [elections] = useSelector(state => [state.eleccion.election]);
  //testeando listas de elecciones de
  const [tests] = useSelector(state => [state.eleccion.election]);
  // const { election: elections } = useSelector(state => state.eleccion);


  //console.log(tests[0].lists, 'eso deberian ser las listas')

  useEffect(() => {

    dispatch(electionStartLoading());

  }, [dispatch])




  useEffect(() => {
    init();
  }, [])

  useEffect(() => {

  }, [state])

  let nuevo = [];
  const listasEleccion = () => {

    for (let i = 0; i < lists.length; i++) {
      if (lists[i].eleccion._id === (elections[0].id)) {
        nuevo.push(lists[i])
      }

    }
    console.log(nuevo, 'nueva lista')
  }




  const onSelectElection = (e) => {

    const init = {
      ...state,
      proposal: e,
      ci: cedula

    }
    setState(init)

    //-----state []
    if (init.ci) {
      vote(init)
        .then(tx => {
          Swal.fire("Enviado", "Voto generado con exito!", "success");

          setState(initialState)
        })
        .catch(err => {
          console.log(err)
          Swal.fire("Error", "Ya has votado!", "error");
        })
    }


  }


  useEffect(() => {
    dispatch(listaStartLoading());

  }, [dispatch]);


  const [candidatos] = useSelector(state => [state.candidato.candidatos]);

  useEffect(() => {
    dispatch(candidatoStartLoading());
  }, [dispatch])


  if (elections.length === 0) return <h2>No hay elecciones disponibles</h2>

  // agregar un esatdo global y obtener datos de la eleccion activa
  const start = moment(elections[0].start);
  const end = moment(elections[0].end);

  const now = moment().seconds(0).add(0, 'hours'); // 3:00:00
  const fechaActual = now;

  //console.log(fechaActual,'fecha actual');

  if (elections.length > 0 && lists.length > 0) {
    listasEleccion();
  }

  if (nuevo.length === 0) return <h2>No hay listas</h2>
  return (


    <div>

      <br />


      <h2 className="titulos">Listas</h2>

      {(fechaActual.isSameOrAfter(start) && fechaActual < end) ? <div>
        <br />
        <div className="form-screen ">
          <table className="table ">
            <thead>
              <tr>

                <th>Nombre</th>
                <th>Descripcion</th>
                <th>Imagen</th>
                <th>Candidatos</th>
                <th>Votar</th>
              </tr>
            </thead>
            <tbody>
              {
                nuevo.map((lista, index) => {
                  return (
                    <tr key={lista.id} >

                      <td>{lista.nombre}</td>
                      <td>{lista.descripcion}</td>

                      <td>
                        {
                          (lista.img)
                          && (

                            <div className="votes__image">
                              <img className='imgCentrar'
                                src={lista.img}
                                alt=""
                              />
                            </div>
                          )}
                      </td>

                      <td>{candidatos.map((candidate) => {
                        // return <td> {candidate.lista._id.search(lista.id) ? candidate.nombre :'no hay candidatos'} </td>
                        return <p> {lista.id.search(candidate.lista._id) ? '' : `${candidate.nombre}: ${candidate.cargo} `} </p>

                      })}</td>

                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => onSelectElection(index)}

                        >
                          <i className="fas fa-vote-yea"></i>
                        </button>

                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>



      </div>
        :
        <div>

          <h1>Eleccion Inactiva</h1>
          <h2>Fecha de inicio: {moment(start).format('YYYY-MM-DD HH:mm:ss')}</h2>
          <h2>Fecha de fin: {moment(end).format('YYYY-MM-DD HH:mm:ss')}</h2>


        </div>

      }


    </div>
  );
}
