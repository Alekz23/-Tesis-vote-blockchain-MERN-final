import React, { useEffect, useState } from 'react';

import { getStats, getWinner, init } from '../../helpers/getWeb3Vote';
import { ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { electionStartLoading } from '../../actions/elections';
import moment from 'moment';
import { userStartLoading } from '../../actions/users';
//import 'chart.piecelabel.js';

//--------------IMPORTANTE----------------
// page de graficos https://js.devexpress.com/Demos/WidgetsGallery/Demo/Charts/FunnelChart/React/Light/


import PieChart, {
  Legend,
  Export,
  Series,
  Label,
  Font,
  Connector,
} from 'devextreme-react/pie-chart';

import {
  Chart, SeriesTemplate, CommonSeriesSettings, Title,
} from 'devextreme-react/chart'


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
let listasJson = [];
//const seconds = 120
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
    listasJson = []
    init();
    getStatsF()
    // setInterval(() => {
    //   getStatsF()
    // }, (seconds * 1000)); // sec * millsecs
  }, [])



  const getStatsF = () => {
    getStats()
      .then(tx => {
        console.log(tx, 'asi viene', tx.length, tx[0].voteCount);
        for (let i = 0; i < tx.length; i++) {
          let name = tx[i].name;
          let voteCount = tx[i].voteCount;

          listasJson.push({ name: name, voteCount: voteCount });

        }
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
 
  const handleInputChange = ({ target }) => {
    setTipoGrafico(target.value)
    //console.log(target.value,'select maldita');

  }

  const end = moment(elections[0].end);
  const nameElection= (elections[0].nombre);



  const now = moment().seconds(0).add(0, 'hours'); // 3:00:00
  //const nowPlus1 = now.clone().add(1, 'hours');
  const fechaActual = now;

  console.log(stats, 'final data')

  // function customizeText(arg) {
  //   console.log(arg, 'trae');
  //   //console.log(`votos: ${arg.valueText} (${arg.percentText})`, 'cada grafica');
  //   return `votos: ${arg.valueText} (${arg.percentText})`;
  // }

  function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}

  function customizeText2(arg) {
    let porc = (100 / totalVotantes());
  
    
    //return `votos: ${arg.valueText} (${(arg.value*porc).toFixed(2)}%)`;
    return `votos: ${arg.valueText} (${roundToTwo(arg.value*porc)}%)`;
  }



  if (totalVotantes() === 0) return <span>No hay votantes</span>
  if (elections.length === 0) return <span>Loading</span>
  if (users.length === 0) return <span>Loading</span>
  if (!stats) return <div className="padre">

    <div className="spinner">
      <span>Loading...</span>
      <div className="half-spinner"></div>
    </div>
  </div>
  console.log(listasJson, 'a json');

  return <div>

{(fechaActual > end) ?

<div>

    <h2 className="titulos"> Resultados de la {nameElection}</h2>

    <div className="form-group">
      <small id="emailHelp" className="form-text text-muted">Seleccione el tipo de grafico</small>
      <select className="form-control"
        name="tipoGrafico"
        value={tipoGrafico}
        onChange={handleInputChange}>


        <option key={1} value={1}> Gráfico circular </option>
        <option key={2} value={2}> Gráfico de barras </option>
        <option key={3} value={3}> Gráfico de barras Slide </option>
      </select>
    </div>



    {tipoGrafico === "1" ?
      <PieChart id="pie"
        palette="Bright"
        type="doughnut"
        dataSource={listasJson}
      // title="Olympic Medals in 2008"
      >
        <Legend
          orientation="horizontal"
          itemTextPosition="right"
          horizontalAlignment="center"
          verticalAlignment="bottom"
          columnCount={4} />
        <Export enabled={true} />
        <Series argumentField="name" valueField="voteCount">
          <Label
            visible={true}
            position="columns"
            customizeText={customizeText2}>
            <Font size={16} />
            <Connector visible={true} width={0.5} />
          </Label>
        </Series>
      </PieChart>

      : tipoGrafico === "2" ?
      <Chart
      id="chart"
      palette="Soft"
      dataSource={listasJson}>
      <CommonSeriesSettings
        argumentField="name"
        valueField="voteCount"
        type="bar"
        ignoreEmptyPoints={true}
      >
         <Label
                visible={true}
                position="columns"
                customizeText={customizeText2}>
                <Font size={15} />
              
              </Label>
        </CommonSeriesSettings>
      <SeriesTemplate nameField="name" />
      {/* <Title
        text= {`resulatdo de la `+ nameElection} 
        subtitle="as of January 2017"
      /> */}
    </Chart>
        : tipoGrafico === "3" ?
          <Chart
            id="chart"
            palette="Soft"
            rotated={true}
            dataSource={listasJson}>
            <CommonSeriesSettings
              argumentField="name"
              valueField="voteCount"
              type="bar"
              ignoreEmptyPoints={true}

            >
              
              <Label
                visible={true}
                position="columns"
                customizeText={customizeText2}>
                <Font size={15} />
                <Connector visible={true} width={0.5} />
              </Label>
            </CommonSeriesSettings>
            <SeriesTemplate nameField="name" />
            <Title
            // text="Age Breakdown of Facebook Users in the U.S."
            // subtitle="as of January 2017"
            />
             <Export enabled={true} />
          </Chart>
          :
          <PieChart id="pie"
            palette="Bright"
            type="doughnut"
            dataSource={listasJson}
          // title="Olympic Medals in 2008"
          >
            <Legend
              orientation="horizontal"
              itemTextPosition="right"
              horizontalAlignment="center"
              verticalAlignment="bottom"
              columnCount={4} />
            <Export enabled={true} />
            <Series argumentField="name" valueField="voteCount">
              <Label
                visible={true}
                position="columns"
                customizeText={customizeText2}>
                <Font size={16} />
                <Connector visible={true} width={0.5} />
              </Label>
            </Series>
          </PieChart>


    }
    
        <ToastContainer />
        <div>

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
            <h4 className='my-2'>Actual winner: {winner}</h4>
          }


        </div>

        <div className='d-flex justify-content-between my-2'>
          <button type="button" name="vote" id="vote" className="btn btn-primary" onClick={getWinnerF}>get winner</button>
          {/* <button type="button" name="vote" id="vote" className="btn btn-primary" onClick={getStatsF}>get stats</button> */}
          {/* <button type="button" name="vote" id="vote" className="btn btn-primary" onClick={obtenerListas}>blockchain</button> */}
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
