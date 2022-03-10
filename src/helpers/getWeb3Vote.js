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
 //let nonces


export const init = async () => {
  //const provider = new Provider(privateKey, 'https://rinkeby.infura.io/v3/02e6ba60363b49b7922a4f9ad1a87b4c');
  //test con BSC
  const provider = new Provider(privateKey, 'https://data-seed-prebsc-1-s1.binance.org:8545');
  // test con Polygon
  //const provider = new Provider(privateKey, 'https://rpc-mumbai.maticvigil.com/v1/8d9378fdfa5c3bb88018bb2e1e9d958578dc98a8');
  const web3 = new Web3(provider);
  const networkId = await web3.eth.net.getId()
  myContract = new web3.eth.Contract(
    voteContractBuild.abi,
    voteContractBuild.networks[networkId].address,
   
  );
  console.log(myContract);
 // the destination address
 addressContract =   voteContractBuild.networks[networkId].address;

 //nonces = web3.eth.getTransactionCount(address);
  // console.log(await myContract.methods.data().call());
  // console.log(`Old data value: ${await myContract.methods.data().call()}`);
  // const receipt = await myContract.methods.setData(3).send({ from: address });
  // console.log(`Transaction hash: ${receipt.transactionHash}`);
  // console.log(`New data value: ${await myContract.methods.data().call()}`);

  isInit = true
}


export const vote = async ({ proposal, ci }) => {
  if (!isInit) await init()

  // const tx = myContract.methods.vote(Number(proposal), Number(ci));
  // const gas = 8500000;
  // const gasPrice = 10000000000;
  // const data = tx.encodeABI();
  // const nonce = nonces
  // const txData = {
  //   from: address,
  //   to: myContract.options.address,
  //   data: data,
  //   gas,
  //   gasPrice,
  //   nonce, 
  //   chainId: '80001', 
  //   hardfork: 'istanbul'
  // };


  //console.log('asi llegan los datos', txData)
  //gas: 9500000 , gasPrice: 20000000000
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

