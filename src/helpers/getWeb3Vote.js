import Web3 from 'web3';
import voteContractBuild from '../build/contracts/Vote.json';
const Provider = require('@truffle/hdwallet-provider');

const address = '0xc01dda89e6151D19005c29DeEf364618273Ec148';

const privateKey = '62e93d412b219ecb9afd757e99070d6d7bc2bd02de6a77c6450082e46c487c08';
//const infuraUrl = 'https://rinkeby.infura.io/v3/02e6ba60363b49b7922a4f9ad1a87b4c';
// let gasPrice
// let gasLimit 
// let maxPriorityFeePerGas
// let  maxFeePerGas
// let  baseFeePerGas
let myContract;
let isInit = false;

export let addressContract;

export const init = async () => {
  //const provider = new Provider(privateKey, 'https://rinkeby.infura.io/v3/02e6ba60363b49b7922a4f9ad1a87b4c');
  //test con BSC
  //const provider = new Provider(privateKey, 'https://data-seed-prebsc-1-s1.binance.org:8545');
  // test con Polygon
  const provider = new Provider(privateKey, 'https://rpc-mumbai.maticvigil.com/v1/8d9378fdfa5c3bb88018bb2e1e9d958578dc98a8');
  //test con la red xDai
  //const provider = new Provider(privateKey, 'https://sokol.poa.network');
  //mainnet Polygon
  //const provider = new Provider(privateKey, 'https://polygon-mainnet.infura.io/v3/908be0642b3f43148b3b16102c2f7222');
//test con avax
//const provider = new Provider(privateKey, 'https://api.avax-test.network/ext/bc/C/rpc');
//const provider = new Provider(privateKey, 'https://rpc-mumbai.matic.today');


  const web3 = new Web3(provider);
  const networkId = await web3.eth.net.getId()
  myContract = new web3.eth.Contract(
    voteContractBuild.abi,
    voteContractBuild.networks[networkId].address,

  );

  //console.log(myContract);
  addressContract = voteContractBuild.networks[networkId].address;
  isInit = true
}


const apiGasPolygon = async () => {
  // precio del gas en la red Polygon dependiendo de la demanda de la red
  //https://polygonscan.com/gastracker
  let url = 'https://gasstation-mainnet.matic.network/';
  try {
    const resp = await fetch(url)
    if (!resp.ok) throw 'no se puedo realizar la consulta';
    const { fast } = await resp.json();

    return fast;

  } catch (error) {
    throw error;
  }
}

export const vote = async ({ proposal, ci }) => {
  if (!isInit) await init()

  const resp = await apiGasPolygon();

  let feeStandard = 50000000000;

  return myContract
    .methods
    .vote(Number(proposal), Number(ci))
    .send({
      from: address, gasPrice: feeStandard,
      maxPriorityFeePerGas: feeStandard,
      maxFeePerGas: feeStandard
    })
    .then(vote => vote);

}

export const AddListas = async (proposals) => {
  if (!isInit) await init()

  const resp = await apiGasPolygon();
  //let feeStandard = resp * (Math.pow(10, 9));
  let feeStandard = 50000000000;


  return myContract
    .methods
    .AddListas(proposals)
    .send({
      from: address, gasPrice: feeStandard,
      maxPriorityFeePerGas: feeStandard,
      maxFeePerGas: feeStandard
    })
    .then(list => list);

}


export const getWinner = async () => {
  if (!isInit) await init()

  return myContract
    .methods
    .winnerName()
    .call()
}

export const getNameList = async () => {
  if (!isInit) await init()

  return myContract
    .methods
    .nameList()
    .call()
}

export const getStats = async () => {
  if (!isInit) await init()

  return myContract
    .methods
    .getStats()
    .call()
}

