import React, { useEffect, useState } from 'react';

import { getNameList, getStats, getWinner, init } from '../../helpers/getWeb3Vote';
import { ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { electionStartLoading } from '../../actions/elections';
import moment from 'moment';
import { userStartLoading } from '../../actions/users';
//import 'chart.piecelabel.js';

//--------------IMPORTANTE----------------
// page de graficos https://js.devexpress.com/Demos/WidgetsGallery/Demo/Charts/FunnelChart/React/Light/

// https://vizzuhq.com/


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
import { listaStartLoading } from '../../actions/lists';
import { candidatoStartLoading } from '../../actions/candidates';


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

let listasJson = [];
let final = [];
let ListasJsonBarras = [];
//const seconds = 120
export const ResultsScreen = () => {


  const [winner, setWinner] = useState('')
  const [nameList, setNameList] = useState('')
  const [stats, setStats] = useState()
  const [totalVotes, setTotalVotes] = useState(0)
  const [tipoGrafico, setTipoGrafico] = useState(1);

  //add

  const [lists] = useSelector(state => [state.lista.lista]);
  const [candidatosList] = useSelector(state => [state.candidato.candidatos]);
  const [candidatos, setCandidatos] = useState('')
  const [ver, setVer] = useState()

  //fin

  const [elections] = useSelector(state => [state.eleccion.election]);
  const [users] = useSelector(state => [state.user.usuarios]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userStartLoading());
  }, [dispatch])

  useEffect(() => {
    dispatch(electionStartLoading());
  }, [dispatch])


  useEffect(() => {
    dispatch(listaStartLoading());

  }, [dispatch])

  useEffect(() => {
    dispatch(candidatoStartLoading());

  }, [dispatch])

  //iniciar blockchain
  useEffect(() => {
    listasJson = []
    ListasJsonBarras = []
    final = []
    init();
    getStatsF()
    // setInterval(() => {
    //   getStatsF()
    // }, (seconds * 1000)); // sec * millsecs
  }, [])


  const getStatsF = () => {
    getStats()
      .then(tx => {
        //console.log(tx, 'asi viene', tx.length, tx[0].voteCount);
        for (let i = 0; i < tx.length; i++) {
          let name = tx[i].name;
          let voteCount = tx[i].voteCount;

          listasJson.push({ name: name, voteCount: voteCount });

        }
        // for inverso para el grafico de barras
        for (let i = tx.length - 1; i >= 0; i--) {
          let name = tx[i].name;
          let voteCount = tx[i].voteCount;

          ListasJsonBarras.push({ name: name, voteCount: voteCount });

        }
        const labels = tx.map(vote => vote[0])
        //setProposals(labels)

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


    getNameList()
      .then(tx => {
        setNameList(tx)
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
    //console.log('num de votantes', cont);
    return cont;
  }

  const percent = () => {
    const val = ((totalVotes * 100) / totalVotantes()).toFixed(2)
    return `${val}%`
  }

  const handleInputChange = ({ target }) => {
    setTipoGrafico(target.value)
  }

  // const candidatosGanadores = () => {

  //   try {


  //     for (let i = 0; i < lists.length; i++) {

  //       if(nameList!== ''){
  //         if (lists[i].nombre === nameList) {

  //         if (lists[i].candidates?.length > 0) {

  //           for (let j = 0; j < lists[i].candidates.length; j++) {

  //             let cadena = "";

  //             cadena += lists[i].candidates?.nombre + " " +
  //               lists[i].candidates?.apellido + " " +
  //               lists[i].candidates?.cargo + "\n";

  //               console.log(cadena, 'los candidates');
  //             setCandidatos(cadena)

  //           }
  //         }

  //       }
  //       }

  //     }

  //   } catch (error) {
  //     console.log(error);
  //   }
  // }


  const candidatosGanadores = () => {


    final = [];
    try {



      for (let i = 0; i < lists.length; i++) {

        if (nameList !== '') {
          //console.log(lists[i].nombre.toUpperCase(), ' ', nameList.toUpperCase());

          if (lists[i].nombre.toUpperCase() === nameList.toUpperCase()) {

            //console.log(lists[i]);
            if (lists[i].candidates?.length > 0) {

              //console.log(lists[i].candidates.length);
              //console.log(lists[i].candidates);
              for (let j = 0; j < lists[i].candidates.length; j++) {

                // cadena = lists[i].candidates[j].nombre + " " +
                //   lists[i].candidates[j].apellido + " " +
                //   lists[i].candidates[j].cargo + "\n";

                let nuevo = {
                  id: j,
                  nombre: lists[i].candidates[j].nombre + " " + lists[i].candidates[j].apellido,
                  cargo: lists[i].candidates[j].cargo

                }
                //console.log(nuevo, 'los candidates');
                ///setCandidatos(nuevo)
                final.push(nuevo)
                setVer({ ...ver, nuevo })

              }
            }

          }
        }

      }

    } catch (error) {
      console.log(error);
    }


  }

  //console.log(stats, 'final data')

  // function customizeText(arg) {
  //   console.log(arg, 'trae');
  //   //console.log(`votos: ${arg.valueText} (${arg.percentText})`, 'cada grafica');
  //   return `votos: ${arg.valueText} (${arg.percentText})`;
  // }

  function roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
  }

  function customizeText2(arg) {
    let porc = (100 / totalVotantes());
    return `votos: ${arg.valueText} (${roundToTwo(arg.value * porc)}%)`;
  }


  if (totalVotantes() === 0) return <span>No hay votantes</span>
  if (elections.length === 0) return <span >Sin elecciones...</span>


  let end = '';
  let nameElection = '';
  const now = moment().seconds(0).add(0, 'hours'); // 3:00:00
  const fechaActual = now;


  for (let i = 0; i < elections.length; i++) {

    if (elections[i].lists[0]?.agregado === true) {
      end = moment(elections[i].end);
      nameElection = (elections[i].nombre);
    }
  }

  if (users.length === 0) return <span>Loading</span>
  if (lists.length === 0) return <span>Loading</span>
  if (!stats) return <div className="padre">

    <div className="spinner">
      <span>Loading...</span>
      <div className="half-spinner"></div>
    </div>
  </div>

  if (listasJson.length === 0) return <span>Sin datos de la Elecci??n</span>

  let cont = 0;
  if (listasJson.length > 0) {
    for (let i = 0; i < listasJson.length; i++) {

      if (listasJson[i].voteCount !== '0') {
        //console.log(listasJson[i].voteCount);
        cont = 1;

      }
    }

    if (cont === 0) return <span className="titulos">A??n no inicia el sufragio...</span>


  }


  return <div className='container  py-2'>

    {(fechaActual > end) ?

      <div>

        <h3 className="titulos"> Resultados de la {nameElection}</h3>

        <div className="form-group">
          <small id="emailHelp" className="form-text text-muted">Seleccione el tipo de grafico</small>
          <select className="form-control"
            name="tipoGrafico"
            value={tipoGrafico}
            onChange={handleInputChange}>

            <option key={1} value={1}> Gr??fico circular </option>
            <option key={2} value={2}> Gr??fico de barras </option>
            <option key={3} value={3}> Gr??fico de barras Slide </option>
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
              dataSource={ListasJsonBarras}>
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
              <Title
              // text= {`resulatdo de la `+ nameElection} 
              // subtitle="as of January 2017"
              />
            </Chart>
            : tipoGrafico === "3" ?
              <Chart
                id="chart"
                palette="Soft"
                rotated={true}
                dataSource={ListasJsonBarras}>
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
              <div className="progress my-2" style={{ height: 25 }}>
                <div className="progress-bar" role="progressbar" style={{ width: percent() }} aria-valuenow={totalVotes} aria-valuemin="0" aria-valuemax={totalVotantes()}>{percent()}</div>
              </div>
            </>
          }
          {
            winner &&
            <h5 className='my-2 titulos'>Actual ganador: {winner}</h5>
          }
         
          {
            final.length > 0 ?
              final.map(election => (
                <li key={election.id} className='titulos'>
                  {`${election.nombre} : ${election.cargo}`}
                </li>
              ))

              : ' '
          }

        </div>

        <div className='container'>
          <div className='row'>
            <div className='col-10'>
              <button type="button" name="vote" id="vote" className="btn btn-primary" onClick={getWinnerF}>Obtener ganador</button>
            </div>
            <div className='col-2'>
              <button type="button" name="vote" id="vote" className="btn btn-primary" onClick={candidatosGanadores}>Mostrar Candidatos</button>
            </div>
          </div>

        </div>



      </div>
      :
      <div className="titulos">
        <br />
        <h1>Eleccion en proceso...</h1>
        <h3>Fecha de resultados: {moment(end).format('YYYY-MM-DD HH:mm:ss')}</h3>
      </div>
    }

  </div>

};
