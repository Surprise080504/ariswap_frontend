import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.png'
import { connect } from 'react-redux'
import { getFooter } from './footer.action'
import {ENV} from './../../config/config';

const Footer = (props) => {

    const [data, setData] = useState({
        facebook: '',
        twitter: '',
        instagram: '',
        youtube: '',
        vine: '',
        desc: ''
    })

    useEffect(() => {
        props.getFooter()
    }, [])

    useEffect(() => {
        if (props.settings.settingsAuth) {
            setData(props.settings.settings)
        }
    }, [props.settings.settingsAuth])

    return (
        <footer className="footer-area">
            {/* Footer Top */}
            <div className="footer-top">
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-sm-6 col-lg-3 res-margin">
                            {/* Footer Items */}
                            <div className="footer-items">
                                {/* Logo */}
                                <Link className="navbar-brand" to="/">
                                    <img src={logo} alt="" />
                                </Link>
                                <p>{data.desc}</p>
                                {/* Social Icons */}
                                <div className="social-icons d-flex">
                                    {
                                        data.facebook ?
                                            <a href={data.facebook} target="_blank">
                                                <i className={"fab fa-facebook-f"} />
                                                <i className={"fab fa-facebook-f"} />
                                            </a> : ''
                                    }

                                    {
                                        data.twitter ?
                                            <a href={data.twitter} target="_blank">
                                                <i className={"fab fa-twitter"} />
                                                <i className={"fab fa-twitter"} />
                                            </a> : ''
                                    }

                                    {
                                        data.instagram ?
                                            <a href={data.instagram} target="_blank">
                                                <i className={"fab fa-instagram"} />
                                                <i className={"fab fa-instagram"} />
                                            </a> : ''
                                    }

                                    {
                                        data.youtube ?
                                            <a href={data.youtube} target="_blank">
                                                <i className={"fab fa-youtube"} />
                                                <i className={"fab fa-youtube"} />
                                            </a> : ''
                                    }

                                    {
                                        data.vine ?
                                            <a href={data.vine} target="_blank">
                                                <i className={"fab fa-vine"} />
                                                <i className={"fab fa-vine"} />
                                            </a> : ''
                                    }





                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-6 col-lg-3 res-margin">
                            {/* Footer Items */}
                            <div className="footer-items">
                                {/* Footer Title */}
                                <h4 className="footer-title">{"Useful Links"}</h4>
                                <ul>
                                    <li><Link to="/explore-all">All NFTs</Link></li>
                                    <li><Link to="/how-it-works">How It Works</Link></li>
                                    <li><Link to="/create">Create</Link></li>
                                    <li><Link to="/privacy-and-terms">Privacy & Terms</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-12 col-sm-6 col-lg-3 res-margin">
                            {/* Footer Items */}
                            <div className="footer-items">
                                {/* Footer Title */}
                                <h4 className="footer-title">{"Community"}</h4>
                                <ul>
                                    <li><Link to="/help-center">Help Center</Link></li>
                                    <li><Link to="/contact">Contact</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-12 col-sm-6 col-lg-3">
                            {/* Footer Items */}
                            <div className="footer-items">
                                {/* Footer Title */}
                                <h4 className="footer-title">{"Subscribe Us"}</h4>
                                {/* Subscribe Form */}
                                <div className="subscribe-form d-flex align-items-center">
                                    <input type="email" className="form-control" placeholder="info@yourmail.com" />
                                    <button type="submit" className="btn"><i className="icon-paper-plane" /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Footer Bottom */}
            <div className="footer-bottom">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            {/* Copyright Area */}
                            <div className="copyright-area d-flex flex-wrap justify-content-center justify-content-sm-between text-center py-4">
                                {/* Copyright Left */}
                                <div className="copyright-left">©2021 {ENV.appName}, All Rights Reserved.</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

const mapStateToProps = state => ({
    error: state.error,
    settings: state.settings
});


export default connect(mapStateToProps, { getFooter })(Footer);