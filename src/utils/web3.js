import Web3 from "web3";
import { toast } from "react-toastify";
import contractAbi from "./../utils/abis/token.json";
import { ENV } from "./../config/config";
import liveAuctionsAbi from "./abis/ARISwapToken.json";
import { liveAuction } from "./abiSetup.js";
import { placeBid } from "../components/bids/bids.action";
import { setFixedPriceNftTOken, acceptBit, placeBidApi } from "./functions";
import { changeOwnerShip } from "./functions";
import { ariSwapAbi, celoPunkAbi } from "./abis/abis";

let Contract = require("web3-eth-contract");

const nftContractAddress = ENV.nftContractAddress;
const ariSwapContractAddress = ENV.ariSwapContractAddress;
const celoPunkContractAddress = ENV.celoPunkContractAddress;
const celoWebSocketUrl = "wss://forno.celo.org/ws";
/* web3 instance */
const web3 = new Web3(celoWebSocketUrl);

let requiredChainId = parseInt(process.env.REACT_APP_REQUIRED_CHAIN);

//get web3
var web3Provider = null;
export const getWeb3 = async () => {
  // if(window.ethereum) {
  //     const web3 = new Web3(Web3.givenProvider);
  //     return web3;
  // }
  // else {
  //     return false;
  // }
  ////////////////////////////////
  if (window.ethereum) {
    web3Provider = window.ethereum;
    try {
      // Request account access
      await window.ethereum.enable();
    } catch (error) {
      // User denied account access...
      console.error("User denied account access");
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    web3Provider = window.web3.currentProvider;
  }
  // If no injected web3 instance is detected, fall back to Ganache
  else {
    web3Provider = new Web3.providers.HttpProvider("http://localhost:7545");
  }

  var web3 = new Web3(web3Provider);
  return web3;
  ///////////////////////////////
};

// TEMP. ADDING THIS METHOD - COPY OF CONNECTMETAMASK
export const connectMetamaskCopy = async () => {
  if (window.ethereum) {
    const web3 = new Web3(Web3.givenProvider);
    const network = await web3.eth.net.getNetworkType();
    await window.ethereum.enable();
    let accounts = await web3.eth.getAccounts();
    let chainId = await web3.eth.getChainId();
    if (chainId !== requiredChainId) {
      // toast.error(`Please switch to ${ENV.requiredChainName} testnet`);
    }
    return accounts[0];
  } else {
    // alert("Please install metamask to connect to the Marketplace");
    toast.error("Please install metamask to connect to the Marketplace");
  }
};

export const connectMetamask = async () => {
  if (window.ethereum) {
    const web3 = new Web3(Web3.givenProvider);
    window.web3 = new Web3(window.ethereum);
    const network = await web3.eth.net.getNetworkType();
    await window.ethereum.enable();
    let accounts = await web3.eth.getAccounts();
    let chainId = await web3.eth.getChainId();
    if (chainId !== requiredChainId) {
      // toast.error(`Please switch to ${ENV.requiredChainName} testnet`);
    }
    return accounts[0];
  } else {
    // alert("Please install metamask to connect to the Marketplace");
    toast.error("Please install metamask to connect to the Marketplace");
  }
};

export const signRequest = async () => {
  if (window.ethereum) {
    // const web3 = await getWeb3();
    // if (!web3) {
    //     toast.error("No web3 instance found");
    //     return false;
    // }

    const web3 = new Web3(Web3.givenProvider);
    let accounts = await web3.eth.getAccounts();
    let address = accounts[0];
    let signature = await handleSignMessage(address);
    // placeBid()
    // console.log(signature,"signature===>")
    return signature;
  } else {
    alert("Please install metamask to connect to the Marketplace");
  }
};
// export const testing=()=>{
//     const test=web3.eth.
// }

export const mint = async (metaData) => {
  // alert("dfdfdf")
  const web3 = await getWeb3();
  if (!web3) {
    toast.error("No web3 instance found");
    return false;
  }
  // let tokenContract1 = new Contract(liveAuctionsAbi., nftContractAddress);
  try {
    let connectedAddress = await connectMetamask();
    // console.log(connectedAddress,"connectedAddress")
    let tokenContract = new Contract(liveAuctionsAbi, nftContractAddress);
    // const txCount = await web3.eth.getTransactionCount(connectedAddress);
    const myNewData = await tokenContract.methods
      .createNewNFT(connectedAddress, metaData)
      .encodeABI();

    // console.log(myNewData,"checking create nft  result==>")
    // const gasLimit = await web3.eth.estimateGas({
    //     from: connectedAddress,
    //     nonce: txCount,
    //     to: nftContractAddress,
    //     data: myNewData,
    // });
    // const gas2 = await web3.eth.getGasPrice();
    // const transactionParameters = {
    //     nonce: web3.utils.toHex(txCount), // ignored by MetaMask
    //     gasPrice: web3.utils.toHex(gas2), // customizable by user during MetaMask confirmation.
    //     gasLimit: web3.utils.toHex(gasLimit), // customizable by user during MetaMask confirmation.
    //     to: nftContractAddress, // Required except during contract publications.
    //     from: connectedAddress, // must match user's active address.
    //     data: myNewData, // Optional, but used for defining smart contract creation and interaction.
    //     // chainId: '0x3', // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
    // };
    // // As with any RPC call, it may throw an error
    // const txHash = await window.ethereum.request({
    //     method: 'eth_sendTransaction',
    //     params: [transactionParameters],
    // });
    toast.success(`Success! NFT Created successfully!`);
    return true;
  } catch (e) {
    // alert("inCatch")
    let eMessage = e.message.split("{")[0] || "";
    // console.log(eMessage,"message==>")
    toast.error(eMessage);
    return false;
  }
};

const handleSignMessage = (address) => {
  return new Promise((resolve, reject) => {
    try {
      const web3 = new Web3(Web3.givenProvider);
      web3.eth.personal.sign(
        web3.utils.fromUtf8(
          `${ENV.appName} uses this cryptographic signature in place of a password, verifying that you are the owner of this address.`
        ),
        address,
        (err, signature) => {
          if (err) return reject(err);
          return resolve(signature);
        }
      );
    } catch (e) {
      console.log(e);
    }
  });
};

export const ClaimFundsAfterBidding = (token) => {
  // getting accounts
  return new Promise(async (resolve, reject) => {
    const web3 = new Web3(Web3.givenProvider);
    let accounts = await web3.eth.getAccounts();
    let address = accounts[0];
    liveAuction.methods
      .ClaimFundsAfterBidding(token)
      .send({
        from: address,
      })
      .then((x) => {
        return resolve(x);
      });
  }).catch((err) => {
    //  return reject(err);
    console.log("err in catch block error===> ", err);
  });
};

export const getCeloPunkMetaData = async (myAccount) => {
  const metaData = [];
  const celoPunkContract = new web3.eth.Contract(
    celoPunkAbi,
    celoPunkContractAddress
  );
  // const events = await celoPunkContract.getPastEvents("Transfer", {
  //   filter: {
  //     to: myAccount,
  //   },
  //   fromBlock: 0,
  //   toBlock: "latest",
  // });
  const tokenIds = await celoPunkContract.methods
    .walletOfOwner(myAccount)
    .call();
  for await (let tokenId of tokenIds) {
    const tokenUri = await celoPunkContract.methods.tokenURI(tokenId).call();
    const data = await (await fetch(tokenUri, { method: "get" })).json();
    metaData.push({
      tokenId,
      tokenUri,
      data,
    });
  }
  return metaData;
};

export const createNft = async (metaData, nftId) => {
  //getting accounts
  const web3 = new Web3(Web3.givenProvider);
  let accounts = await web3.eth.getAccounts();
  // console.log(accounts,"accounts")
  let address = accounts[0];
  // console.log(address,"addresss==>")
  console.log(metaData, "metaData==>");
  console.log(liveAuction, "liveAuction.==>");
  console.log(liveAuction.methods, "liveAuction.methods==>");
  //create NFT
  liveAuction.methods
    .createNewNFT(address, metaData)
    .send({
      value: 1000000000000000,
      // value:0,
      from: address,
      to: address,
    })
    .then((res) => {
      // console.log(res.events.Transfer.returnValues.tokenId,"res of createNFT===>")
      let data = {
        nftToken: res.events.Transfer.returnValues.tokenId,
        nftId,
      };

      setNftToken(data);

      toast.success("NFT created successfully");
      // window.location.href= '/explore-all'
    })
    .catch((err) => {
      console.log("err", err);
      if (err.code === 4001) {
        let url = process.env.REACT_APP_BASE_URL + `nfts/update`;
        var payload = {
          status: 0,
          _id: nftId,
        };
        fetch(url, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: ENV.Authorization,
            "x-auth-token": ENV.x_auth_token,
            "Access-Control-Allow-Origin": "*",
            "x-access-token":
              ENV.getUserKeys("accessToken") &&
              ENV.getUserKeys("accessToken").accessToken
                ? ENV.getUserKeys("accessToken").accessToken
                : "",
          },
          body: JSON.stringify(payload),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data, "data==>");
            if (data.success === false) {
              toast.error(err.message);
            }
          })
          .catch((error) => {
            // alert("in setting nft then")
            console.log(error, "error in catch blcok");
            if (error.response && error.response.data) {
              toast.error(err.message);
            } else {
              toast.error("Transaction Failed Please check wallet history");
            }
          });
      }
    });
  // return res
};

//openNFTForBidding
export const openNFTForBidding = async (token, timeduration) => {
  // console.log(token,timeduration,"checking token and time duration")
  //openNFTForBidding
  let tokenId = +token;
  const web3 = new Web3(Web3.givenProvider);

  let accounts = await web3.eth.getAccounts();
  //  console.log(accounts,"accounts")
  let address = accounts[0];
  //  console.log(address,"addresss==>")
  liveAuction.methods
    .openNFTForBiddingForSpecific(tokenId, timeduration)
    .send({ from: address })
    .then((res) => {
      //  console.log(res ,"res of openNFTForBidding===>")
    })
    .catch((err) => {
      toast.error("Transaction Failed Please check wallet history");
    });
};

export const setNftToken = (body) => {
  // console.log(body,"body===>")
  // let dummy={
  //     nftToken:"123",
  //     nftId:"123"

  // }

  let url = process.env.REACT_APP_BASE_URL + `nftTokens/addToken`;

  fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: ENV.Authorization,
      "x-auth-token": ENV.x_auth_token,
      "Access-Control-Allow-Origin": "*",
      "x-access-token":
        ENV.getUserKeys("accessToken") &&
        ENV.getUserKeys("accessToken").accessToken
          ? ENV.getUserKeys("accessToken").accessToken
          : "",
    },
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((data) => {
      // alert("in setting nft then")
      // console.log(data,"data==>")
      if (data.success) {
        window.location.href = "/explore-all";
        //    console.log(data,"data in success")
      } else {
      }
    })
    .catch((error) => {
      // alert("in setting nft then")
      console.log(error, "error in catch blcok");
      if (error.response && error.response.data) {
      }
    });
};

export const NftOwner = async () => {
  const web3 = new Web3(Web3.givenProvider);

  let accounts = await web3.eth.getAccounts();
  // console.log(accounts,"accounts")
  let address = accounts[0];
  //     console.log(address,"addresss==>")
  // //OwnerNFT
  liveAuction.methods
    .ownerOf(5)
    .send({ from: address })
    .then((res) => {
      //  console.log(res,"res of createNFT===>")
    })
    .catch((err) => {
      console.log(err, "err in catch block error===>");
    });
};

export const placeBidNft = async (
  body,
  tokenId,
  price,
  toAddress,
  fromAddress
) => {
  const web3 = new Web3(Web3.givenProvider);

  let accounts = await web3.eth.getAccounts();
  // console.log(accounts,"accounts")
  let address = accounts[0];
  // console.log(address,"addresss==>")
  // console.log(price,"price888888888888888888888")
  // console.log(toAddress,"toAdress")

  liveAuction.methods
    .placeBid(tokenId)
    .send({ value: price.amount, from: address })
    .then((res) => {
      console.log("bid before", res);
      console.log("body", body);
      placeBidApi(body, tokenId, price, toAddress, fromAddress);
      // window.location.href= '/explore-all'
      //  console.log(res,"res of place bid result===>")
    })
    // alert(price)
    .catch((err) => {
      toast.error("Transaction Failed Please check wallet history");
    });
};

export const SellOnFixedPrice = async (tokenId, price) => {
  const web3 = new Web3(Web3.givenProvider);

  let accounts = await web3.eth.getAccounts();
  // console.log(accounts,"accounts")
  let address = accounts[0];
  //   Put on sale
  // console.log('live auction', liveAuction)
  liveAuction.methods
    .PutOnSale(tokenId)
    .send({ from: address })
    .then((res) => {
      // setFixedPriceNftTOken()
    })

    .catch((err) => {
      toast.error("Transaction Failed Please check wallet history");
    });
};

export const BuyFixedPriceNFTs = async (price, tokenId, nftOwnerId) => {
  // console.log(tokenId,"token id in buy fixed price==>")
  const web3 = new Web3(Web3.givenProvider);

  let accounts = await web3.eth.getAccounts();
  // console.log(accounts,"accounts")
  let address = accounts[0];
  // console.log(address,"addresss==>")
  // console.log(price,"price888888888888888888888")
  // alert(price)
  let finalPrice = price.toString();
  // console.log('final price', finalPrice)

  liveAuction.methods
    .BuyFixedPriceNFTs(tokenId)
    .send({ value: finalPrice, from: address })
    .then((res) => {
      // console.log(res,"res of place bid result===>")
      let currentUserId = ENV.getUserKeys("_id")._id;
      changeOwnerShip(nftOwnerId, currentUserId);
    })
    //   Place Bid

    .catch((err) => {
      toast.error("Transaction Failed Please check wallet history");
    });
};

export const getCurrentAddress = async () => {
  const web3 = new Web3(Web3.givenProvider);

  let accounts = await web3.eth.getAccounts();
  let address = accounts[0];
  return address;
};

export const acceptNftOffer = async (tokenId, body) => {
  const web3 = new Web3(Web3.givenProvider);

  let accounts = await web3.eth.getAccounts();
  // console.log(accounts,"accounts")
  let address = accounts[0];
  // console.log(address,"addresss==>")
  // console.log('token before sending', tokenId)
  //  Accept offer
  liveAuction.methods
    .acceptOffer(tokenId)
    .send({ from: address })
    .then((res) => {
      // console.log(res,"res of accept bid result===>")
      // toast.success("Bid accepted successfully")
      acceptBit(tokenId, body);
    })
    .catch((err) => {
      console.log(err, "err in catch block error===>");
    });
};
export const signTransaction = async () => {
  const web3 = new Web3(Web3.givenProvider);
  // const nonce = await web3.eth.getTransactionCount("myAddress", 'latest');
  const rawTransaction = {
    from: "Keystore account id",
    to: "Account you want to transfer to",
    value: 100,
    gas: 0.21,
  };

  const signedTx = await web3.eth.accounts.signTransaction(
    rawTransaction,
    "PRIVATE_KEY"
  );

  web3.eth.sendSignedTransaction(
    signedTx.rawTransaction,
    function (error, hash) {
      if (!error) {
        //   console.log("🎉 The hash of your transaction is: ", hash, "\n Check Alchemy's Mempool to view the status of your transaction!");
      } else {
        //   console.log("❗Something went wrong while submitting your transaction:", error)
      }
    }
  );
};
