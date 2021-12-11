import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import {getCreators, beforeUser} from './../user/user.action';
import {ENV} from './../../config/config';

const Authors = (props) => {
    const [creators, setCreators] = useState([]);
    useEffect(()=> {
        props.getCreators();
        window.scrollTo(0, 0)
    }, []);
    useEffect(()=> {
        setCreators(props.user.sellers)
      
    }, [props.user.topSellersAuth]);

    return (
        <section className="popular-collections-area mt-5">
            <br />
            <br />
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-7">
                        {/* Intro */}
                        <div className="intro text-center">
                            <span>Creators</span>
                            <h3 className="mt-3 mb-0">Our Creators</h3>
                        </div>
                    </div>
                </div>
                <div className="row items">
                    {
                        creators && creators.length ? 
                        creators.map((author, key)=> {
                            return (
                                <div key={`author_${key}`} className="col-12 col-sm-6 col-lg-3 item">
                                    <div className="card no-hover text-center">
                                        <div className="image-over">
                                            <Link to={`/author/${author._id}`}>
                                                <img className="card-img-top" src={author.profileImage ? author.profileImage: ENV.globalPlaceholderImage} alt="Author profile" />
                                            </Link>
                                        </div>
                                        <div className="card-caption col-12 p-0">
                                            <div className="card-body mt-1">
                                                <Link to={`/author/${author._id}`}>
                                                    <h5>{author.username ? author.username : author.address} </h5>
                                                </Link>
                                                <button type="button" className="btn btn-bordered-white btn-smaller">Follow</button>
                                            </div>
                                        </div>
                                    </div>
                                  
                                </div>
                            )
                        })
                        : 
                        <p>No Creators Found</p>
                    }
                </div>
            </div>
        </section>
    );
}

const mapStateToProps = state => (
   
    {
    user: state.user
});

export default connect(mapStateToProps, { beforeUser, getCreators })(Authors);