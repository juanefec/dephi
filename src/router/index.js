import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'


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
  window.dephi = result
  return result
}




Vue.use(VueRouter)

Vue.prototype.$dephi = loadWeb3AndIPFS

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  return Router
}
