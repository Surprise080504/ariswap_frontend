import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import './full-page-loader.css';

function FullPageLoader() {
    useEffect(() => {
        AOS.init();
    }, []);

    return (
        <React.Fragment>
            <div className="fullpage-loader-holder">
                <div className="fullpage-loader">
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <div className="circle"></div>
                    <div className="shadow"></div>
                    <div className="shadow"></div>
                    <div className="shadow"></div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default FullPageLoader;