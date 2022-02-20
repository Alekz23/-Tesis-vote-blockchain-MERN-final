import Web3 from 'web3';
import voteContractBuild from '../build/contracts/Hello.json';

let selectedAccount
let helloContract

let isInit = false

 const init = async () => {
  const providerUrl_default = 'http://localhost:7545' // Ganache-cli
  // const providerUrl_default = 'http://localhost:7545' // Ganache desktop
  const providerUrl = process.env.PROVIDER_URL || providerUrl_default

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

  helloContract = new web3.eth.Contract(
    voteContractBuild.abi,
    voteContractBuild.networks[networkId].address



  )
  console.log(helloContract)

  isInit = true
}

 const setMessage = async (message) => {
  if (!isInit) await init()

  return helloContract
    .methods
    .setMessage(String(message))
    .send({ from: selectedAccount })
    .then(sms => sms);
}


 const getMessage = async () => {
  if (!isInit) await init()

  return helloContract
    .methods
    .getMessage()
    .call()
}


// const vote = async ({ proposal, ci }) => {
//   if (!isInit) await init()

//   return helloContract
//     .methods
//     .vote(Number(proposal), Number(ci))
//     .send({ from: selectedAccount })
//     .then(vote => vote);
// }

// const getWinner = async () => {
//   if (!isInit) await init()

//   return helloContract
//     .methods
//     .winnerName()
//     .call()
// }

// const getStats = async () => {
//   if (!isInit) await init()

//   return helloContract
//     .methods
//     .getStats()
//     .call()
// }

