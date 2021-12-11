import React, { useState } from 'react';
import ExploreItems from './explore-items';
import { Link } from 'react-router-dom';

const initData = {
    pre_heading: "Exclusive Assets",
    heading: "Explore",
    btn_1: "View All",
}

function ExploreHome() {
    const [viewAll, setViewAll] = useState(false);

    const getViewAll = (view) => {
        setViewAll(view)
    }
const nfts=[
  1,2,3,4,5,6
]
    return (
        <section className="explore-area load-more p-0">
            <div className="container">
                <div className="row">
                    {/* <div className="col-12">
                        <div className="intro d-flex justify-content-between align-items-end m-0">
                            <div className="intro-content">
                                <span>{initData.pre_heading}</span>
                                <h3 className="mt-3 mb-0">{initData.heading}</h3>
                            </div>
                            {
                                viewAll &&
                                <div className="intro-btn">
                                    <Link className="btn content-btn" to="/explore-all">{initData.btn_1}</Link>
                                </div>
                            }
                        </div>
                    </div> */}
                </div>
                {/* <ExploreItems key="exo" setView={true} setViewAll={getViewAll} loadMoreBtn nfts={nfts}/> */}
            </div>
        </section>
    );
}

export default ExploreHome;