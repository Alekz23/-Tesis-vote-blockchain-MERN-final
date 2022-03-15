import Web3 from 'web3';
import voteContractBuild from '../build/contracts/Vote.json';
const Provider = require('@truffle/hdwallet-provider');

//const address = '0xc01dda89e6151D19005c29DeEf364618273Ec148';
//test BSC---------
const address = '0xc01dda89e6151D19005c29DeEf364618273Ec148';


//const privateKey = '62e93d412b219ecb9afd757e99070d6d7bc2bd02de6a77c6450082e46c487c08';
//test con la cuenta de BSC
const privateKey = '62e93d412b219ecb9afd757e99070d6d7bc2bd02de6a77c6450082e46c487c08';
//const infuraUrl = 'https://rinkeby.infura.io/v3/02e6ba60363b49b7922a4f9ad1a87b4c';
// let gasPrice
// let gasLimit 
// let maxPriorityFeePerGas
// let  maxFeePerGas
//  let  baseFee
let myContract

let isInit = false

 export let addressContract
 //let nonces


export const init = async () => {
  //const provider = new Provider(privateKey, 'https://rinkeby.infura.io/v3/02e6ba60363b49b7922a4f9ad1a87b4c');
  //test con BSC
  //const provider = new Provider(privateKey, 'https://data-seed-prebsc-1-s1.binance.org:8545');
  // test con Polygon
  const provider = new Provider(privateKey, 'https://rpc-mumbai.maticvigil.com/v1/8d9378fdfa5c3bb88018bb2e1e9d958578dc98a8');
  const web3 = new Web3(provider);
  const networkId = await web3.eth.net.getId()
  myContract = new web3.eth.Contract(
    voteContractBuild.abi,
    voteContractBuild.networks[networkId].address,
   
  );
  console.log(myContract);
 // the destination address
//  gasPrice= web3.utils.toHex(web3.utils.toWei("30", "gwei"))
//  maxPriorityFeePerGas=  web3.utils.toHex(web3.utils.toWei("30", "gwei"))
//  maxFeePerGas= web3.utils.toHex(web3.utils.toWei("30", "gwei"));
//  baseFee= web3.utils.toHex(web3.utils.toWei("30", "gwei"));
//  gasLimit= web3.utils.toHex(500000)
 addressContract =   voteContractBuild.networks[networkId].address;

 //nonces = web3.eth.getTransactionCount(address);


  isInit = true
}


export const vote = async ({ proposal, ci }) => {
  if (!isInit) await init()




  //console.log('asi llegan los datos', txData)
  //gas: 9500000 , gasPrice: 20000000000

   //console.log('que llega ', gasPrice, gasLimit);
    //.send({ from: address, gasPrice})
    // .send({ from: address, maxPriorityFeePerGas, gasLimit, gasPrice,  maxFeePerGas,  baseFee})
  return myContract
    .methods
    .vote(Number(proposal), Number(ci))
    .send({ from: address})
    .then(vote => vote,
      );
    
    
}

export const AddListas = async (proposals) => {
  if (!isInit) await init()
  console.log(proposals, 'esto llega en arrays para ya agregar a blockchain')
  return myContract
    .methods
    .AddListas(proposals) // 
    .send({ from: address})
    .then(vote => vote);

}


export const getWinner = async () => {
  if (!isInit) await init()

  return myContract
    .methods
    .winnerName()
    .call()
}

export const getStats = async () => {
  if (!isInit) await init()

  return myContract
    .methods
    .getStats()
    .call()
}

