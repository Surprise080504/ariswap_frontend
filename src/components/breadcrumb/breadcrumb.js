import React from 'react';

function Breadcrumb(props) {
    return (
        <section className="breadcrumb-area overlay-dark d-flex align-items-center" style={{ backgroundImage: `url(${(props.banner || props.bannerImg)})`, backgroundPosition: "center" }}>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="breadcrumb-content text-center">
                            <h2 className="m-0">{props.title}</h2>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
export default Breadcrumb;