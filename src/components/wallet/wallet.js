import React, { useState, useEffect } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import validator from 'validator'
import { connect } from 'react-redux';
import { connectMetamaskCopy, signRequest } from '../../utils/web3'
import { beforeWallet, setWalletAddress } from '../wallet/wallet.action';
import { toast } from 'react-toastify';
// import { getCollections } from '../collections/collections.actions'
import { ENV } from '../../config/config';
import { login, signup } from '../user/user.action';

const Wallet = (props) => {
    const history = useHistory();
    const [connectedAddress, setConnectedAddress] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showSignUp, setShowSignUp] = useState(false);
    const [showSignUpComponent, setShowSignUpComponent] = useState(false);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');

    const connectMetamaskCall = async () => {
        let connectedAddress = await connectMetamaskCopy();
        setConnectedAddress(connectedAddress);
        setWalletAddress(connectedAddress);

    }

    useEffect(() => {
        if (props.error) {
            console.log('errors', props.error)
            
            setErrorMessage(props.error.message);
            if (props.error.notExist) {
                setShowSignUp(true);
            } else {
                setShowSignUp(false);
            }
        }
    }, [props.error]);

    useEffect(() => {
        // console.log("dskms;kdncksjdncksjdcnkjscnd", props.user.userAuth);
        if(props.collection.getAuth === true) {
            let collections = props.collection.collections;
            // console.log('collections',collections)
            const userId = ENV.getUserKeys('_id')._id;
            // console.log("userID", userId);
            let myCollections = collections.filter(el => el.userId === userId);
            // console.log("myCollections", myCollections);
            if(myCollections && myCollections.length > 0){
                history.push('/create')
            }
            else {
                history.push('/collection/create');
            }
        }
    }, [props.collection.getAuth])




    const signup = async (e) => {
        e.preventDefault();
        try {

            if (validator.isEmail(email)) {
                let sign = await signRequest();
                let payload = {
                    address: connectedAddress,
                    password: sign,
                    email: email,
                    username: username
                }
            props.signup(payload);
              } else {
                setErrorMessage('please enter valid email')
              }
           
        }
        catch(err){
        
            toast.error(err.message)
        }


    }

    const login = async () => {
        try {

            let sign = await signRequest();
            let payload = {
                address: connectedAddress,
                password: sign
            }
            props.login(payload);
        }
        catch(err){
         
            toast.error(err.message)
        }
   
    }

    const switchSignup = () => {
        setShowSignUpComponent(true);
    }

    // if (props.user.userAuth) {
    //     console.log("@@@@Collection-----@", collections);
    //     if(collections && collections.length>){
    //         console.log("In Upper")
    //         return <Redirect to="/create" />
    //     }
    //     else {
    //         console.log("In Down");
    //         return <Redirect to="/collection/create" />
    //     }
    // }

    return (
        <section className={!showSignUpComponent ? `wallet-connect-area` : `author-area`}>
            <div className="container">
                {
                    connectedAddress && !showSignUpComponent ?
                        <>
                            <div className="row justify-content-center">
                                <div className="col-12 col-md-8 col-lg-7">
                                    {/* Intro */}
                                    <div className="intro text-center">
                                        <span>Sign In</span>
                                        <h3 className="mt-3 mb-0">SignIn to your account</h3>
                                        {/* <p>Please select the wallet you want to connect to.</p> */}
                                    </div>
                                </div>
                            </div>
                            <div className="row justify-content-center items">
                                <div className="col-12 col-md-6 col-lg-4 item">
                                    <div className="card single-wallet">
                                        <span className="d-block text-center" href="/login">
                                            <h4 className="mb-0">Address</h4>
                                            <p id="connected-address">{connectedAddress}</p>
                                            {
                                                errorMessage && <p className="text-white">{errorMessage}</p>
                                            }
                                            <button className="btn w-100 mt-3 mt-sm-4" type="button" onClick={() => login()}>Sign In</button>
                                            {
                                                showSignUp && <button className="btn w-100 mt-3 mt-sm-4" type="button" onClick={() => switchSignup()}>Would you like to Signup?</button>
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </>
                        :
                        showSignUpComponent ?
                            <div className="row justify-content-center">
                                <div className="col-12 col-md-8 col-lg-7">
                                    {/* Intro */}
                                    <div className="intro text-center">
                                        <span>SIGNUP</span>
                                        <h3 className="mt-3 mb-0">Create an Account</h3>
                                        <p>Create the account with the address</p>
                                    </div>
                                    {/* Item Form */}
                                    <form className="item-form card no-hover" onSubmit={(e) => signup(e)}>
                                        <div className="row">
                                            {
                                                errorMessage && <p className="text-red">{errorMessage}</p>
                                            }
                                            <div className="col-12">
                                                <div className="form-group mt-3">
                                                    <input type="text" className="form-control" name="address" placeholder="Address" required="required" disabled={true} value={connectedAddress} />
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-group mt-3">
                                                    <input type="email" className="form-control" name="email" placeholder="Enter your Email" required="required" defaultValue={email} onChange={(e) => setEmail(e.target.value)} />
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-group mt-3">
                                                    <input type="text" className="form-control" name="username" placeholder="Enter your Username" required="required" defaultValue={username} onChange={(e) => setUsername(e.target.value)} />
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-group mt-3">
                                                    <div className="form-check form-check-inline">
                                                        <input className="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" defaultValue="option1" />
                                                        <label className="form-check-label" htmlFor="inlineRadio1">I agree to <a href="/privacy-and-terms">Privacy Policy</a></label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <button className="btn w-100 mt-3 mt-sm-4" type="submit">Sign Up</button>
                                            </div>
                                            {/* <div className="col-12">
                                        <span className="d-block text-center mt-4">Already have an account? <a href="/login">Login</a></span>
                                    </div> */}
                                        </div>
                                    </form>
                                </div>
                            </div>
                            :
                            <>
                                <div className="row justify-content-center">
                                    <div className="col-12 col-md-8 col-lg-7">
                                        {/* Intro */}
                                        <div className="intro text-center">
                                            <span>Wallet Connect</span>
                                            <h3 className="mt-3 mb-0">Connect your Wallet</h3>
                                            <p>Please select the wallet you want to connect to.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="row justify-content-center items">
                                    {
                                        errorMessage && <p className="text-white">{errorMessage}</p>
                                    }
                                    <div className="col-12 col-md-6 col-lg-4 item" onClick={() => connectMetamaskCall()}>
                                        {/* Single Wallet */}
                                        <div className="card single-wallet whole-hover">
                                            <span className="d-block text-center" href="/login">
                                                <img className="avatar-lg" src="/img/metamask2.png" alt="" />
                                                <h4 className="mb-0">MetaMask</h4>
                                                <p>A browser extension with great flexibility. The web's most popular wallet</p>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </>
                }
            </div>
        </section>
    );
}


const mapStateToProps = state => (
    {
        wallet: state.wallet,
        collection: state.collection,
        user: state.user,
        error: state.error
});

export default connect(mapStateToProps, { beforeWallet, setWalletAddress, login, signup })(Wallet);