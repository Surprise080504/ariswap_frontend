import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {ENV} from './../../config/config';
import {getTopSellers, beforeUser} from './../user/user.action';

const TopSeller = (props) => {
    const [sellers, setSellers] = useState([]);
    useEffect(()=> {
        props.getTopSellers();
    }, []);
    useEffect(()=> {
        setSellers(props.user.sellers)
    }, [props.user.topSellersAuth]);
    return (
        <section className="top-seller-area">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        {/* Intro */}
                        <div className="intro d-flex justify-content-between align-items-end m-0">
                            <div className="intro-content">
                                <span>CREATIVE ARTIST</span>
                                <h3 className="mt-3 mb-0">Top Sellers</h3>
                            </div>
                            {
                                props.viewAll ?
                                <div className="intro-btn">
                                    <Link className="btn content-btn" to="/authors">{props.viewAll}</Link>
                                </div> : ''
                            }
                            
                        </div>
                    </div>
                </div>
                <div className="row items">
                    {
                        sellers && sellers.length ?
                        sellers.map((author, idx) => {
                            return (
                                <div key={`ts_${idx}`} className="col-12 col-sm-6 col-lg-4 item">
                                    {/* Single Seller */}
                                    <div className="card no-hover">
                                        <div className="single-seller d-flex align-items-center">
                                            <Link to={`/author/${author._id}`}>
                                                <img className="avatar-md rounded-circle" src={author.profileImage ? author.profileImage: ENV.globalPlaceholderImage} alt="" />
                                            </Link>
                                            {/* Seller Info */}
                                            <div className="seller-info ml-3">
                                                <Link className="seller mb-2" to={`/author/${author._id}`}>@{author.username}</Link>
                                                <span>{author.price}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }) : 
                        <p>Top Sellers not available</p>
                    }
                </div>
            </div>
        </section>
    )
} 

const mapStateToProps = state => ({
    user: state.user
});

export default connect(mapStateToProps, { beforeUser, getTopSellers })(TopSeller);