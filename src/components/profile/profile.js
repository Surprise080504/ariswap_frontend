import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import AuthorProfile from "../author-profile/author-profile"
import { SET_INDIVIDUAL_USER } from '../../redux/types';
import 'react-toastify/dist/ReactToastify.css'
import $ from 'jquery'
import SimpleReactValidator from 'simple-react-validator'
import {updateProfile, setIndividualUserData, beforeUser} from './../user/user.action';
import {signRequest} from './../../utils/web3';
import {ENV} from './../../config/config';
import { toast } from 'react-toastify';
import {useHistory} from 'react-router-dom'

const Profile = (props) => {
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [loader, setLoader] = useState(false)
    const [errors, setErrors] = useState('')
    const [connectedAddress, setConnectedAddress] = useState('')
    const [image, setImage] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [banner, setBannerImage] = useState('')
    const [bannerUrl, setBannerUrl] = useState('')
    const [address, setAddress] = useState('')
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [description, setDescription] = useState('')
    const [facebookLink, setFbLink] = useState('')
    const [twitterLink, setTwitterLink] = useState('')
    const [gPlusLink, setgPlusLink] = useState('')
    const [vineLink, setVineLink] = useState('')
    const [_id, setUserId] = useState('')
    const history=useHistory()
    let validator = new SimpleReactValidator({
        autoForceUpdate: this,
        messages: {
            required: 'This field is required.'  // will override all messages
        },
    })
    useEffect(()=>{
        let user = ENV.getUserKeys('');
        props.setIndividualUserData(user);
        setConnectedAddress( user.address ? user.address : '' );
        setAddress( user.address ? user.address : '');
        setEmail( user.email ? user.email : '' );
        setUserId( user._id ? user._id : '' );
        setDescription( user.description ? user.description : '' );
        setFbLink( user.facebookLink ? user.facebookLink : '' );
        setgPlusLink( user.gPlusLink ? user.gPlusLink : '' );
        setTwitterLink( user.twitterLink ? user.twitterLink : '' );
        setVineLink( user.vineLink ? user.vineLink : '' );
        setUsername( user.username ? user.username : '' );
        setImageUrl( user.profileImage ? user.profileImage : '' );
    }, []);

    useEffect(()=>{
        if (props.user.userAuth) {
            props.beforeUser();
            setLoader(false);
        }
    }, [props.user.userAuth]);

    useEffect(() => {
        if (props.error) {
            setErrors(props.error.message);
            goToTop();
        }
    }, [props.error]);

    const goToTop = () => {
        $('html, body').animate({
            scrollTop: 0
        }, 600)
    }

    const onFileChange = (e) => {
        let file = e.target.files[0];
        let fileURL = '';
        if (file) {
            if (file.type.includes('image')) {
                fileURL = URL.createObjectURL(file)
            } else {
                file = {};
                fileURL = '';
            }
            setImageUrl(fileURL);
            setImage(file);
        }
    }

    const onBannerChange = (e) => {
        let file = e.target.files[0];
        let fileURL = '';
        if (file) {
            if (file.type.includes('image')) {
                fileURL = URL.createObjectURL(file)
            } else {
                file = {};
                fileURL = '';
            }
            setBannerUrl(fileURL);
            setBannerImage(file);
        }
    }

    const submit = async (e) => {
        e.preventDefault();
        setErrors("");
        setIsSubmitted(true);
        let isFormValid = validator.allValid() ? true : false;
        if(isFormValid) {
            try {
                let signature = await signRequest();
                setLoader(true);
                var formData = new FormData();
                formData.append('profileImage', image)
                formData.append('bannerImage', banner)
                formData.append('description', description)
                formData.append('facebookLink', facebookLink)
                formData.append('twitterLink', twitterLink)
                formData.append('gPlusLink', gPlusLink)
                formData.append('vineLink', vineLink)
                formData.append('username', username)
                formData.append('signature', signature)
                props.updateProfile(formData);
            }
            catch (e) {

            }
            
        }
        else {
            validator.showMessages();
            setErrors('Please fill all required fields in valid format.');
            goToTop();
        }
    }
    if(!ENV.getUserKeys('_id')._id){
        toast.error("Please login to view profile")
        history.push('/')
           return " "
       }
       else {

    return (
        <section className="author-area">
            <div className="container">
                <div className="row justify-content-between">
                    <div className="col-12 col-md-4">
                        <AuthorProfile profileImage={imageUrl} username={username} description={description} address={connectedAddress} facebookLink={facebookLink} twitterLink={twitterLink} gPlusLink={gPlusLink} vineLink={vineLink} />
                    </div>
                    <div className="col-12 col-md-7">
                        <div className="mt-5 mt-lg-0 mb-4 mb-lg-5">
                            <div className="intro">
                                <div className="intro-content">
                                    <span>Your Profile</span>
                                    <h3 className="mt-3 mb-0">Update your profile</h3>
                                </div>
                            </div>
                        </div>
                        <form id="create-nft" className="item-form card no-hover">
                            {
                                isSubmitted && errors &&
                                <div className="row pb-2">
                                    <div className="col-12">
                                        <span id="create-nft-err" className="text-danger">{errors}</span>
                                    </div>
                                </div>
                            }
                            <div className="row">
                                <div className="col-12">
                                    <div className="input-group form-group">
                                        <div className="custom-file">
                                            <input type="file" className="custom-file-input" id="banner" accept=".png,.jpeg,.jpg" onChange={(e) => onBannerChange(e)} name="banner" />
                                            <label id="nft-imasge-label" className="custom-file-label" htmlFor="banner">
                                                {banner && banner.name ? banner.name : "Choose Banner Image"}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="input-group form-group">
                                        <div className="custom-file">
                                            <input type="file" className="custom-file-input" id="image" accept=".png,.jpeg,.jpg" onChange={(e) => onFileChange(e)} name="image" />
                                            <label id="nft-imasge-label" className="custom-file-label" htmlFor="image">
                                                {image && image.name ? image.name : "Choose Profile Picture"}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-group mt-3">
                                        <input type="text" className="form-control" name="address" placeholder="Wallet Address *" required="required" value={address} readOnly/>
                                        <span className="text-danger">{validator.message('address', address, 'required')}</span>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-group mt-3">
                                        <input type="text" className="form-control" name="email" placeholder="Email *" required="required" value={email} readOnly/>
                                        <span className="text-danger">{validator.message('email', email, 'required')}</span>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-group mt-3">
                                        <input type="text" className="form-control" name="username" placeholder="Username *" required="required" onChange={(e) => setUsername(e.target.value)} defaultValue={username} />
                                        <span className="text-danger">{validator.message('username', username, 'required')}</span>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-group">
                                        <textarea className="form-control" name="description" placeholder="About" cols={30} rows={3} onChange={(e) => setDescription(e.target.value)} defaultValue={description} />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-group">
                                        <input type="text" className="form-control" name="facebookLink" placeholder="Facebook Link" cols={30} rows={3} onChange={(e) => setFbLink(e.target.value)} defaultValue={facebookLink} />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-group">
                                        <input type="text" className="form-control" name="twitterLink" placeholder="Twitter Link" cols={30} rows={3} onChange={(e) => setTwitterLink(e.target.value)} defaultValue={twitterLink} />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-group">
                                        <input type="text" className="form-control" name="gPlusLink" placeholder="Google Plus Link" cols={30} rows={3} onChange={(e) => setgPlusLink(e.target.value)} defaultValue={gPlusLink} />
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="form-group">
                                        <input type="text" className="form-control" name="vineLink" placeholder="Vine Link" cols={30} rows={3} onChange={(e) => setVineLink(e.target.value)} defaultValue={vineLink} />
                                    </div>
                                </div>
                                
                                <div className="col-12">
                                    <button disabled={loader} className="btn w-100 mt-3 mt-sm-4" type="button" onClick={(e) => submit(e)}>Update Profile</button>
                                </div>
                            </div> 
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
                        }
}

const mapStateToProps = state => ({
    wallet: state.wallet,
    user: state.user,
    error: state.error
});

export default connect(mapStateToProps, { updateProfile, setIndividualUserData, beforeUser })(Profile);