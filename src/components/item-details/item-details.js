import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { beforeNFT, getNFT } from '../nfts/nfts.action';
import FullPageLoader from '../full-page-loader/full-page-loader'
import { ENV } from '../../config/config';
import moment from 'moment';
import Countdown from 'react-countdown';
import SimpleReactValidator from 'simple-react-validator'
import { decimalNumberValidator } from "../../utils/functions";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { beforeOffer, makeOffer, getOffers, deleteOffer, acceptOffer } from '../offers/offers.action'
import { beforeBid, placeBid, getBids, deleteBid, acceptBid } from '../bids/bids.action'
import {getCreators, beforeUser} from './../user/user.action';
import {getCurrentAddress,BuyFixedPriceNFTs,placeBidNft,acceptNftOffer} from '../../utils/web3';
import { toast } from 'react-toastify'
const { globalPlaceholderImage, countDownRenderer, currencies, objectToQueryString } = ENV

const initData = {
    itemImg: "/img/auction_2.jpg",
    date: "2022-03-30",
    price_2: "$500.89",
    bidBtn: "Place a Bid",
    offerBtn: "Buy Now",
    sellBtn: "Sell"
}

// expiry options

const expiryOptions = [
    { label: '5 Days', value: moment().add(5, "days").format('DD/MM/YYYY') },
    { label: '7 Days', value: moment().add(7, "days").format('DD/MM/YYYY') },
    { label: 'A Month', value: moment().add(1, "months").format('DD/MM/YYYY') },
    { label: 'Custom Date', value: -1 },
]

// make an offer / bid config.

const config1 = {
    price: {
        currency: ENV.currency,
        amount: "",
    },
    expiry: {
        date: expiryOptions[0].value,
        time: moment(new Date()).format("HH:mm"),
        type: 1, // 1 for time & 2 for datetime-local
        datetime: '' // for payload 
    }
};
let nft1=[]
class ItemDetails extends Component {
    isTimeoutAction = false;
    constructor(props) {
        super(props)
        this.state = {
            userId: ENV.getUserKeys()?._id,
            offers: null,
            offersPagination: null,

            bids: null,
            bidsPagination: null,
            highestBidAmtt:null,
            errors: '',
            isSubmitted: false,
            formValid: true,
            loader: true,
            nft: null,
            nftAll:null,
            isOpen: false,
            creator:[],
            nftConfig: config1 ,// make an offer / bid config.
            nftsData:[],
            bidsData:[],
            creators:[],
            myAddress:''
        }
        this.validator = new SimpleReactValidator({
            autoForceUpdate: this,
            messages: {
                required: 'This field is required.'  // will override all messages
            },
        });

    }

    componentDidMount= async()=> {
        window.scroll(0, 0)
        let myAddress=await getCurrentAddress()
     
        this.setState({
            myAddress
        })
        const query = new URLSearchParams(window.location.search)
        this.getTokens()
       
        if (query.get('item')) {
        
            const nftId = window.atob(query.get('item'))
            // console.log(nftId,"nftId====>");
            if (nftId) {
                this.props.getNFT(nftId);
                this.getBids(nftId)

                const bidQS = ENV.objectToQueryString({ nftId })
                this.props.getBids(bidQS);

                const offerQS = ENV.objectToQueryString({ nftId })
                this.props.getOffers(offerQS);
                this.props.getCreators();
            }
        } else
            this.props.history.push('/explore-all')
    }

    filterCreator=(nft)=>{
     
        // let nftId=this.state.nft.collection.userId
    }
    filterCreatorsInfo=(id,item)=>{
      
      let user= this.props.user?.creators?.find((item)=>item._id===id )
      if(user){
          if(item=="username"){
             return user.username
          }
          if(item=="profilePhoto"){
              return user?.profileImage
          }
          if(item=="id"){
            return user._id
          }
      }
    }

    componentDidUpdate() {
        // if (this.props.error)
        //     this.setState({ loader: false })

        if (this.props.nft.nftsAuth) {
           
            const nft = this.props.nft.nftsData
            const allData=this.props.nft.nftAll
           
            //nft
            nft1=nft
            this.getBids(nft?._id)
            this.setState({
                
                nft,
            nftAll:allData
                
            }, () => {
                this.props.beforeNFT()
            })
            this.filterCreator(nft)
            const date1 = moment();
            const date2 = moment(this.props?.nft?.nftAll?.sellingConfig?.duration?.endDate);
           
            // this.isTimeoutAction =  date2.diff(date1) > 0 ? false : true;
            let result =  date2.diff(date1) > 0 ? false : true;
            this.setState({
                isTimeoutAction:result
            })
            // console.log(result,"checking result")
        }

        if (this.props.offer.createAuth) {
            this.setState({
                // loader: false,
                isOpen: false
            }, () => {
                this.props.beforeOffer()

                const { nft } = this.state
                const qs = ENV.objectToQueryString({ nftId: nft._id })
                this.props.getOffers(qs)
            })
        }

        if (this.props.offer.getAuth) {
            const { offers, pagination } = this.props.offer
            this.setState({ loader: false, offers, offersPagination: pagination }, () => {
                this.props.beforeOffer()
            })
        }

        if (this.props.offer.deleteAuth) {
            this.props.beforeOffer()

            const { nft } = this.state
            const qs = ENV.objectToQueryString({ nftId: nft._id })
            this.props.getOffers(qs)
        }

        if (this.props.bid.createAuth) {
            this.setState({
                // loader: false,
                isOpen: false
            }, () => {
                this.props.beforeBid()

                const { nft } = this.state
                const qs = ENV.objectToQueryString({ nftId: nft._id })
                this.props.getBids(qs)
            })
        }

        if (this.props.bid.getAuth) {
         
            const { bids, pagination, highestBidAmt } = this.props.bid
        
            let nft = { ...this.state.nft }

            nft.highestBidAmt = highestBidAmt
           
            this.setState({ loader: false, bids, bidsPagination: pagination, nft }, () => {
                this.props.beforeBid()
            })
        }

        if (this.props.bid.deleteAuth) {
            this.props.beforeBid()

            const { nft } = this.state
            const qs = ENV.objectToQueryString({ nftId: nft._id })
            this.props.getBids(qs)
        }

        if (this.props.offer.acceptAuth) {
            this.setState({ loader: false }, () => {
                this.props.beforeOffer()
                const { nft } = this.state
                this.props.history.push(`collection-details/${window.btoa(nft.collection._id)}`)
            })
        }

        if (this.props.bid.acceptAuth) {
            this.setState({ loader: false }, () => {
                this.props.beforeBid()
                const { nft } = this.state
                this.props.history.push(`collection-details/${window.btoa(nft.collection._id)}`)
            })
        }
        //    console.log(this.props.user.topSellersAuth,"kjkjkjlkjlkjkljlkjk");

        if(this.props.user.topSellersAuth && !this.state.creator?.length>0 ){
            this.filterCreator(this.props.user.sellers)
            this.setState({
                creator:this.props.user.sellers,
                creators:this.props.user.creators
            })
            // console.log(this.props.user.sellers,"creators===}}}}}}}}}}}}}}}}}}}}}");
            // console.log(this.state.nft,"nft below the creator===>")
        }
        

    }
   
    getBids=(nftId)=>{
        const BASE_URL= process.env.REACT_APP_BASE_URL 
        fetch(BASE_URL + "/bid/list", {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'Authorization': ENV.Authorization,
                'x-auth-token': ENV.x_auth_token,
                'Access-Control-Allow-Origin': '*',
                'x-access-token': ENV.getUserKeys('accessToken') && ENV.getUserKeys('accessToken').accessToken ? ENV.getUserKeys('accessToken').accessToken : ''
            }
        }).then(res => res.json()).then(data => {
       
            let bids=data.data.allBids?.filter((item)=>item.nftId===nftId)          
           
            // const highestBidAmt = bids.length
            var last_element = bids[bids?.length - 1];
       
            this.setState({
                bidsData:bids,
                highestBidAmtt: last_element?.price.amount

            })
            setTimeout(()=>{
               this.setState({
                   loader:false,
               })
            },2000)
         
        }).catch(error => {
        console.log(error,"error while getting bids")
           
        })
    }
    openModal = () => {
  
        if(this.props?.nft?.nftAll.sellingMethod==1)
        {
            // console.log("inside if")
            var res= this.state.nftsData.data.find((item)=>item.nftId===this.state.nft._id)
            // console.log(res,"response")               
             // BuyFixedPriceNFTs(nftAll.ownerAddress,nftAll.currentPrice)
             this.setState({
                loader:true
            })

            setTimeout(() => {
               this.setState({
                   loader:false
               })

            }, 8000);
          
             BuyFixedPriceNFTs(this.props?.nft?.nftAll.currentPrice,res.nftToken,this.props.nft.nftAll._id)
            
        }
        else {
            // console.log("inside else")
            this.setState({ isOpen: true, nftConfig: config1, errors: '' });  
        }
      
        // this.setState({ isOpen: true, nftConfig: config1, errors: '' });  
    }

    closeModal = () => this.setState({ isOpen: false });

    onChange = (e) => {
        const { nftConfig } = this.state;
        const { name, value } = e.target;
        let data = nftConfig;

        const keys = name.split("."); // nftConfig, price, currency
        if (keys && keys[2])
            data[keys[1]][keys[2]] = value;
        else if (keys && keys[1])
            data[keys[1]] = value;

        if (keys && keys[1] === 'price' && keys[2] === 'amount')
            data[keys[1]]['amount'] = Number(value)

        if (keys && keys[1] === 'expiry' && keys[2] === 'date')
            data[keys[1]]['type'] = Number(value) === -1 ? 2 : 1

        // set datetime for days / months 
        if (data.expiry.type === 1)
            data.expiry.datetime = moment(data.expiry.date + ' ' + data.expiry.time, 'DD/MM/YYYY HH:mm')
        // set datetime for custom date
        else if (data.expiry.type === 2) {
            data.expiry.datetime = moment(data.expiry.time, 'DD/MM/YYYY HH:mm')
            data.expiry.date = moment(data.expiry.time, 'DD/MM/YYYY')
        }

        this.setState({
            nftConfig: {
                ...data
            }
        })
    };

    // submit when a bid is placed or when an offer is made
    submit = () => {
    //   console.log(this.state.myAddress,"myaddress")

        this.setState({ isSubmitted: true, formValid: this.validator.allValid() }, () => {
            const { formValid } = this.state
            if (formValid) {
                this.setState({
                    loader: false               //need to convert true
                }, () => {
                    const { nft, nftConfig,nftAll } = this.state
           
                    // console.log(nftAll,"checking nft==>")
                    const payload = {
                        // ownerId: nft.owner._id,
                        expiryDate: nftConfig.expiry.datetime,
                        price: nftConfig.price,
                        nftId: nft._id,
                        bidBy:ENV.getUserKeys('_id'),
                        user:ENV.getUserKeys('_id'),
                        offerById:ENV.getUserKeys('_id'),
                        toAddress:nftAll.ownerAddress,
                        fromAddress:this.state.myAddress,

                    }
                    // console.log(payload,"toaddress8888888")
           
                    let foundResult=this.state.nftsData.data.find((item)=>item.nftId===nft._id)
                    // console.log('check here selling method',nft.sellingMethod )
                    // if selling method is 2 then go for bid
                    if (nft.sellingMethod === 2) { // place a bid 
                        placeBidNft(payload,foundResult.nftToken,payload.price,nft.ownerAddress,this.state.myAddress)
                        // this.props.placeBid(payload,foundResult.nftToken,payload.price,nft.ownerAddress,this.state.myAddress)
                        this.setState({
                            loader:true
                        })

                        setTimeout(() => {
                            this.setState({
                                loader:false
                            })
                          
                        }, 5000);
                    } else if (nft.sellingMethod === 1) { // make an offer 
                       let res= this.state.nftsData.find((item)=>item.nftId===nft._id)
                    //    console.log(res,"response")
                             
                        // BuyFixedPriceNFTs(nftAll.ownerAddress,nftAll.currentPrice)
                        // BuyFixedPriceNFTs(payload.price,res.nftToken)
                        // console.log(nftAll,"nftAll==>")
                        BuyFixedPriceNFTs(payload.price,res.nftToken,nftAll.ownerAddress)
                        // this.props.makeOffer(payload,foundResult,payload.price)
                    }
                    else{
                        // console.log(nftAll,"nftAll==>")
                        // console.log('single nft before fix price function', nft)
                        let res= this.state.nftsData.data.find((item)=>item.nftId===nft._id)
                        // console.log(res,"response")
                              
                         // BuyFixedPriceNFTs(nftAll.ownerAddress,nftAll.currentPrice)
                         BuyFixedPriceNFTs(payload.price,res.nftToken,nftAll.ownerAddress)
                    }
                })

            }

            else {
                alert("in else")
                this.validator.showMessages()
                this.validator.purgeFields()
                this.setState({
                    errors: 'Please fill all required fields in valid format.',
                    formValid: false
                }, () => {
                    window.scroll(0, 0)
                })
            }
            
        })
    }

    deleteOffer = (offerId) => {
        this.setState({
            loader: true
        }, () => {
            this.props.deleteOffer(offerId)
        })
    }

    deleteBid = (bidId) => {
        this.setState({
            loader: true
        }, () => {
            this.props.deleteBid(bidId)
        })
    }

    acceptOffer = (offerId) => {
        this.setState({
            loader: true
        }, () => {
            this.props.acceptBid({ offerId })
        })

    }

    acceptBid = (bidId) => {
        this.setState({
            loader: true
        }, () => {
            const { nft, nftConfig,nftAll } = this.state
        
            let foundResult=this.state.nftsData.data.find((item)=>item.nftId===nft._id)
  
            const payload = {
                bidId:bidId,
                nftId: nft._id,
                bidBy:ENV.getUserKeys('_id'),
                user:ENV.getUserKeys('_id'),
                toAddress:nftAll.ownerAddress,
                fromAddress:this.state.myAddress,
            }
            this.setState({
                loader:true
            })

            setTimeout(() => {
                this.setState({
                    loader:false
                })
              
            }, 7000);
            acceptNftOffer(foundResult.nftToken,payload)
            // this.props.acceptBid(payload,foundResult.nftToken)
             
        })
       
    }
    creatorUserName=()=>{
        // console.log(this.state.creator,"creator listing");/
        // console.log(this.props.nftAll,"this.props.nftAll?");

       let result= this.state.creator.find((item)=>item._id===this.state?.nftAll?.userId)
    //    console.log(result,"result in the userName function===>");
       if(result?.username)
       {

           return result.username
       }
       else {
           return "no username"
       }
    }
     getTokens=()=>{

        let url = process.env.REACT_APP_BASE_URL + `nftTokens/tokens`;
      
        fetch(url, {
         method: 'GET',
         headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'Access-Control-Allow-Origin': '*',
            'x-access-token': ENV.getUserKeys('accessToken') && ENV.getUserKeys('accessToken').accessToken ? ENV.getUserKeys('accessToken').accessToken : ''
        },
      
      }).then(res => res.json()).then(data => {
 
        //   console.log(data,"data==>22222222222222222222222222222222222222")
      
     this.setState({
        nftsData:data
     })
      
      }).catch(error => {
        
        console.log(error,"error in catch blcok")
        
      })
    }
    // filterCreatorsInfo=(id,item)=>{
    //     // console.log(this.state.creators,"creator in the filterCreatorsFunction")
    //   let user= this.state?.creators?.data?.find((item)=>item._id===id )
    //   if(user){

    //       if(item=="username"){
    //          return user.username
    //       }
    //       if(item=="profilePhoto"){
    //           return user?.profileImage
    //       }
    //       if(item=="id"){
    //         return user._id
    //       }
    //   }
      
    // }

    render() {
        const { loader, nft, nftConfig, isSubmitted, errors, userId, bids, offers } = this.state
        if(!ENV.getUserKeys('_id')._id){
            toast.error("Pleas login to continue")
            this.props.history.push('/')
               return " "
           }
           else {
        return (
            <>
                <section className="item-details-area padding-wrapper pb-0">
                    {
                        loader ?
                            <FullPageLoader /> :
                            <>
                                {
                                    nft && 
                                    <div className="container">
                                        <div className="row justify-content-between">
                                            <div className="col-12 col-lg-5">
                                                <div className="item-info">
                                                    <div className="item-thumb text-center">
                                                        <img src={nft.image} alt="NFT Image" />
                                                    </div>
                                                    {
                                                        nft.auctionEndDate &&
                                                        <div className="card no-hover countdown-times mt-4">
                                                            <Countdown
                                                                date={new Date(nft.auctionEndDate) + 10000}
                                                                renderer={countDownRenderer}
                                                            />
                                                        </div>
                                                    }
                                                    {/* Tabs */}
                                                    <ul className="netstorm-tab nav nav-tabs mt-4" id="nav-tab">
                                                        <li>
                                                            <a className="active" id="bids-tab" data-toggle="pill" href="#bids">
                                                                <h5 className="m-0">Bids</h5>
                                                            </a>
                                                        </li>
                                                        {/* <li>
                                                            <a id="offers-tab" data-toggle="pill" href="#offers">
                                                                <h5 className="m-0">Offers</h5>
                                                            </a>
                                                        </li> */}
                                                        <li>
                                                            <a id="details-tab" data-toggle="pill" href="#details">
                                                                <h5 className="m-0">Details</h5>
                                                            </a>
                                                        </li>
                                                    </ul>
                                                    
                                                    {/* Tab Content */}
                                                    <div className="tab-content" id="nav-tabContent">
                                                        <div className="tab-pane fade show active" id="bids">
                                                            <ul className="list-unstyled">
                                                                {this.state.bidsData &&  this.props.user?.creators?.length > 0  ? 
                                                                
                                                                    this.state.bidsData.map((item, idx) => {
                                                                
                                                                        return (
                                                                            <li key={`bid_${idx}`} className="single-tab-list d-flex align-items-start w-100">
                                                                             
                                                                                <img className="avatar-sm rounded-circle mr-3" src={item?.profilePhoto} alt="" />
                                                                                <p className="m-0">
                                                                                    Bid listed for <strong>{item.price.amount} {item.price.currency} </strong>
                                                                                     <span>{moment(item.createdAt).fromNow()} </span>
                                                                                     <br />by <Link to={`/author/${item.bidById}`}>@{ this.filterCreatorsInfo(item.bidBy,'username')}</Link>
                                                                                </p>
                                                                                {
                                                                                     nft.nftOwnerId=== userId &&
                                                                                    //   userId === item.nftId &&
                                                                                    <div className="ml-auto" onClick={() => this.deleteBid(item._id)}>
                                                                                        <i className="cursor-pointer fa fa-times text-danger" aria-hidden="true" />
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                      nft.nftOwnerId=== userId &&
                                                                                    //   userId === item.nftId &&
                                                                                    <div className="ml-auto" onClick={() => this.acceptBid(item._id)}>
                                                                                        <i className="cursor-pointer fa fa-check text-success" aria-hidden="true" />
                                                                                    </div>
                                                                                     
                                                                                }
                                                                            </li>
                                                                        );
                                                                    }) :
                                                                    <div className="mt-3">No bids found</div>
                                                                }
                                                            </ul>
                                                        </div>

                                                        {/* <div className="tab-pane fade" id="offers">
                                                            <ul className="list-unstyled">
                                                                {offers && offers.length > 0 ?
                                                                    offers.filter((item)=>item.nftId===nft._id).map((item, idx) => {
                                                                        return (
                                                                            <li key={`offer_${idx}`} className="single-tab-list d-flex align-items-start w-100">
                                                                                <img className="avatar-sm rounded-circle mr-3" src={item?.offerBy?.profilePhoto} alt="" />
                                                                                <p className="m-0">
                                                                                    Offer listed for <strong>{item.price.amount} {item.price.currency}</strong> {moment(item.createdAt).fromNow()} <br />by <Link to={`/author/${item.nftId}`}>@{this.filterCreatorsInfo(item.offerById,"username")}</Link>
                                                                                </p>
                                                                                {
                                                                                    userId === item.nftId &&
                                                                                    <div className="ml-auto" onClick={() => this.deleteOffer(item._id)}>
                                                                                        <i className="cursor-pointer fa fa-times text-danger" aria-hidden="true" />
                                                                                    </div>
                                                                                }
                                                                                {
                                                                                    userId === item.nftId &&
                                                                                    <div className="ml-auto" onClick={() => this.acceptOffer(item._id)}>
                                                                                        <i className="cursor-pointer fa fa-check text-success" aria-hidden="true" />
                                                                                    </div>
                                                                                }
                                                                            </li>
                                                                        );
                                                                    }) :
                                                                    <div className="mt-3">No offers found</div>
                                                                }
                                                            </ul>
                                                        </div> */}
                                                        
                                                        <div className="tab-pane fade" id="details">
                                                            <div className="owner-meta d-flex align-items-center mt-3">
                                                                <span>Owner</span>
                                                                <Link className="owner d-flex align-items-center ml-2" to={`/author/${nft.owner?._id}`}>
                                                                    <img className="avatar-sm rounded-circle" src={nft.owner?.profilePhoto ? nft.owner.profilePhoto : globalPlaceholderImage} alt="Owner Image" />
                                                                    <h6 className="ml-2">{nft.owner?.username}</h6>
                                                                </Link>
                                                            </div>
                                                            <p className="mt-2">Created : {moment(nft.createdAt).format('DD MMM YYYY')
                                                            }</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-lg-6">
                                                <div className="content mt-5 mt-lg-0">
                                                    <h3 className="m-0">{nft.name}</h3>
                                                    <p>{nft.description}</p>

                                                    {/* Owner */}
                                                    <div className="owner d-flex align-items-center">
                                                        <span>Owned By</span>
                                                        <Link className="owner-meta d-flex align-items-center ml-3" to={`/author/${nft.owner?._id}`}>
                                                            <img className="avatar-sm rounded-circle" src={nft.owner?.profilePhoto || globalPlaceholderImage} alt="Owner Avatar" />
                                                            <h6 className="ml-2">
                                                                {/* {nft.owner?.username}
                                                                 */}
                                                                 {this.creatorUserName()}
                                                                </h6>
                                                        </Link>
                                                    </div>
                                                    {/* Item Info List */}
                                                    <div className="item-info-list mt-4">
                                                        <ul className="list-unstyled">
                                                            <li className="price d-flex justify-content-between">
                                                                <span>Current Price {nft.currentPrice || 0} {ENV.currency}</span>
                                                                {/* <span>{initData.price_2}</span> */}
                                                                <span>{nft.sold} of {nft.copies}</span>
                                                            </li>
                                                            <li>
                                                                <span>Size </span>
                                                                <span>{nft.size}</span>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <div className="row items">
                                                        {/* Creator */}
                                                        <div className="col-12 col-md-6 item px-lg-2">
                                                            <div className="card no-hover">
                                                                <div className="single-seller d-flex align-items-center">
                                                                    <a href="/author">
                                                                        <img className="avatar-md rounded-circle" src={nft.creator?.profilePhoto || globalPlaceholderImage} alt="Creator Avatar" />
                                                                    </a>
                                                                    <div className="seller-info ml-3">
                                                                        <Link className="seller mb-2" to={`/author/${nft.creator?._id}`}>{
                                                                          this.creatorUserName()
                                                                        // nft.creator?.username
                                                                        }</Link>
                                                                        <span>Creator</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* Collection */}
                                                        <div className="col-12 col-md-6 item px-lg-2">
                                                            <div className="card no-hover">
                                                                <div className="single-seller d-flex align-items-center">
                                                                    <Link to={`collection-details/${window.btoa(nft.collection?._id)}`}>
                                                                        <img className="avatar-md rounded-circle" src={nft.collection?.image} alt="Collection Image" />
                                                                    </Link>
                                                                    <div className="seller-info ml-3">
                                                                        <Link className="seller mb-2" to={`collection-details/${window.btoa(nft.collection?._id)}`}>{nft.collection?.name}</Link>
                                                                        <span>Collection</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-12 item px-lg-2">
                                                            <div className="card no-hover">
                                                                <h4 className="mt-0 mb-2">Highest Bid</h4>
                                                                <div className="price d-flex justify-content-betxween align-items-center">
                                                                    <span>{this.state.highestBidAmtt ? this.state.highestBidAmtt + ` ${ENV.currency}` : 'N/A'}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {

                                                        nft.nftOwnerId=== userId ?
                                                        <Link className="d-block btn btn-bordered-white mt-4 mb-4 w-100" to={`/sell-item/${window.btoa(nft._id)}`}>{initData.sellBtn}</Link>
                                                        :
                                                        // <button className="d-block btn btn-bordered-white mt-4 w-100" onClick={this.openModal(nft)}>{nft.sellingMethod === 2 ? initData.bidBtn : initData.offerBtn}</button>
                                                        <>
                                                             {/* this.isTimeoutAction ? 'Auction Timeout' : */}
                                                             {/*  */}
                                                            { 
                                                           this.props?.nft?.nftAll.sellingMethod &&
                                                            <button  className="d-block btn btn-bordered-white mt-4 w-100" disabled={this.isTimeoutAction || nft.copies===nft.sold}  onClick={()=>this.openModal()}>{this.isTimeoutAction?"Auction Timeout":( nft.sellingMethod === 2 ? initData.bidBtn : initData.offerBtn)}</button>}
                                                             
                                                            </>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </>

                    }
                </section>
                <div className="modal-wrapper">
                    {
                        nft &&
                        <Modal
                            centered
                            size="lg"
                            className=""
                            show={this.state.isOpen}
                            onHide={this.closeModal}
                        >
                            <Modal.Header className="text-center modal-title-wrapper">
                                <Modal.Title>
                                    { nft.sellingMethod === 2 ? 'Place A Bid' : 'Make An Offer'}
                                </Modal.Title>
                            </Modal.Header>
                            {
                                isSubmitted && errors &&
                                <Modal.Body className="row pt-2 pb-0">
                                    <div className="col-12">
                                        <span id="nft-err" className="form-error-msg text-danger">{errors}</span>
                                    </div>
                                </Modal.Body>
                            }
                            <Modal.Body>
                                <div className="price-wrapper d-flex">
                                    <div className="price-text position-relative">
                                        <div className="text-white mb-2 absolute-wrapper">
                                            <b>Price</b>
                                        </div>
                                        <div className="text-right mb-2">
                                            <i className="fas fa-exclamation-circle ml-2" />
                                        </div>
                                        <div className="d-flex">
                                            <select className="form-control" id="currency" name="nftConfig.price.currency" onChange={(e) => this.onChange(e)}>
                                                {
                                                    currencies && currencies.map((currency, index) => {
                                                        return (
                                                            <option key={index} value={currency.symbol}>{currency.symbol}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                            <input type="text" placeholder="Amount" className="amount-btn ml-3" name="nftConfig.price.amount" placeholder="Amount" className="amount-btn ml-3" style={{ borderRadius: "4px" }} onChange={(e) => this.onChange(e)} onKeyDown={(e) => decimalNumberValidator(e)} defaultValue={nftConfig.price.amount} required />
                                            <div className="text-right mb-2 dollar-wrapper">
                                                $ 0.00
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Body className="text-danger">{this.validator.message('amount', nftConfig.price.amount, 'required')}</Modal.Body>
                            <Modal.Body className="" style={{ flexDirection: "column", display: "block", height: "200px" }}>
                                <div className="offer-expiration-wrapper text-white">
                                    <b>Offer Expiration</b>
                                </div>
                                <div>
                                    <div className="d-flex">
                                        <select className="form-control" id="expiryDate" name="nftConfig.expiry.date" onChange={(e) => this.onChange(e)}
                                            style={{
                                                padding: "7px 55px 7px 55px",
                                                border: "none",
                                                outline: "none",
                                                borderRadius: "4px",
                                                background: "#808080",
                                                display: "flex",
                                                alignItems: "center",
                                                cursor: "pointer",
                                                height: "51px",
                                                color: "#000"
                                            }}
                                        >
                                            {
                                                expiryOptions && expiryOptions.map((expiry, index) => {
                                                    return (
                                                        <option key={index} value={expiry.value}>{expiry.label}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                        <div>
                                            <div className="mr-auto budle-wrapper">
                                                <input type={nftConfig.expiry.type === 1 ? "time" : "datetime-local"} style={{ marginLeft: "1rem", width: "552px" }} name="nftConfig.expiry.time" value={nftConfig.expiry.time} onChange={(e) => this.onChange(e)} required />
                                            </div>
                                            <span className="text-danger message">{this.validator.message('amount', nftConfig.price.amount, 'required')}</span>
                                        </div>
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Body className="justify-content-center align-items-center">
                                <div className="d-flex justify-content-around">
                                    <button className="ethereum-btn mr-3" disabled={loader} onClick={() => this.submit()}>{nft.sellingMethod === 2 ? initData.bidBtn : initData.bidBtn}</button>
                                    {/* <button className="ethereum-btn">Add funds</button> */}
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <button
                                    className="btn banner-btn btn-primary"
                                    onClick={this.closeModal}
                                >
                                    Close
                                </button>
                            </Modal.Footer>
                        </Modal>
                    }
                </div>
            </>
        );
                }
    }
}

const mapStateToProps = state => (
    // console.log('state', state),
 
    {
    nft: state.nft,
    error: state.error,
    offer: state.offer,
    bid: state.bid,
    user: state.user,
    nftAll:state.nftAll,
});

export default connect(mapStateToProps, {
    beforeNFT, getNFT,
    beforeOffer, makeOffer, getOffers, deleteOffer, beforeBid, placeBid, getBids, deleteBid, acceptOffer, acceptBid, beforeUser, getCreators ,
})(ItemDetails);
