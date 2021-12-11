import Web3 from 'web3';
import liveAuctionsAbi from './abis/ARISwapToken.json'
import {ENV} from './../config/config';
// const web3 = new Web3(
//   new Web3.providers.HttpProvider('https://data-seed-prebsc-1-s1.binance.org:8545')
// );

let web3Provider = window.ethereum;
var web3 = new Web3(web3Provider);
 web3 = new Web3(Web3.givenProvider);
//it's the abi

let liveAuction=null;
try{

     liveAuction = new web3.eth.Contract(liveAuctionsAbi,'0x745f233f80F7ddA3073755e50Fa32F4B8A6A1574');
}
catch(err){
// console.log(err,"error in abiSetup")
}

export { liveAuction };
