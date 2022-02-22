import React, { useEffect, useState } from 'react';


import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Bar, Chart, Doughnut } from 'react-chartjs-2';
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
  
  options: {
    responsive: true,
    legend: {
      position: 'bottom',
    },
    title: {
      display: false,
      text: 'Chart.js Doughnut Chart'
    },
    animation: {
      onComplete: function () {
        var chartInstance = this.chart;
        var ctx = chartInstance.ctx;
        console.log(chartInstance);
        var height = chartInstance.controller.boxes[0].bottom;
        ctx.textAlign = "center";
        Chart.helpers.each(this.data.dataset.forEach(function (dataset, i) {
          var meta = chartInstance.controller.getDatasetMeta(i);
          Chart.helpers.each(meta.data.forEach(function (bar, index) {
            ctx.fillText(dataset.data[index], bar._model.x, height - ((height - bar._model.y) / 2));
          }),this)
        }),this);
      }
    },
    tooltips: {
      callbacks: {
        label: function(tooltipItem, data) {
        	var dataset = data.datasets[tooltipItem.datasetIndex];
          var total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {
            return previousValue + currentValue;
          });
          var currentValue = dataset.data[tooltipItem.index];
          var percentage = Math.floor(((currentValue/total) * 100)+0.5);         
          return percentage + "%";
        }
      }
    }
  }

};


export const options = {
  responsive: true,
  plugins: {
    
    title: {
      display: true,
      text: 'Chart.js Bar Chart',
    },
    tooltips: {
      callbacks: {
        label: function(tooltipItem, data) {
        	var dataset = data.datasets[tooltipItem.datasetIndex];
          var total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {
            return previousValue + currentValue;
          });
          var currentValue = dataset.data[tooltipItem.index];
          var percentage = Math.floor(((currentValue/total) * 100)+0.5);         
          return percentage + "%";
        }
      }
    }
  },
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
        console.log(labels, 'eso en labels');
        let porc=100/5;
        const data = tx.map(vote => (Number(vote[1])*porc))
        const datasets = [{
          ...dataset,
          data
        }]
        console.log(data, 'eso en data');
        const statsData = {
          labels,
          datasets
        }

        console.log(statsData, 'stast data lo q envia al grafico')
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

  const obtenerListas = () => {

    getStats()
      .then(tx => {
        console.log(tx);
        //setproposal(tx)
      })
      .catch(err => console.log(err))
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

  console.log(stats, 'final data')

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

              options={options}

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
          <button type="button" name="vote" id="vote" className="btn btn-primary" onClick={obtenerListas}>blockchain</button>
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
