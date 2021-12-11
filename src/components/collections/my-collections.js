import React, { useState, useEffect, useRef } from 'react';
import FullPageLoader from '../../components/full-page-loader/full-page-loader';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { beforeCategory, getCategories } from '../categories/categories.action';
import Collections from './collections';

const initData = {
    pre_heading: "Collections",
    heading: "My Collections",
    content: "",
    btnText: "Create New"
}

const MyCollections = (props) => {
    const [categories, setCategories] = useState(null)
    const [categoriesLoader, setCatLoader] = useState(true) // categories loader
    const [collectionsLoader, setColLoader] = useState(true) // collections loader
    const collectionsRef = useRef(null)

    useEffect(() => {
        window.scroll(0, 0)
        props.getCategories()
    }, [])

    // when categories data is received
    useEffect(() => {
        if (props.category.getAuth) {
            const { categories } = props.category
            const allCat = { active: true, name: 'all' }
            setCategories([allCat, ...categories])
            props.beforeCategory()
            setCatLoader(false)
        }
    }, [props.category.getAuth])

    const getColLoader = (loader) => {
        setColLoader(loader)
    }

    const getCatCollections = (catId) => {
        collectionsRef.current?.getCatCollections(catId)
    }
    // alert("cdskjfdkjf")

    return (
        <>
            {(categoriesLoader || collectionsLoader) && <FullPageLoader />}
            <section className="explore-area padding-wrapper">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="intro d-flex justify-content-between align-items-end m-0">
                                <div className="intro-content">
                                    <span>{initData.pre_heading}</span>
                                    <h3 className="mt-3 mb-0">{initData.heading}</h3>
                                </div>
                                <div className="intro-btn">
                                    <Link className="btn content-btn text-left" to="/collection/create">{initData.btnText}</Link>
                                </div>
                            </div>
                            <div className="intro my-3">
                                <p>{initData.content}</p>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center text-center">
                        <div className="col-12">
                            {/* Explore Menu */}
                            <div className="explore-menu btn-group btn-group-toggle flex-wrap justify-content-center text-center mb-4" data-toggle="buttons">
                                {
                                    categories && categories.length > 0 &&
                                    categories.map((item, index) => {
                                        return (
                                            <label onClick={() => getCatCollections(item._id)} key={`cat_${index}`} className={`btn ${item.active ? 'active' : ''} d-table text-uppercase p-2`}>
                                                <input type="radio" defaultValue={item.name} defaultChecked className="explore-btn" />
                                                <span>{item.name}</span>
                                            </label>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <Collections all={true} userId='61408000cef27850fdea272b' setLoader={getColLoader} ref={collectionsRef} mycollections />
            </section>
        </>
    );
}

const mapStateToProps = state => ({
    error: state.error,
    category: state.category
});

export default connect(mapStateToProps, { beforeCategory, getCategories })(MyCollections);
