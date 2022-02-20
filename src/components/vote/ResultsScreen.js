import React, { useEffect, useState } from 'react';


import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { getStats, getWinner, init } from '../../helpers/getWeb3Vote';
import { ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { electionStartLoading } from '../../actions/elections';
import moment from 'moment';
import { userStartLoading } from '../../actions/users';
ChartJS.register(ArcElement, Tooltip, Legend);

const total_votantes = 5;


const dataset = {
  label: '# de Votos',
  data: [],
  backgroundColor: [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(255, 206, 86, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)',
  ],
  borderColor: [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
  ],
  borderWidth: 2,

};

//fecha actual
//const momentEnd = moment(end);

const seconds = 120
export const ResultsScreen = () => {

  const [winner, setWinner] = useState('')
  const [stats, setStats] = useState()
  const [proposals, setProposals] = useState([])
  const [totalVotes, setTotalVotes] = useState(0)


  const [elections] = useSelector(state => [state.eleccion.election]);
  const [users] = useSelector(state => [state.user.usuarios]);
  const dispatch = useDispatch();


  useEffect(() => {

    dispatch(userStartLoading());

  }, [dispatch])


  useEffect(() => {

    dispatch(electionStartLoading());

  }, [dispatch])





  //iniciar blockchain
  useEffect(() => {
    init();
    getStatsF()
    setInterval(() => {
      getStatsF()
    }, (seconds * 1000)); // sec * millsecs
  }, [])


  const getStatsF = () => {
    getStats()
      .then(tx => {
        const labels = tx.map(vote => vote[0])
        setProposals(labels)
        const data = tx.map(vote => Number(vote[1]))
        const datasets = [{
          ...dataset,
          data
        }]
        const statsData = {
          labels,
          datasets
        }
        setStats(statsData)

        const total = data.reduce((acc, item) => acc + item)
        setTotalVotes(total)
      })
      .catch(err => console.log(err))
  }

  const getWinnerF = () => {
    getWinner()
      .then(tx => {
        setWinner(tx)
      })
      .catch(err => console.log(err))
  };

  const totalVotantes = () => {

    let cont = 0;
    for (let i = 0; i < users.length; i++) {

      if (users[i].rol === "USER_ROLE") {
        cont++;
      }
    }
    console.log('num de votantes', cont);
    return cont;
  }

  const percent = () => {
    
    const val = ((totalVotes * 100) / totalVotantes()).toFixed(2)
    return `${val}%`

  }
  // const percent = () => {
  //   const val = ((totalVotes * 100) / total_votantes).toFixed(2)
  //   return `${val}%`
  // }

  if (elections.length === 0) return <h1>Loading</h1>
  if (users.length === 0) return <h1>Loading</h1>
  if (totalVotantes() === 0) return <h1>No hay votantes</h1>

  //obtener datos del estado global de eleccion activa
  const end = moment(elections[0].end);

  //console.log(start,'fecha de start');
  //console.log(end,'fecha de emd');

  const now = moment().seconds(0).add(0, 'hours'); // 3:00:00
  //const nowPlus1 = now.clone().add(1, 'hours');
  const fechaActual = now;


  return <div>



    <h2 className="titulos"> Resultados de la Eleccion</h2>
    <hr />

    {(fechaActual > end) ?

      <div>
        <ToastContainer />
        <div>
          {
            stats &&
            <Doughnut
              data={stats}
              className='categoriesDiv'

            />
          }
          {
            totalVotes && totalVotantes() &&
            <>
              <p>Votos: {totalVotes}/{totalVotantes()}</p>
              <div className="progress my-2" style={{ height: 30 }}>
                <div className="progress-bar" role="progressbar" style={{ width: percent() }} aria-valuenow={totalVotes} aria-valuemin="0" aria-valuemax={total_votantes}>{percent()}</div>
              </div>
            </>
          }
          {
            winner &&
            <p className='my-2'>Actual winner: {winner}</p>
          }


        </div>

        <div className='d-flex justify-content-between my-2'>
          <button type="button" name="vote" id="vote" className="btn btn-primary" onClick={getWinnerF}>get winner</button>
          <button type="button" name="vote" id="vote" className="btn btn-primary" onClick={getStatsF}>get stats</button>
        </div>


      </div>


      :
      <div className="titulos">
        <h1>Eleccion en proceso</h1>
        <h2>Fecha de Resultados: {moment(end).format('YYYY-MM-DD HH:mm:ss')}</h2>
      </div>
    }

  </div>

};
