import React from 'react';
import { ENV } from '../../config/config'
const itemPlaceholderImg = ENV.globalPlaceholderImage

const NFTPreview = (props) => {
    return (
        <div className="card no-hover text-center">
            <div className="image-over">
                <img id="nft-image" className="card-img-top" src={props.image ? props.image : itemPlaceholderImg} alt="NFT image" />
            </div>
            <div className="card-caption col-12 p-0">
                <div className="card-body mt-4">
                    <h5 className="mb-3">{props.name}</h5>
                    <p className="my-3">{props.currentPrice ? props.currentPrice : 0}{ENV.currency}</p>
                    {/* <p>{props.sold ? props.sold : 0} of {props.copies ? props.copies : 0} Copies</p> */}
                    {/* <div className="input-group">
                        <div className="input-group-append">
                            <button><i className="icon-docs" /></button>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
}

export default NFTPreview;