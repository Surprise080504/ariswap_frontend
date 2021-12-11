import React from 'react';
import { ENV } from '../../config/config';
import { Link } from 'react-router-dom';
const { collectionFeaturedImg, userDefaultImg, categoryDefaultImg } = ENV

const CollectionPreview = ({ collection }) => {
    return (
        <>
            <div className="card no-hover text-center ">
                <div className="image-over">
                    <div>
                        <img className="card-img-top" src={collection.featuredImg ? collection.featuredImg : collectionFeaturedImg} alt="Collection Featured Image" />
                    </div>
                    <div className="seller">
                        <div className="seller-thumb avatar-lg">
                            <img className="rounded-circle" src={collection.logo} alt='Collection Logo' />
                        </div>
                    </div>
                </div>
                <div className="card-caption col-12 p-0">
                    <div className="card-body mt-4">
                        <div>
                            <h5 className="mb-2">{collection.name}</h5>
                            <p className="mb-2">
                                {
                                    collection.url ?
                                        <div className="input-group">
                                            <input type="text" className="form-control" placeholder="Collection URL" readOnly value={collection.url} />
                                            <div className="input-group-append" style={{ zIndex: 888 }}>
                                                <button className="btn mr-0"><i className="icon-docs" /></button>
                                            </div>
                                        </div>
                                        : ('URL: N/A')
                                }
                            </p>
                            <p className="mb-2">{collection.description ? collection.description : 'Description: N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row items">
                <div className="col-12 px-0 mt-3">
                    <div className="card no-hover">
                        <div className="single-seller d-flex align-items-center">
                            <img className="avatar-md rounded-circle" src={collection.category?.image || categoryDefaultImg} alt="Category Image" />
                            <div className="seller-info ml-3">
                                <div className="seller">{collection.category?.name || 'N/A'}</div>
                                <span>Category</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 px-0 my-3">
                    <div className="card no-hover">
                        <div className="single-seller d-flex align-items-center">
                            <Link to="/author">
                                <img className="avatar-md rounded-circle" src={collection.user?.profilePhoto || userDefaultImg} alt="User Avatar" />
                            </Link>
                            <div className="seller-info ml-3">
                                <Link className="seller mb-2" to="/author">{collection.user?.username}</Link>
                                <span>Creator</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CollectionPreview;