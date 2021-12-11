import React, { useState, useEffect } from 'react';
import FullPageLoader from '../../components/full-page-loader/full-page-loader';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { beforeAuction, getLiveAuctions } from './auctions.action';
import { ENV } from '../../config/config';
import Countdown from 'react-countdown';
import {getCreators, beforeUser} from './../user/user.action';
import image from '../../assets/images/placeholder.png'
const { globalPlaceholderImage, countDownRenderer } = ENV

const initData = {
    pre_heading: "Auctions",
    heading: "Live Auctions",
    content: "",
    btn_1: "Load More"
}

const LiveAuctions = (props) => {
    const [pagination, setPagination] = useState(null);
    const [auctions, setAuctions] = useState(null)
    const [loader, setLoader] = useState(true) // auctions loader
    const [loadMoreBtn, setLoadMoreBtn] = useState(false);
    const [creators,setCreator]=useState([])

    useEffect(() => {
        window.scroll(0, 0)
        // get live auctions
        getLiveAuctions()
        props.getCreators()
    }, [])

    useEffect(()=>{
      
        if(props.user.topSellersAuth ){
        //    console.log(props.user.sellers,"sellers blah blah blah");
           setCreator(props.user.sellers)
           setLoader(false)
           
        }
      },[props.user.topSellersAuth])
    // set live auctions
    useEffect(() => {
        if (props.auction.getAuth) {
            const { auctions, pagination } = props.auction
            if (auctions) {
                setAuctions(auctions)
                setPagination(pagination)
                props.beforeAuction()
             
            }
        }
    }, [props.auction.getAuth])

    // handle show load more button state when pagination is set
    useEffect(() => {
        if (pagination)
            setLoadMoreBtn((pagination.total > 0 && pagination.total > auctions.length && auctions.length > 0))
    }, [pagination])

    const loadMore = () => {
        const { page, limit } = pagination
        setLoader(true)

        // get more live auctions
        getLiveAuctions(1, limit * (page + 1))
    }

    const getLiveAuctions = (page = 1, limit = 8) => {
        const qs = ENV.objectToQueryString({ page, limit })
        props.getLiveAuctions(qs)
    }
    const filterCreator=(nft,field)=>{
        const result= creators.find((item)=>item._id===nft.nftOwnerId)
     
        if(field==="userName"){

         if(result?.username){
       
             return result?.username
         }
         else {
             return "no username found"
         }
        }
        else if(field=="profileImage"){
            if(result?.profileImage)
            {

                return result?.profileImage
            }
            else {
                return image
            }
        }


       }



    return (
        <section className="live-auctions-area load-more padding-wrapper">
            {
                loader ?
                    <FullPageLoader /> :
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-12 col-md-8 col-lg-7">
                                {/* Intro */}
                                <div className="intro text-center">
                                    <span>{initData.pre_heading}</span>
                                    <h3 className="mt-3 mb-0">{initData.heading}</h3>
                                    <p>{initData.content}</p>
                                </div>
                            </div>
                        </div>
                        <div className="row items">
                            {auctions && auctions.length > 0 ?
                                auctions.map((item, idx) => {
                                    return (
                                        <div className="col-4" key={`auc_${idx}`} id={`#auc-${idx}`}>
                                            <div className="card m-3">
                                                <div className="image-over">
                                                    <Link to={`/item-details?item=${window.btoa(item._id)}`}>
                                                        <img className="card-img-top" src={item.image} alt="NFT image" width="600" height="600" />
                                                    </Link>
                                                </div>
                                                <div className="card-caption col-12 p-0">
                                                    <div className="card-body">
                                                        <div className="mb-3">
                                                            <Countdown
                                                                // date={new Date(item.auctionEndDate) + 10000}
                                                                date={1651851923270}
                                                                renderer={countDownRenderer}
                                                            />
                                                        </div>
                                                        <Link to={`/item-details?item=${window.btoa(item._id)}`}>
                                                            <h5 className="mb-0">{item.name}</h5>
                                                        </Link>
                                                        <Link className="seller d-flex align-items-center my-3" to={`/author`}>
                                                            
                                                           <img className="avatar-sm rounded-circle" src={filterCreator(item,"profileImage")} alt="User Avatar" />
                                                             <span className="ml-2">{filterCreator(item,"userName")}</span> 
                                                        </Link>
                                                        <div className="card-bottom d-flex justify-content-between">
                                                            <span>{item.currentPrice} {ENV.currency}</span>
                                                            <span>{item.sold} of {item.copies}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                                : <p className="text-center ml-3">No Live Auctions Found</p>
                            }
                        </div>
                        {
                            loadMoreBtn &&
                            <div className="row">
                                <div className="col-12 text-center">
                                    <a id="load-btn" className="btn btn-bordered-white mt-5" onClick={() => loadMore()}>{initData.btn_1}</a>
                                </div>
                            </div>
                        }
                    </div>
            }
        </section>
    );
}

const mapStateToProps = state => ({
    auction: state.auction,
    error: state.error,
    user: state.user,
});

export default connect(mapStateToProps, { beforeAuction,getCreators, getLiveAuctions })(LiveAuctions);