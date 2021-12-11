import React, { useState, useEffect, useRef } from 'react';
import FullPageLoader from '../../components/full-page-loader/full-page-loader';
import { Link } from 'react-router-dom';
import Collections from './collections';

const initData = {
    pre_heading: "Most Popular",
    heading: "Popular Collections",
    btnText: "Explore More"
}

const PopularCollections = (props) => {
    const [collectionsLoader, setColLoader] = useState(false) // collections loader
    const collectionsRef = useRef(null)

    useEffect(() => {
        window.scroll(0, 0)
    }, [])

    const getColLoader = (loader) => {
        setColLoader(loader)
    }

    return (
        <>
            {collectionsLoader && <FullPageLoader />}
            <section className="popular-collections-area">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="intro d-flex justify-content-between align-items-end m-0">
                                <div className="intro-content">
                                    <span>{initData.pre_heading}</span>
                                    <h3 className="mt-3 mb-0">{initData.heading}</h3>
                                </div>
                                {
                                    collectionsRef.current?.colCount > 0 && 
                                    <div className="intro-btn">
                                        <Link className="btn content-btn text-left" to="/collections">{initData.btnText}</Link>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <Collections popular={true} userId='61408000cef27850fdea272b' setLoader={getColLoader} ref={collectionsRef} />
                </div>
            </section>
        </>
    );
}

export default PopularCollections;
