import React, { useEffect, useState } from 'react';

import { Doughnut } from 'react-chartjs-2';
import { getStats, getWinner, init } from '../../helpers/getWeb3Vote';
import { ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { electionStartLoading } from '../../actions/elections';
import moment from 'moment';
import { userStartLoading } from '../../actions/users';
import 'chart.piecelabel.js';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  ArcElement,
  Legend,
  Chart,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

//testear con porcentajes



const dataset = {
  label: 'Porcentaje %',
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
    plugins: {
      datalabels: {
        formatter: (value) => {
          return value + '%';
        }
      }
    }
  }

};



//fecha actual
//const momentEnd = moment(end);

const seconds = 120
export const ResultsScreen = () => {

  const [winner, setWinner] = useState('')
  const [stats, setStats] = useState()
  const [proposals, setProposals] = useState([])
  const [totalVotes, setTotalVotes] = useState(0)

  const [tipoGrafico, setTipoGrafico] = useState(1);


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

        let porc = (100 / totalVotantes());
        const data = tx.map(vote => (Number(vote[1]) * porc))
        const datasets = [{
          ...dataset,
          data
        }]

       
        
        const statsData = {
          labels,
          datasets,
          
        }
        setStats(statsData)
        const data2 = tx.map(vote => Number(vote[1]));
        const total = data2.reduce((acc, item) => acc + item)
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

      if (users[i].rol === "Elector") {
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
        console.log(tx.length, 'este tamaño tiene en blockchain');
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
  if (totalVotantes() === 0) return <h1>No hay votantes</h1>
  if (elections.length === 0) return <h1>Loading</h1>
  if (users.length === 0) return <h1>Loading</h1>
  if (!stats) return <h1>Loading stats</h1>



  const optionsaa = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
        text: 'Chart.js Bar Chart',
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            var dataset = data.dataset[tooltipItem.datasetIndex];
            var total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
              return previousValue + currentValue;
            });
            var currentValue = dataset.data[tooltipItem.index];
            var percentage = Math.floor(((currentValue / total) * 100) + 0.5);
            return percentage + "%";
          }
        }
      },

    },
  };

  const handleInputChange = ({ target }) => {
    setTipoGrafico(target.value)
    //console.log(target.value,'select maldita');

  }

  //obtener datos del estado global de eleccion activa
  const end = moment(elections[0].end);

  //console.log(start,'fecha de start');
  //console.log(end,'fecha de emd');

  const now = moment().seconds(0).add(0, 'hours'); // 3:00:00
  //const nowPlus1 = now.clone().add(1, 'hours');
  const fechaActual = now;

  console.log(stats, 'final data')

  const opciones = {
    responsive: true,
    maintainAspectRatio: true,
    piecelabel: {
      render: function (args) {
        return args.label + ": " + args.value + "%";
      },
      fontSize: 15,
      fontColor: '#fff',
      fontfamily: 'Arial'
    }
  }



  

  var options = {
    // pieceLabel: {
    //   render: function (d) { return d.label + " (" + d.percentage + "%)" },
    //   fontColor: '#000',
    //   position: 'outside',
    //   segment: true
    // }

  
      plugins: {
        datalabels: {
          formatter: (value) => {
            return value + '%';
          }
        }
      }
    }
  
  


  


  return <div>



    <h2 className="titulos"> Resultados de la Eleccion</h2>


    {(fechaActual > end) ?

      <div>
        <ToastContainer />
        <div>


          <div className="form-group">
            <small id="emailHelp" className="form-text text-muted">Seleccione el tipo de grafico</small>
            <select className="form-control"
              name="tipoGrafico"
              value={tipoGrafico}
              onChange={handleInputChange}>


              <option key={1} value={1} > Barras </option>
              <option key={2} value={2}  > Dona </option>
            </select>


          </div>
          {
            tipoGrafico === "1" ? <Bar data={stats}  options={options} className='categoriesDiv' />
              : tipoGrafico === "2" ? <Doughnut data={stats}  options={options}   className='categoriesDiv' />
                : <Bar data={stats } className='categoriesDiv' />
          }



          {/* {
           tipoGrafico===2&&
            <Doughnut options={options} data={stats}
              className='categoriesDiv'
            />
          } */}

          {
            totalVotes && totalVotantes() &&
            <>
              <p>Votos: {totalVotes}/{totalVotantes()}</p>
              <div className="progress my-2" style={{ height: 30 }}>
                <div className="progress-bar" role="progressbar" style={{ width: percent() }} aria-valuenow={totalVotes} aria-valuemin="0" aria-valuemax={totalVotantes()}>{percent()}</div>
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
