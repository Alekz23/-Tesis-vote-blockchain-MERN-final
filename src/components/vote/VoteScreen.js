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
let direccionTrx;
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
      img: "https://res.cloudinary.com/universidad-tecnica-del-norte/image/upload/v1646872890/images%20vote/boto_blanco_mrvevr.png",
      descripcion: " ",
      candidates: []
    }

    let votoNulo = {
      id: "23146",
      nombre: "Voto Nulo",
      img: "https://res.cloudinary.com/universidad-tecnica-del-norte/image/upload/v1646873036/images%20vote/VOTO_NULO_whrvhx.png",
      descripcion: " ",
      candidates: []
    }

    if (lists[0].voteBN === true) {
      if (nuevo.length > 0) {
        nuevo.push(votoBlanco)
        nuevo.push(votoNulo)

      }
    }
    //console.log(nuevo, 'nueva lista con o sin vot B/n')
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
        //console.log(data, 'ya voto ver');
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
      title: '¿Estás seguro?',
      text: "No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, enviar',

    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Enviando...',
          text: 'Espere por favor...',
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
              let url = `https://mumbai.polygonscan.com/tx/ ${tx.transactionHash}`;
              direccionTrx= url;
              console.log(tx)
              Swal.fire({
                icon: 'success',
                title: 'Voto generado con exito!',
                footer: '<a id="enlace" href="">Url del voto</a>'
              })
              var elemento = document.getElementById("enlace");
              elemento.href = url
              elemento.target = "_blank"
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

  //console.log('estats actual', stats);

  // if (stats === 0) {
  //   console.log('sin listas en la blockchain!');
  // }
  if (stats === 0) return <div className="padre">
    <div className="spinner">
      <span>Loading...</span>
      <div className="half-spinner"></div>
    </div>
  </div>

  const nameElection = (elections[0].nombre);

  return (
    <div className="container py-3">



      {(fechaActual.isSameOrAfter(start) && fechaActual < end) ? <div>

        <h2 className="titulos">{nameElection}</h2>
        <br />
        <div className="table-responsive-sm">
          <Table className="titulos table table-hover table-sm ">
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Descripción</th>
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

                      <td data-label="Nombre" className='tabla_letra'>{lista.nombre.toUpperCase()}</td>
                      <td data-label="Descripción">{lista.descripcion}</td>

                      <td data-label="Imagen">
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

                      <td data-label="Candidatos">{candidatos.map((candidate) => {
                        return <p key={candidate.id}> {lista.id?.search(candidate.lista?._id) ? '' : `${candidate.nombre} ${candidate.apellido}: ${candidate.cargo} `} </p>
                      })}</td>

                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => onSelectElection(index)}
                        >
                          <i className="fas fa-vote-yea fa-lg"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>

          {/* <div className="containerPage">
            <iframe className="responsive-iframe" src="http://geekbucket.com.mx/blog/2018/10/15/google-marcara-como-no-seguros-a-los-sitios-web-sin-https/"></iframe>
          </div> */}
        </div>
      </div>
        :
        <div className="container py-3">
          <h1 className='titulos'>Eleccion Inactiva</h1>
          <h3 className='titulos'>Fecha de inicio: {moment(start).format('YYYY-MM-DD HH:mm:ss')}</h3>
          <h3 className='titulos'>Fecha de fin: {moment(end).format('YYYY-MM-DD HH:mm:ss')}</h3>
        </div>
      }
    </div>
  );
}
