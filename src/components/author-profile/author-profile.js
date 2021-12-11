import React, { useEffect } from 'react';
import {ENV} from './../../config/config';

const AuthorProfile = (props) => {    
    useEffect(()=> {

    },[])
    return (
        <div className="card-wrapper">
       <div className="card no-hover text-center">
            <div className="image-over">
                <img id="nft-image" className="card-img-top" src={props.profileImage ? props.profileImage: ENV.globalPlaceholderImage} alt="User Profile" />
            </div>
            <div className="card-caption col-12 p-0">
                <div className="card-body mt-4">
                    <h5 className="mb-3">{props.username}</h5>
                    <p className="my-3">{props.description}</p>
                    <div className="input-group">
                        <input type="text" className="form-control" placeholder="0x000000000000000000" readOnly value={props.address}/>
                        <div className="input-group-append">
                            <button><i className="icon-docs" /></button>
                        </div>
                    </div>
                    <div className="social-icons d-flex justify-content-center my-3">
                        {
                            props.facebookLink && <a className="facebook" href={props.facebookLink} target="_blank">
                                <i className="fab fa-facebook-f" />
                            </a>
                        }
                        {
                            props.twitterLink && <a className="twitter" href={props.twitterLink} target="_blank">
                                <i className="fab fa-twitter" />
                            </a>
                        }
                        {
                            props.gPlusLink && <a className="google-plus" href={props.gPlusLink} target="_blank">
                                <i className="fab fa-google-plus-g" />
                            </a>
                        }
                        {
                            props.vineLink && <a className="vine" href={props.vineLink} target="_blank">
                                <i className="fab fa-vine" />
                            </a>
                        }
                    </div>
                    {
                        props.followText &&
                        <a className="btn btn-bordered-white btn-smaller" href="#">{props.followText}</a>
                    }
                </div>
            </div>
        </div>
        </div>
 
    );
}
export default AuthorProfile;