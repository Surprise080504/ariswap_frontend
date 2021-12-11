import { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { beforeFaq, getFaqs } from "./faq.action"

const Faq = (props) => {

    const [data, setData] = useState(null)

    useEffect(() => {
        props.getFaqs()
     
    }, [])

    useEffect(() =>{
        if(props.faqs.faqsAuth){
            const {faqs} = props.faqs.faqs
            setData(faqs)
        }
    }, [props.faqs.faqsAuth])

    return (
        <section className="faq-area">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-7">
                        {/* Intro */}
                        <div className="intro text-center">
                            <span>{"FAQ"}</span>
                            <h3 className="mt-3 mb-0">{"Frequently Asked Questions"}</h3>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-12">
                        {/* FAQ Content */}
                        <div className="faq-content">
                            {/* Netstorm Accordion */}
                            <div className="accordion" id="netstorm-accordion">
                                <div className="row justify-content-center">
                                    <div className="col-12 col-md-10">
                                        {/* Single Accordion Item */}
                                        {data ? data.map((item, idx) => {
                                            return (
                                                <div key={`fd_${idx}`} className="single-accordion-item p-3">
                                                    {/* Card Header */}
                                                    <div className="card-header bg-inherit border-0 p-0">
                                                        <h2 className="m-0">
                                                            <button className={"btn d-block text-left w-100 collapsed py-4"} type="button" data-toggle="collapse" data-target={`#helpOption-${idx}`}>
                                                                {item.title}
                                                            </button>
                                                        </h2>
                                                    </div>
                                                    <div id={`helpOption-${idx}`} className={"collapse"} data-parent="#netstorm-accordion">
                                                        {/* Card Body */}
                                                        <div className="card-body py-3" dangerouslySetInnerHTML={{__html: item.desc}}>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }) : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

const mapStateToProps = (state) => ({
    faqs: state.faqs,
    error: state.error,
});

export default connect(mapStateToProps, {
    beforeFaq, 
    getFaqs
})(Faq);