import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { beforeNFT, getNFTs } from '../nfts/nfts.action';
import { ENV } from '../../config/config';
import { Link } from 'react-router-dom';
import NftCard from '../collections/components/NftCard/NftCard'
const initData = {
    btn_1: "Load More",
}

function ExploreItems(props) {
    const [nftPagination, setNFTPagination] = useState(null);
    const [nfts, setNFTs] = useState([]); // NFTs for explore section
    const [loader, setLoader] = useState(true);
    const [loadMoreBtn, setLoadMoreBtn] = useState(false);

    useEffect(() => {
        // get NFTs for explore section
        const nftQS = { page: 1, limit: 4, explore: true }
        const qs = ENV.objectToQueryString(nftQS)
        props.getNFTs(qs)
    }, [])

    // set NFTs for explore section
    useEffect(() => {
        if (props.nft.nftsAuth) {
            const { nftsData } = props.nft
            if (nftsData) {
                setNFTs(nftsData.nfts)
                setNFTPagination(nftsData.pagination)
                props.beforeNFT()
                setLoader(false)
                if (props.setView)
                    props.setViewAll(nftsData.nfts && nftsData.nfts.length > 0)
            }
        }
    }, [props.nft.nftsAuth])

    // handle show load more button state when pagination is set
    useEffect(() => {
        if (nftPagination)
            setLoadMoreBtn((nftPagination.total > 0 && nftPagination.total > nfts.length))
    }, [nftPagination])

    const loadMore = () => {
        const { page, limit } = nftPagination
        setLoader(true)

        // get more NFTs for explore section
        const nftQS = { page: 1, limit: limit * (page + 1), explore: true }
        const qs = ENV.objectToQueryString(nftQS)
        props.getNFTs(qs)
    }

    return (
        <>
            {/* <div className={`row items ${props.class1 ? props.class1 : ''} ${!nfts.length ? 'justify-content-center' : ''}`}> */}
            <div className="row">
            <div className="row justify-content-center mt-5 w-100">
                        <div className="col-12 col-md-8 col-lg-7">
                            <div className="intro text-center mb-4">
                                {/* <span>{initData.pre_heading}</span> */}
                                <span>Explore</span>
                                {/* <h3 className="mt-3 mb-0">{"initData.heading"}</h3> */}
                                    <h3 className="mt-3 mb-0">{"Exclusce digital assets"}</h3>
                            </div>
                        </div>
                    </div>

                {
                    props.nfts && props.nfts.length > 0 ?
                        props.nfts.map((item, idx) => {
                            return (
                                
                                // <div key={`${props.key}_${idx}`} className={`col-12 col-sm-6 col-lg-3 item d-block ${props.class2 ? props.class2 : ''}`}>
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
                                //                     <Link to="/author">
                                //                         <h6 className="ml-2 mb-0">{item.owner.username}</h6>
                                //                     </Link>
                                //                 </div>
                                //                 <div className="card-bottom d-flex justify-content-between">
                                //                     <span>{item.currentPrice}</span>
                                //                     {/* <span>{item.sold} of {item.copies}</span> */}
                                //                 </div>
                                //                 {/* <Link className="btn btn-bordered-white btn-smaller mt-3" to="/login"><i className="icon-handbag mr-2" />Place a Bid</Link> */}
                                //             </div>http://3.142.91.8/authorshttp://3.142.91.8/authors
                                //         </div>
                                //     </div>
                                // </div>
                                     
                      <>
                     
                                     <div className="col-4 mt-5">
                                     <NftCard/>
                                     </div>

                                     </>
                              
                            );
                        })
                        : <p className="text-center">No Items Found to Explore</p>
                }  </div>
            {/* </div> */}
            {
                props.loadMoreBtn &&
                <div className="row">
                    <div className="col-12 text-center">
                        <a id="load-btn" className="btn btn-bordered-white mt-5" onClick={() => loadMore()}>{initData.btn_1}</a>
                    </div>
                </div>
            }
        </>
    );
}

const mapStateToProps = state => ({
    nft: state.nft
});

export default connect(mapStateToProps, { beforeNFT, getNFTs })(ExploreItems);