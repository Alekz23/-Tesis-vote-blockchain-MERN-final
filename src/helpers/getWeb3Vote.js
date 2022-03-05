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


let myContract

let isInit = false

 export let addressContract


export const init = async () => {
  //const provider = new Provider(privateKey, 'https://rinkeby.infura.io/v3/02e6ba60363b49b7922a4f9ad1a87b4c');
  //test con BSC
  const provider = new Provider(privateKey, 'https://data-seed-prebsc-1-s1.binance.org:8545');
  // test con Polygon
  //const provider = new Provider(privateKey, 'https://polygon-mumbai.infura.io/v3/908be0642b3f43148b3b16102c2f7222');
  const web3 = new Web3(provider);
  const networkId = await web3.eth.net.getId()
  myContract = new web3.eth.Contract(
    voteContractBuild.abi,
    voteContractBuild.networks[networkId].address
  );
 // the destination address
 addressContract =   voteContractBuild.networks[networkId].address;
  // console.log(await myContract.methods.data().call());
  // console.log(`Old data value: ${await myContract.methods.data().call()}`);
  // const receipt = await myContract.methods.setData(3).send({ from: address });
  // console.log(`Transaction hash: ${receipt.transactionHash}`);
  // console.log(`New data value: ${await myContract.methods.data().call()}`);

  isInit = true
}


export const vote = async ({ proposal, ci }) => {
  if (!isInit) await init()
  console.log('asi llegan los datos', proposal, ci)
  
  return myContract
    .methods
    .vote(Number(proposal), Number(ci))
    .send({ from: address })
    .then(vote => vote,
      );
    
    
}

export const AddListas = async (proposals) => {
  if (!isInit) await init()
  console.log(proposals, 'esto llega en arrays para ya agregar a blockchain')
  return myContract
    .methods
    .AddListas(proposals) // 
    //.AddListas(Array(proposals)) // 
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

