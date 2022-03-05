import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { candidatoStartLoading } from '../../actions/candidates';
import { listaStartLoading } from '../../actions/lists';

import { getStats, init, vote } from '../../helpers/getWeb3Vote';


import Swal from 'sweetalert2';
import { electionStartLoading } from '../../actions/elections';
import moment from 'moment';
import { Table } from 'react-bootstrap';
import { userStartLoading, userStartUpdate } from '../../actions/users';



// const initialState = [
//   'Proposal 1', 'Proposal 2', 'Proposal 3'
// ]
let tamaño = 0;
export const VoteScreen = () => {


  const [lists] = useSelector(state => [state.lista.lista]);
  const [cedula] = useSelector(state => [state.auth.cedula]);
  const dispatch = useDispatch();

  //advertencia --- eliminar si tarda en ingresar
  const [stats, setStats] = useState(0)

  const initialState = {}
  const [state, setState] = useState(initialState);

  const [users] = useSelector(state => [state.user.usuarios]);


  const [elections] = useSelector(state => [state.eleccion.election]);
  //testeando listas de elecciones de
  const [tests] = useSelector(state => [state.eleccion.election]);
  // const { election: elections } = useSelector(state => state.eleccion);


  //console.log(tests[0].lists, 'eso deberian ser las listas')

  useEffect(() => {

    dispatch(electionStartLoading());

  }, [dispatch])

  useEffect(() => {

    dispatch(userStartLoading());


  }, [dispatch])


  useEffect(() => {
    init();
    getStats()
      .then(tx => {
        tamaño = tx.length;
        setStats(tamaño);
      })
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {

  }, [state])

  let nuevo = [];
  const listasEleccion = () => {
    // solo las listas de la eleccion 1 por el mometo
    for (let i = 0; i < lists.length; i++) {
      if (lists[i].eleccion._id === (elections[0].id)) {
        nuevo.push(lists[i])
      }

    }

    let votoBlanco = {
      id: "231442",
      nombre: "Voto Blanco",
      img: "https://res.cloudinary.com/universidad-tecnica-del-norte/image/upload/v1645414706/vote/arton27355_fh7pev.jpg",
      descripcion: " ",
      candidates: []
    }

    let votoNulo = {
      id: "23146",
      nombre: "Voto Nulo",
      img: "https://res.cloudinary.com/universidad-tecnica-del-norte/image/upload/v1645414706/vote/1-72_t6qtfg.jpg",
      descripcion: " ",
      candidates: []
    }

    if (lists[0].voteBN === true) {
      if (nuevo.length > 0) {
        nuevo.push(votoBlanco)
        nuevo.push(votoNulo)

      }
    }


    console.log(nuevo, 'nueva lista con o sin vot B/n')
  }

  const buscarUsuario = () => {

    let idUsuario = ''
    for (let i = 0; i < users.length; i++) {
      if (users[i].cedula === cedula) {
        idUsuario = users[i]._id;
        const data = {
          _id: idUsuario,
          vote: true
        }
        dispatch(userStartUpdate(data));
        //dispatch(userStartLoading());
        console.log(data, 'ya voto ver');
      }
    }
  }


  const onSelectElection = (e) => {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    Swal.fire({
      title: 'Estas seguro?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, send it!',

    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Sending...',
          text: 'Please wait...',
          allowOutsideClick: false,
          onBeforeOpen: () => {
            Swal.showLoading();
          }
        });

        const init = {
          ...state,
          proposal: e,
          ci: cedula

        }
        setState(init)

        if (init.ci) {
          vote(init)
            .then(tx => {
              Swal.close();
              buscarUsuario();
              //Swal.fire("Enviado", "Voto generado con exito!", "success");
              let url= `https://testnet.bscscan.com/tx/ ${tx.transactionHash}`;
            
              Swal.fire({
                icon: 'success',
                title: 'Voto generado con exito!',
                //footer:(textoActivo.link(url))
                footer: '<a id="enlace" href="">Url del voto</a>'
              })
              var elemento = document.getElementById("enlace");
              elemento.href = url
              elemento.target="_blank"

              console.log(tx.transactionHash, 'del voto tx');
              console.log(tx, 'toda info')
              console.log("https://rinkeby.etherscan.io/tx/", tx.transactionHash)
              setState(initialState)
            })
            .catch(err => {
              console.log(err)
              Swal.fire("Error", "Ya has votado!", "error");
            })
        }
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'Tu voto ha sido cancelado :(',
          'error'
        )
      }
    })

  }

  useEffect(() => {
    dispatch(listaStartLoading());

  }, [dispatch]);

  //llamar a la blockchain para verificar si estavacia

  const obtenerListas = () => {
    getStats()
      .then(tx => {
        tamaño = tx.length;
        //setproposal(tx)
      })
      .catch(err => console.log(err))
  }




  //...---------------------------

  const [candidatos] = useSelector(state => [state.candidato.candidatos]);

  useEffect(() => {
    dispatch(candidatoStartLoading());
  }, [dispatch])

  if (elections.length === 0) return <span>No hay elecciones disponibles</span>

  const start = moment(elections[0].start);
  const end = moment(elections[0].end);

  const now = moment().seconds(0).add(0, 'hours'); // 3:00:00
  const fechaActual = now;

  if (elections.length > 0 && lists.length > 0) {
    listasEleccion();
  }

  if (nuevo.length === 0) return <span>No hay listas</span>
  if (users.length === 0) return <span>No hay electores registrados</span>
  obtenerListas();

  console.log('estats actual', stats);
  // if (!stats) return <div className="spinner">
  //   <span> no aparece...</span>
  //   <div className="half-spinner"></div>
  // </div>
if(stats===0){
  console.log('sin listas en la blockchain!');
}
  if(stats === 0) return <div className="padre">
        <div className="spinner">
          <span>Loading...</span>
          <div className="half-spinner"></div>
        </div>
      </div>

  return (
    <div >

          <h2 className="titulos">Listas</h2>

          {(fechaActual.isSameOrAfter(start) && fechaActual < end) ? <div>
            <br />
            <div >
              <Table className="titulos">
                <thead>
                  <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Descripcion</th>
                    <th scope="col">Imagen</th>
                    <th scope="col">Candidatos</th>
                    <th scope="col">Votar</th>
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
                            return <p key={candidate.id}> {lista.id?.search(candidate.lista?._id) ? '' : `${candidate.nombre} ${candidate.apellido}: ${candidate.cargo} `} </p>

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
              </Table>
            </div>



          </div>
            :
            <div>

              <h1 className='titulos'>Eleccion Inactiva</h1>
              <h2 className='titulos'>Fecha de inicio: {moment(start).format('YYYY-MM-DD HH:mm:ss')}</h2>
              <h2 className='titulos'>Fecha de fin: {moment(end).format('YYYY-MM-DD HH:mm:ss')}</h2>


            </div>

          }

       

    </div>
  );
}
