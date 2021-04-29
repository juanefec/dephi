
import Web3 from 'web3';
import Flask from '../abis/Flask.json'



async function loadWeb3AndIPFS() {
  
 
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum)
    await window.ethereum.enable()
  }
  else if (window.web3) {
    window.web3 = new Web3(window.web3.currentProvider)
  }
  else {
    window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
  }
  let accounts = await web3.eth.getAccounts()
  const networkId = await web3.eth.net.getId()
  
  let ipfs = require('ipfs-http-client')({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

  let result = {
    web3: window.web3,
    ipfs: ipfs,
    flask: new web3.eth.Contract(Flask.abi, Flask.networks[networkId].address),
    address: accounts[0],
    displayAddress: accounts[0].substr(0, 6)+'...'+accounts[0].substr(-4),
    metamaskUpdater: (accs) => {
      this.address = accs[0],
      this.displayAddress = accs[0].substr(0, 6)+'...'+accs[0].substr(-4)
    }
  }

  return result
}



export default loadWeb3AndIPFS()