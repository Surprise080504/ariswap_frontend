import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ENV } from '../../config/config';
import { beforeCollection, getCollections } from './collections.actions';
const { collectionFeaturedImg, userDefaultImg } = ENV

const Collections = forwardRef((props, ref) => {
    const [collections, setCollections] = useState(null)
    const [source, setSource] = useState(1) // 1 for my collections, 2 for popular collections

    useEffect(() => {
        window.scroll(0, 0)
        if (props.source)
            setSource(props.source)

        if (props.setLoader)
            props.setLoader(false) //to be changed

        getCollections()
    }, [])

    useEffect(() => {
        if (props.collection.getAuth) {
            const { collections } = props.collection;
            const userId = ENV.getUserKeys('_id')._id;
            if(props.mycollections){

                let myCollections=   collections.filter((item)=>item.userId===userId)
                 setCollections(myCollections)
            }else {
                setCollections(collections)
            }
            props.beforeCollection()
            if (props.setLoader)
                props.setLoader(false)
        }
    }, [props.collection.getAuth])

    const getCollections = (categoryId = null) => {
        const filter = {
            page: 1,
        }
        if (categoryId)
            filter.categoryId = categoryId

        if (props.userId)
            filter.userId = props.userId

        if (props.popular)
            filter.popular = true

        // if not all then apply limit 
        if (!props.all)
            filter.limit = props.limit ? props.limit : 8
        else
            filter.all = true

        const qs = ENV.objectToQueryString(filter)
        props.getCollections(qs)
    }

    useImperativeHandle(ref, () => ({
        getCatCollections: (catId) => {
            if (props.setLoader)
                props.setLoader(true)

            getCollections(catId)
        },
        colCount: collections?.length || 0
    }))

    return (
        <div className="popular-collections-area">
            <div className="container">
                <div className={`row items ${!collections && 'justify-content-center'}`}>
                    <>
                        {
                            collections && collections.length ?
                                collections.map((item, idx) => {
                                    return (
                                        <div key={`cd_${idx}`} className="col-12 col-sm-6 col-lg-3 item">
                                            <div className="card no-hover text-center">
                                                <div className="image-over">
                                                    <Link to={`/collection-details/${window.btoa(item._id)}`}>
                                                        <img className="card-img-top" src={item.featuredImg ? item.featuredImg : collectionFeaturedImg} alt="Collection Featured Image" />
                                                    </Link>
                                                    <Link className="seller" to={source === 1 ? `/collection-details/${window.btoa(item._id)}` : `/author/${item.user._id}`}>
                                                        <div className="seller-thumb avatar-lg">
                                                            <img className="rounded-circle" src={source === 1 ? item.logo : (item.user.profilePhoto ? item.user.profilePhoto : userDefaultImg)} alt={source === 1 ? 'Collection Logo' : 'User Avatar'} />
                                                        </div>
                                                    </Link>
                                                </div>
                                                <div className="card-caption col-12 p-0">
                                                    <div className="card-body mt-4">
                                                        <Link to={`/collection-details/${window.btoa(item._id)}`}>
                                                            <h5 className="mb-2">{item.name}</h5>
                                                        </Link>
                                                        <span>{item.category ? item.category.name : 'Category: N/A'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                                :
                                <div className="col-12"><p className="text-center mt-4">No Collection Found</p></div>
                        }
                    </>
                </div>
            </div>
        </div>
    );
})

const mapStateToProps = state => ({
    collection: state.collection,
    error: state.error
});

export default connect(mapStateToProps, { beforeCollection, getCollections }, null, { forwardRef: true })(Collections)