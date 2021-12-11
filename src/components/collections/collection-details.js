import React, { useState, useEffect, useRef } from "react";
import CollectionPreview from "./collection-preview";
import Explore from "../explore/explore-all";
import FullPageLoader from "../../components/full-page-loader/full-page-loader";
import { connect } from "react-redux";
import {
  beforeCollection,
  getCollection,
} from "../collections/collections.actions";
import { Link } from "react-router-dom";
import { ENV } from "../../config/config";
import { Accordion, Dropdown } from "react-bootstrap";
import Select from "react-select";
import FilterSearch from "../filter-search/filtersearch";
import NftCard from "./components/NftCard/NftCard";
import { getNFTs } from "../nfts/nfts.action";
import { getCreators, beforeUser } from "./../user/user.action";
const { collectionFeaturedImg, userDefaultImg, categoryDefaultImg } = ENV;

const CollectionDetails = (props) => {
  const [collection, setCollection] = useState(null);
  const [nfts, setNfts] = useState(null);
  const [nftPagination, setNFTPagination] = useState(null);
  const [loadMoreBtn, setLoadMoreBtn] = useState(false);
  const [loader, setLoader] = useState(true);
  const [limit, setLimit] = useState(2);
  const [collectionLoader, setColLoader] = useState(true); // collections loader
  const [nftsLoader, setNftsLoader] = useState(true); // NFTs loader
  const [creators, setCreator] = useState([]);
  const nftsRef = useRef(null);

  useEffect(() => {
    props.getNFTs();
    window.scroll(0, 0);
    const { collectionId } = props.match.params;
    if (collectionId) props.getCollection(window.atob(collectionId));
    else props.history.push("/collections");
  }, []);

  // when collection data is received
  useEffect(() => {
    if (props.collection.getAuth) {
      const { collection } = props.collection;

      setCollection(collection);
      props.beforeCollection();
      setColLoader(false);
    }
  }, [props.collection.getAuth]);

  useEffect(() => {
    if (props.user.topSellersAuth) {
      setCreator(props.user.sellers);
    }
  }, [props.user.topSellersAuth]);

  useEffect(() => {
    console.log(props.user);
  }, [props.user]);

  // handle show load more button state when pagination is set
  useEffect(() => {
    if (nftPagination)
      setLoadMoreBtn(
        nftPagination.total > 0 &&
          nftPagination.total > nfts.length &&
          nfts.length > 0
      );
  }, [nftPagination]);

  const loadMore = () => {
    // const { page, limit } = nftPagination
    setLoader(true);
    setLimit(limit + 2);
    // get more NFTs for explore section
    // getNFTs(1, limit * (page + 1));
  };

  const filterNfts = (nfts) => {
    if (collection) {
      const result_nft = nfts.filter(
        (nft) => nft?.collectionId === collection._id
      );
      nfts.pagination = {
        page: 1,
        limit: 10,
        total: result_nft.length,
        pages: 1,
      };
      setNfts(result_nft.slice(0, limit));
      setNFTPagination(nfts.pagination);
      getNftsLoader(false);
    }
  };

  const getNFTs = (page = 1, limit = 2) => {
    const nftQS = { page, limit };
    if (props.collectionId) nftQS.collectionId = props.collectionId;
    const qs = ENV.objectToQueryString(nftQS);
    props.getNFTs(qs);
  };

  useEffect(() => {
    if (props.nft.nftsAuth) {
      const { nftsData } = props.nft;
      filterNfts(nftsData);
    }
  }, [props?.nft?.nftsAuth, collection, limit]);

  const getNftsLoader = (loader) => {
    setNftsLoader(loader);
  };

  return (
    <section
      className="author-area explore-area  popular-collections-area"
      style={{ padding: "0px" }}
    >
      {(collectionLoader || nftsLoader) && <FullPageLoader />}
      <div className="">
        {collection && (
          <div className="row p-5" style={{ width: "80%", margin: "auto" }}>
            <div className="col-4 p-4">
              <CollectionPreview collection={collection} creators={creators} />
            </div>
            <div className="col-8 ">
              <div className="row justify-content-center mt-5">
                <div className="col-12 col-md-8 col-lg-7">
                  <div className="intro text-center mb-4">
                    {/* <span>{initData.pre_heading}</span> */}
                    <span>Explore</span>
                    {/* <h3 className="mt-3 mb-0">{"initData.heading"}</h3> */}
                    <h3 className="mt-3 mb-0">{"Exclusce digital assets"}</h3>
                  </div>
                </div>
              </div>
              <div className="row gx-5 p-4">
                {nfts &&
                  creators &&
                  nfts.map((nft, index) => {
                    return (
                      <div className="col-6 mt-5" key={index}>
                        <NftCard nft={nft} creators={creators} />
                      </div>
                    );
                  })}
                {loadMoreBtn && (
                  <div className="row w-100">
                    <div className="col-12 w-100 text-center">
                      <a
                        id="load-btn"
                        className="btn btn-bordered-white mt-5"
                        onClick={() => loadMore()}
                      >
                        Load More
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const mapStateToProps = (state) => ({
  error: state.error,
  collection: state.collection,
  nft: state.nft,
  user: state.user,
});

export default connect(mapStateToProps, {
  beforeCollection,
  getCollection,
  getNFTs,
  getCreators,
})(CollectionDetails);
