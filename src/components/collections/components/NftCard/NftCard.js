import react from "react";
import { Link } from "react-router-dom";
import "./NftCard.css";

const NftCard = (props) => {
  const filterCreator = (nft) => {
    // console.log("nft:", nft);
    const result = props.creators.find((item) => item._id === nft.nftOwnerId);
    if (result?.username) {
      return result?.username;
    } else {
      return "no username found";
    }
  };
  const { userId, nft } = props;
  return (
    <div className="NftCard-Container ">
      <Link to={`/item-details?item=${window.btoa(props.nft._id)}`}>
        <img
          src={
            props?.nft?.image ? props.nft.image : "https://picsum.photos/200"
          }
          alt="testinImage"
          className="nft-car-img"
        />
      </Link>

      <div className="NftCard-description p-3">
        <p className="mb-0 text-white">
          {props?.nft?.name ? props.nft.name : "someTHing"}
        </p>
        <p className="text-white">Owned By: {filterCreator(props.nft)}</p>
        <div className="d-flex w-100 justify-content-between">
          <p className="mb-0 text-white">
            {props?.nft?.currentPrice ? props.nft.currentPrice : "0.04"}
          </p>
          <p className="mt-0 text-white">
            {props?.nft?.sold ? props.nft.sold : "0"} out of {props.nft.copies}
          </p>
        </div>
        <div className="py-3">
          <Link
            to={`/item-details?item=${window.btoa(props.nft._id)}`}
            id="wallet-address"
            className="btn ml-lg-auto btn-bordered-white"
          >
            <i className="icon-wallet mr-md-2" />
            {nft.nftOwnerId === userId
              ? "Sell NFT"
              : nft.sellingMethod === undefined
              ? "NFT Details"
              : nft.nftOwnerId !== userId && nft.sellingMethod == 1
              ? "Buy Now"
              : "Place a Bid"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NftCard;
