import Swal from 'sweetalert2';
import Web3 from 'web3';
import voteContractBuild from '../build/contracts/Vote.json';
const Provider = require('@truffle/hdwallet-provider');

const Tx = require('ethereumjs-tx').Transaction
const address = '0xc01dda89e6151D19005c29DeEf364618273Ec148';
const privateKey = '62e93d412b219ecb9afd757e99070d6d7bc2bd02de6a77c6450082e46c487c08';
const infuraUrl = 'https://rinkeby.infura.io/v3/02e6ba60363b49b7922a4f9ad1a87b4c';

let selectedAccount
let voteContract

let myContract

let isInit = false

export const init2 = async () => {
  const providerUrl_default = 'https://rinkeby.infura.io/v3/02e6ba60363b49b7922a4f9ad1a87b4c' // Ganache-cli
  // const providerUrl_default = 'http://localhost:7545' // Ganache desktop
  const providerUrl = process.env.PROVIDER_URL || providerUrl_default

  // check for metamask
  let provider = window.ethereum
  if (typeof provider !== 'undefined') {
    provider
      .request({ method: 'eth_requestAccounts' })
      .then(accounts => {
        console.log('accounts: ', accounts)
        selectedAccount = "0xc01dda89e6151D19005c29DeEf364618273Ec148";
        console.log('cuenta selec', accounts[0]);
      })
      .catch(err => {
        console.log(err)
        return
      })
  }
  // at wallet change
  // window
  //   .ethereum.on('accountsChanged', accounts => {
  //     console.log('accounts: ', accounts)
  //     selectedAccount = 0xc01dda89e6151D19005c29DeEf364618273Ec148;
  //   })

  const web3 = new Web3(providerUrl)
  //const networkId = await web3.eth.net.getId()
  const networkId = '4'

  console.log(networkId)

  selectedAccount = "0xc01dda89e6151D19005c29DeEf364618273Ec148";

  /// testeando -------

  const addressFrom = '0xc01dda89e6151D19005c29DeEf364618273Ec148';
  const privateKey = new Buffer('62e93d412b219ecb9afd757e99070d6d7bc2bd02de6a77c6450082e46c487c08', 'hex');

  // the destination address
  //const addressTo =   voteContractBuild.networks[networkId].address;

  const addressTo = "0xd971d334911e4e8fdbf69c629f32882e35a55ca6";





  //  web3.eth.getTransactionCount(addressFrom).then(txCount => {
  //         const txData = {
  //           nonce: web3.utils.toHex(txCount),
  //           gasLimit: web3.utils.toHex(900000),
  //           gasPrice: gasPrice, // 10-15 gwei should be ok
  //           to: addressTo,
  //           from: addressFrom
  //           // value: web3.utils.toHex(
  //           //   web3.utils.toWei("0.0001", "ether")  // amount you want to send
  //           // )
  //         };

  //       }



  //const transaction = new Tx(txData, { chain: "rinkeby" }); //transaction = new Tx(txData, {'chain':'mainnet'});
  //transaction.sign(privateKey);  // remove .substring(2) if you get errors

  //   web3.eth
  //     .sendSignedTransaction("0x" + transaction.serialize().toString("hex"))
  //     .on("transactionHash", function(txHash) {
  //       // show tx hash ?
  //     })
  //     .on("receipt", function(receipt) {
  //       console.log("receipt:" + receipt);
  //     })
  //     .on("confirmation", function(confirmationNumber, receipt) {
  //       if (confirmationNumber >= 1) {
  //         // message that tx went ok
  //       }
  //     })
  //     .on("error", function(error) {
  //       console.log("error sending ETH", error);
  //     });
  // });
  // voteContract = new web3.eth.Contract(
  //   voteContractBuild.abi,
  //   voteContractBuild.networks[networkId].address
  //test 1
  // const networkData = voteContractBuild.networks[networkId]
  // if (networkData) {
  //   //const election = new web3.eth.Contract(voteContractBuild.abi, networkData.address)
  //   //this.setState({ election })
  //   voteContract = new web3.eth.Contract(voteContractBuild.abi, voteContractBuild.networks[networkId].address)
  //   console.log(voteContract)


  // } else {
  //   window.alert('Election contract not deployed to detected network.')
  // }

  // fin test 1

  voteContract = new web3.eth.Contract(voteContractBuild.abi, voteContractBuild.networks[networkId].address)
  console.log(voteContract)
  isInit = true
}


export const init = async () => {
  const provider = new Provider(privateKey, 'https://rinkeby.infura.io/v3/02e6ba60363b49b7922a4f9ad1a87b4c'); 
  const web3 = new Web3(provider);
  const networkId = await web3.eth.net.getId();
  myContract = new web3.eth.Contract(
    voteContractBuild.abi,
    voteContractBuild.networks[networkId].address
  );

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

