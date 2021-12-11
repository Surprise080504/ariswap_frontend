import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { beforeNFT, getNFTs } from '../nfts/nfts.action';
import { ENV } from '../../config/config';
import FullPageLoader from '../full-page-loader/full-page-loader'
import ExploreItems from './explore-items';
import NftCard from '../collections/components/NftCard/NftCard';
import { Link, useHistory } from 'react-router-dom';
import {getCreators, beforeUser} from './../user/user.action';

const initData = {
    pre_heading: "Explore",
    heading: "Exclusive Digital Assets",
    content: "",
    btn_1: "Load More"
}

function ExploreAll(props) {
    const [nftPagination, setNFTPagination] = useState(null);
    const [nfts, setNFTs] = useState([]); // NFTs for explore section
    const [loader, setLoader] = useState(true);
    const [loadMoreBtn, setLoadMoreBtn] = useState(false);
    const [intro, setIntro] = useState(false);
    const [creators,setCreator]=useState([])
    const pathname = useHistory().location.pathname

    useEffect(() => {
        window.scroll(0, 0)

        // set intro section
        if (pathname === '/explore-all')
            setIntro(true)
      
        // get NFTs for explore section
        getNFTs()
        props.getCreators()
    }, [])
  useEffect(()=>{
      
    if(props.user.topSellersAuth ){
    //    console.log(props.user.sellers,"sellers blah blah blah");
       setCreator(props.user.sellers)
       
    }
  },[props.user.topSellersAuth])
  useEffect(()=>{
    if(props.user.creatorsAuth ){
    //    console.log(props.user.creators,"sellers blah blah blah");
       setCreator(props.user.creators)
       setLoader(false)
    }
  },[props.user.creatorsAuth])
    // set NFTs for explore section
    useEffect(() => {
        if (props.nft.nftsAuth) {
            const { nftsData } = props.nft
            // console.log(nftsData,"nftsData==>")
            if (nftsData) {
             
                // console.log(nftsData,"checking nfts" )
                setNFTs(nftsData)
                setNFTPagination(nftsData.pagination)
                props.beforeNFT()
            
                // setLoader(false)
                if (props.setLoader)
                    props.setLoader(false)
                    
            }
            setLoader(false)
        }
    }, [props.nft.nftsAuth])

    // handle show load more button state when pagination is set
    useEffect(() => {
        if (nftPagination)
            setLoadMoreBtn((nftPagination.total > 0 && nftPagination.total > nfts.length && nfts.length > 0))
    }, [nftPagination])

    const loadMore = () => {
        const { page, limit } = nftPagination
        setLoader(true)
        // get more NFTs for explore section
        getNFTs(1, limit * (page + 1))
    }

    const getNFTs = (page = 1, limit = 4) => {
        const nftQS = { page, limit, explore: true }

        if (props.collectionId)
            nftQS.collectionId = props.collectionId

        const qs = ENV.objectToQueryString(nftQS)
        props.getNFTs(qs)
    }

//     <div className="row gx-5 p-4">
//     {
//       nfts && nfts.map((nft)=>{
//     return (

// <div className="col-6 mt-5" style={{}}>

//   <NftCard nft={nft}/>
// </div>
//     )
//       })
//     }
// console.log(nfts,"checking nfts==>")

    return (
        <section className="explore-area" style={{ paddingTop: `${intro ? '150' : '30'}px` }}>
            {loader && <FullPageLoader />}
            <div className="container">
                {
                    intro &&
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-8 col-lg-7">
                            <div className="intro text-center mb-4">
                                <span>{initData.pre_heading}</span>
                                <h3 className="mt-3 mb-0">{initData.heading}</h3>
                                {/* <p>{initData.content}</p> */}
                            </div>
                        </div>
                    </div>
                }
                <div className="row items gx-4 explore-items">
                    {nfts && nfts.length > 0 && creators.length>0 ?
                        nfts.map((item, idx) => {
                            return (
                                <div className="col-3 mt-5" style={{}}>

                               <NftCard nft={item} creators={creators} userId={ENV.getUserKeys('_id')._id}/>
                                </div>
                                // <div key={`edth_${idx}`} className={`col-12 col-sm-6 col-lg-${props.lgCols ? props.lgCols : '3'} item explore-item`} data-groups={item.group ? item.group : '["art","sports"]'}>
                                //     <div className="card">
                                //         <div className="image-over">
                                //             <Link to={`/item-details?item=${window.btoa(item._id)}`}>
                                //                 <img className="card-img-top" src={item.image} alt="Item Image" />
                                //             </Link>
                                //         </div>
                                //         <div className="card-caption col-12 p-0">
                                //             <div className="card-body">
                                //                 <Link to={`/item-details?item=${window.btoa(item._id)}`}>
                                //                     <h5 className="mb-0">{item.name}</h5>
                                //                 </Link>
                                //                 <div className="seller d-flex align-items-center my-3">
                                //                     <span>Owned By</span>
                                //                     <a href="/author">
                                //                         <h6 className="ml-4 mb-0">{"usama asghar"}</h6>
                                //                         {/* <h6 className="ml-2 mb-0">{item.owner.username}</h6> */}
                                //                     </a>
                                //                 </div>
                                //                 <div className="card-bottom d-flex justify-content-between">
                                //                     <span>{item.currentPrice}</span>
                                //                     <span>{"0"} of {"5"}</span>
                                //                 </div>
                                //                 {/* <a className="btn btn-bordered-white btn-smaller mt-3" href="/login"><i className="icon-handbag mr-2" />Place a Bid</a> */}
                                //             </div>
                                //         </div>
                                //     </div>
                                // </div>
                            );
                        })
                        : <p className="text-center">No Items Found to Exploree</p>
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
                {/* <ExploreItems class1="explore-items" class2="explore-item" key="edth" /> */}
            </div>
        </section>
    )
}

const mapStateToProps = state => ({
    nft: state.nft,
    user: state.user,
});

export default connect(mapStateToProps, { beforeNFT, getNFTs ,getCreators})(ExploreAll);