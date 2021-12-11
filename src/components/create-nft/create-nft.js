import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import NFTPreview from "../nft-preview/nft-preview";
import {
  axiosPostFormData,
  decimalNumberValidator,
} from "./../../utils/functions";
import { createNft, getCeloPunkMetaData } from "./../../utils/web3";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ENV } from "../../config/config";
import $ from "jquery";
import SimpleReactValidator from "simple-react-validator";
import FullPageLoader from "../../components/full-page-loader/full-page-loader";
import {
  getCollections,
  beforeCollection,
} from "../collections/collections.actions";
import { getCurrentAddress } from "../../utils/web3";
import NftCard from "../collections/components/NftCard/NftCard";
import "./createNft.css";
import { getMyNFT } from "../nfts/nfts.action";
import { GET_NFTS, NFTALL } from "../../redux/types";
import UploadWidget from "./uploadWidget";

const placeholderImg = "";

const CreateNFT = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loader, setLoader] = useState(true);
  const [myNFT, setMyNFT] = useState([]);
  const [creators, setCreators] = useState([]);
  const [errors, setErrors] = useState("");
  const [nft, setNft] = useState({
    userId: ENV.getUserKeys("_id")._id,
    nftOwnerId: ENV.getUserKeys("_id")._id,
    image: "",
    name: "",
    description: "",
    currentPrice: "",
    royalty: "",
    size: "",
    copies: "",
    collectionId: "",
    ownerAddress: "",
    status: 1, // 1 = put on sale, 2 = instant sale price, 3 = unlock purchased
  });
  const [collections, setCollections] = useState(false);
  const validator = new SimpleReactValidator({
    autoForceUpdate: this,
    messages: {
      required: "This field is required.", // will override all messages
    },
  });
  const history = useHistory();
  const dispatch = useDispatch();

  const collectionReducer = useSelector((state) => state.collection);
  const nftReducer = useSelector((state) => state.nft);
  const userReducer = useSelector((state) => state.user);

  useEffect(async () => {
    if (!ENV.getUserKeys("_id")._id) {
      toast.error("Please login to create NFT");
      history.push("/");
      return;
    }
    setLoader(true);
    window.scroll(0, 0);
    await dispatch(getCollections());
    let ownerAddress = await getCurrentAddress();
    let tempNft = { ...nft, ownerAddress: ownerAddress };
    setNft(tempNft);
    const celoPunkMetaData = await getCeloPunkMetaData(ownerAddress);
    const data = await getMyNFT({
      userId: ENV.getUserKeys("_id")._id,
      celoPunkMetaData,
      ownerAddress,
    });
    if (data) {
      dispatch({
        type: GET_NFTS,
        payload: data.data.nfts,
      });
      dispatch({
        type: NFTALL,
        payload: data.data.nfts,
      });
    }
    console.log("data: ", data);
    setLoader(false);
    return () => {
      dispatch(beforeCollection());
    };
  }, []);

  useEffect(() => {
    if (collectionReducer.getAuth) {
      let myCollections = collectionReducer.collections.filter(
        (item) => item.userId === ENV.getUserKeys("_id")._id
      );
      if (!myCollections) {
        toast.info("Please add a collection first");
        history.push("/collection/create");
        return;
      }
      setCollections(myCollections);
    }
  }, [collectionReducer]);

  useEffect(() => {
    if (nftReducer.nftsAuth) {
      setMyNFT(nftReducer.nftsData);
    }
  }, [nftReducer]);

  useEffect(() => {
    if (userReducer.topSellersAuth) {
      setCreators(userReducer.sellers);
    }
  }, [userReducer]);

  const onFileChange = (e) => {
    let file = e.target.files[0];
    let fileId = e.target.id;
    if (file)
      if (file.type.includes("image")) {
        let tempNft = { ...nft, [e.target.name]: file };
        setNft(tempNft);
        let reader = new FileReader();
        reader.onload = function (e) {
          $(`#nft-${fileId}`).attr("src", e.target.result);
          $("#nft-image-label").html("File selected");
        };
        reader.readAsDataURL(file);
      } else {
        $(`#nft-${fileId}`).attr("src", placeholderImg);
        file = {};
      }
  };

  const onChange = (e, status = null) => {
    let { name, value } = e.target;
    if (status) value = status;
    let tempNft = { ...nft, [name]: value };
    setNft(tempNft);
  };

  const reset = async () => {
    let ownerAddress = await getCurrentAddress();
    let initNft = {
      userId: ENV.getUserKeys("_id")._id,
      image: "",
      name: "",
      description: "",
      currentPrice: "",
      royalty: "",
      size: "",
      copies: "",
      collectionId: "",
      ownerAddress: ownerAddress,
      status: 1, // 1 = put on sale, 2 = instant sale price, 3 = unlock purchased
    };
    setNft(initNft);
  };

  const submit = async (e) => {
    console.log("image: ", nft.image);
    e.preventDefault();
    setIsSubmitted(true);
    if (validator.allValid() && nft.collectionId) {
      setLoader(true);
      let formData = new FormData();
      for (const key in nft) {
        formData.append(key, nft[key]);
      }
      const res = await axiosPostFormData("nfts/create", formData, true);
      if (res.success) {
        reset();
        if (res.nft && res.nft.metaData) {
          await createNft(res.nft.metaData, res.nft._id);
          setLoader(true);
          setTimeout(() => {
            setLoader(false);
            history.push("/collections");
          }, 11000);
        }
      } else {
        setErrors(res.message);
        setLoader(false);
      }
    } else {
      validator.showMessages();
      setErrors("Please fill all required fields in valid format.");
      $("#create-nft").scrollTop(0, 0);
    }
  };

  return (
    <section className="author-area mt-5">
      <br />
      <br />
      {loader && <FullPageLoader />}
      <div className="container">
        <div className="row justify-content-between">
          <div className="col-12 col-md-4">
            <NFTPreview {...nft} />
          </div>
          <div className="col-12 col-md-7">
            <div className="mt-5 mt-lg-0 mb-1 mb-lg-1">
              {/* Intro */}
              <div className="intro">
                <div className="intro-content">
                  <span>Get Started</span>
                  <h3 className="mt-3 mb-0">Create Item</h3>
                </div>
              </div>
              {/* Form Error */}
              {isSubmitted && errors && (
                <div className="row">
                  <div className="col-12">
                    <span
                      id="create-nft-err"
                      className="form-error-msg text-danger"
                    >
                      {errors}
                    </span>
                  </div>
                </div>
              )}
            </div>
            {/* Item Form */}
            <form id="create-nft" className="item-form card no-hover">
              {/* onClick={(e) => submit(e)} */}
              <div className="row">
                <div className="col-12">
                  <div className="input-group form-group">
                    <div className="custom-file">
                      <input
                        type="file"
                        className="custom-file-input"
                        id="image"
                        accept=".png,.jpeg,.jpg"
                        onChange={(e) => onFileChange(e)}
                        name="image"
                      />
                      <label
                        id="nft-image-label"
                        className="custom-file-label"
                        htmlFor="image"
                      >
                        Choose file *
                      </label>
                    </div>
                    <span className="text-danger">
                      {validator.message("image", nft.image, "required")}
                    </span>
                  </div>
                </div>
                {/* <div className="col-12">
                  <div className="form-group mt-3">
                    <UploadWidget />
                  </div>
                </div> */}
                <div className="col-12">
                  <div className="form-group mt-3">
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      placeholder="Item Name *"
                      required="required"
                      onChange={(e) => onChange(e)}
                      defaultValue={nft.name}
                    />
                    <span className="text-danger">
                      {validator.message("name", nft.name, "required")}
                    </span>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <textarea
                      className="form-control"
                      name="description"
                      placeholder="Description *"
                      cols={30}
                      rows={3}
                      onChange={(e) => onChange(e)}
                      defaultValue={nft.description}
                    />
                    <span className="text-danger">
                      {validator.message(
                        "description",
                        nft.description,
                        "required"
                      )}
                    </span>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      name="currentPrice"
                      placeholder="Item Price *"
                      required="required"
                      onChange={(e) => onChange(e)}
                      onKeyDown={(e) => decimalNumberValidator(e)}
                      defaultValue={nft.currentPrice}
                    />
                    <span className="text-danger">
                      {validator.message(
                        "currentPrice",
                        nft.currentPrice,
                        "required"
                      )}
                    </span>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="form-group">
                    <input
                      type="number"
                      className="form-control"
                      min="0"
                      name="royalty"
                      placeholder="royality"
                      required="required"
                      onChange={(e) => onChange(e)}
                      defaultValue={nft.royalty}
                    />
                    <span className="text-danger">
                      {validator.message("royalty", nft.royalty, "required")}
                    </span>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="form-group">
                    <input
                      type="number"
                      className="form-control"
                      min="0"
                      name="size"
                      placeholder="Size"
                      required="required"
                      onChange={(e) => onChange(e)}
                      defaultValue={nft.size}
                    />
                    <span className="text-danger">
                      {validator.message("size", nft.size, "required")}
                    </span>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="form-group">
                    <input
                      type="number"
                      className="form-control"
                      min="0"
                      name="copies"
                      placeholder="No. of Copies *"
                      required="required"
                      onKeyDown={(e) => decimalNumberValidator(e)}
                      onChange={(e) => onChange(e)}
                      defaultValue={nft.copies}
                    />
                    <span className="text-danger">
                      {validator.message("copies", nft.copies, "required")}
                    </span>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group select-wrapper">
                    <label htmlFor="collection">Select Collection *</label>
                    <select
                      className="form-control select-after"
                      id="collection"
                      name="collectionId"
                      onChange={(e) => onChange(e)}
                    >
                      <option value="">Select Collection</option>
                      {collections &&
                        collections.map((collection, index) => {
                          return (
                            <option key={index} value={collection._id}>
                              {collection.name}
                            </option>
                          );
                        })}
                    </select>
                    <span className="text-danger">
                      {validator.message(
                        "collection",
                        nft.collectionId,
                        "required"
                      )}
                    </span>
                  </div>
                </div>
                <div className="col-12">
                  <button
                    disabled={loader}
                    className="btn w-100 mt-3 mt-sm-4"
                    type="button"
                    onClick={(e) => submit(e)}
                  >
                    Create Item
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <br />
        <br />
        <div className="row justify-content-between">
          {/* Intro */}
          <div className="col-12">
            <div className="intro">
              <div className="intro-content">
                <span>Explore my items</span>
                <h3 className="mt-3 mb-0">My Items</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="row justify-content-start">
          {myNFT &&
            myNFT.map((item, index) => {
              return (
                <div className="col-3 mt-5" key={index}>
                  <NftCard nft={item} creators={creators} />
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
};
export default CreateNFT;
