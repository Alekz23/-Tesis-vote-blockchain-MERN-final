import Web3 from 'web3';
import voteContractBuild from '../build/contracts/Vote.json';

let selectedAccount
let voteContract

let isInit = false

export const init = async () => {

try {
  let providerUrl_default = '' // Ganache-cli

if (window.ethereum) {
    let provider = window.ethereum;
     await window.ethereum.request({ method: "eth_requestAccounts" });
  }else {
    window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
  }


  // const providerUrl_default = 'http://localhost:7545' // Ganache desktop
  const providerUrl = window.web3.currentProvider
  // check for metamask
  let provider = window.ethereum
  if (typeof provider !== 'undefined') {
    provider
      .request({ method: 'eth_requestAccounts' })
      .then(accounts => {
        console.log('accounts: ', accounts)
        selectedAccount = accounts[0]
      })
      .catch(err => {
        console.log(err)
        return
      })
  }
  // at wallet change
  window
    .ethereum.on('accountsChanged', accounts => {
      console.log('accounts: ', accounts)
      selectedAccount = accounts[0]
    })

  const web3 = new Web3(providerUrl)
  const networkId = await web3.eth.net.getId()
  console.log(networkId)

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
} catch (error) {
      window.alert('Por favor agrega una cuenta a Metamask!')

}


}




export const vote = async ({ proposal, ci }) => {
  if (!isInit) await init()
  console.log('asi llegan los datos', proposal, ci)
  return voteContract
    .methods
    .vote(Number(proposal), Number(ci))
    .send({ from: selectedAccount })
    .then(vote => vote);
}

export const AddListas = async (proposals) => {
  if (!isInit) await init()
  console.log(proposals,'esto llega en arrays para ya agregar a blockchain')
  return voteContract
    .methods
    .AddListas(proposals) // 
    //.AddListas(Array(proposals)) // 
    .send({ from: selectedAccount })
    .then(vote => vote);

}


export const getWinner = async () => {
  if (!isInit) await init()

  return voteContract
    .methods
    .winnerName()
    .call()
}

export const getStats = async () => {
  if (!isInit) await init()

  return voteContract
    .methods
    .getStats()
    .call()
}


