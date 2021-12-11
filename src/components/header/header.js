import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { setWalletAddress, getWalletAddress } from '../wallet/wallet.action'
import { connectMetamaskCopy } from '../../utils/web3'
import { logoutUser } from '../user/user.action';
import { ENV } from './../../config/config';

const Header = (props) => {
    const history = useHistory();
    // console.log("history", history);
    const [connectedAddress, setConnectedAddress] = useState('');
    const [loader, setLoader] = useState(true);
    const { _id } = ENV.getUserKeys('_id');

    useEffect(async () => {
        // COMMENTED TEMPORARILY
        // METHOD 1
        // props.getWalletAddress()

        // METHOD 2 - a
        // let connectedAddress = await connectMetamask();
        // setConnectedAddress(connectedAddress)

        // METHOD 3
        // if (localStorage.getItem('wa')) {
        //     let connectedAddress = window.atob(localStorage.getItem('wa'))
        //     setConnectedAddress(connectedAddress)
        // }

        // METHOD 4
        let connectedAddress = await connectMetamaskCopy();
        setConnectedAddress(connectedAddress)
        props.setWalletAddress(connectedAddress)
    }, [])

    // set loader to false when address is received
    useEffect(() => {
        if (connectedAddress)
            setLoader(false)
    }, [connectedAddress])

    // COMMENTED TEMPORARILY
    // METHOD 2 - b
    // useEffect(() => {
    //     if (props.wallet.walletAuth) {
    //         const { connectedAddress } = props.wallet
    //         setConnectedAddress(connectedAddress)
    //     }
    // }, [props.wallet.walletAuth])
    const formatAddress = (address) => {
        return address ? address.substr(0, 6) + '...' + address.substr(-4) : null;
    }
    const logoutUser = () => {
        props.logoutUser();
        history.push('/login');
    }
    
    return (
        <header id="header">
            {/* Navbar */}
            <nav data-aos="zoom-out" data-aos-delay={800} className="navbar navbar-expand">
                <div className="container header">
                    {/* Navbar Brand*/}
                    <Link className="navbar-brand" to="/">
                        <img className="navbar-brand-sticky" src="/img/new_logo.jpeg" alt="sticky brand-logo" />
                    </Link>
                    <div className="ml-auto" />
                    {/* Navbar */}
                    <ul className="navbar-nav items mx-auto">
                        <li className="nav-item dropdown">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link">Explore <i className="fas fa-angle-down ml-1" /></a>
                            <ul className="dropdown-menu">
                                <li className="nav-item"><Link to="/explore-all" className="nav-link">Explore</Link></li>
                                <li className="nav-item"><Link to="/auctions" className="nav-link">Live Auctions</Link></li>
                                {/* <li className="nav-item"><Link to="/item-details" className="nav-link">Item Details</Link></li> */}
                            </ul>
                        </li>
                        <li className="nav-item">
                            <Link to="/activity" className="nav-link">Activity</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/collections" className="nav-link">Collections</Link>
                        </li>
                        {/* <li className="nav-item dropdown">
                            <a className="nav-link" href="#">Community <i className="fas fa-angle-down ml-1" /></a>
                            <ul className="dropdown-menu">
                                <li className="nav-item"><a href="/blog" className="nav-link">Blog</a></li>
                                <li className="nav-item"><a href="/blog-single" className="nav-link">Blog Single</a></li>
                                <li className="nav-item"><a href="/help-center" className="nav-link">Help Center</a></li>
                            </ul>
                        </li> */}
                        {/* <li className="nav-item dropdown">
                            <a className="nav-link" href="#">Pages <i className="fas fa-angle-down ml-1" /></a>
                            <ul className="dropdown-menu">
                                <li className="nav-item"><a href="/authors" className="nav-link">Authors</a></li>
                                <li className="nav-item"><a href="/author" className="nav-link">Author</a></li>
                                <li className="nav-item"><a href="/wallet-connect" className="nav-link">Wallet Connect</a></li>
                                <li className="nav-item"><a href="/create" className="nav-link">Create</a></li>
                                <li className="nav-item"><a href="/login" className="nav-link">Login</a></li>
                                <li className="nav-item"><a href="/signup" className="nav-link">Signup</a></li>
                            </ul>
                        </li> */}
                        <li className="nav-item">
                            <Link to="/contact" className="nav-link">Contact</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/history" className="nav-link">History</Link>
                        </li>
                    </ul>
                    {/* Navbar Icons */}
                    <ul className="navbar-nav icons">
                        <li className="nav-item">
                            <a href="#" className="nav-link" data-toggle="modal" data-target="#search">
                                <i className="fas fa-search" />
                            </a>
                        </li>
                    </ul>
                    {/* Navbar Toggler */}
                    <ul className="navbar-nav toggle">
                        <li className="nav-item">
                            <a href="#" className="nav-link" data-toggle="modal" data-target="#menu">
                                <i className="fas fa-bars toggle-icon m-0" />
                            </a>
                        </li>
                    </ul>
                    {/* Navbar Action Button */}
                    <ul className="navbar-nav action">
                        <li className="nav-item ml-3">
                            {
                                connectedAddress && _id ?
                                    <button className="btn ml-lg-auto btn-bordered-white" onClick={logoutUser}><i className="icon-logout mr-md-2" /> Logout</button>
                                    // <span id="wallet-address" className="btn ml-lg-auto btn-bordered-white"><i className="icon-wallet mr-md-2" />{formatAddress(connectedAddress)}</span>
                                    :
                                    <Link to="/login" id="wallet-address" className="btn ml-lg-auto btn-bordered-white"><i className="icon-wallet mr-md-2" />Login</Link>
                            }

                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
};

const mapStateToProps = state => ({
    wallet: state.wallet
});
export default connect(mapStateToProps, { setWalletAddress, getWalletAddress, logoutUser })(Header);
