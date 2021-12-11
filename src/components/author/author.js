import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import AuthorProfile from "../author-profile/author-profile";
import Explore from "../explore/explore-all";
import { getUserById, beforeUser } from "./../user/user.action";
import FilterSearch from "../filter-search2/filtersearch2";
import { ENV } from "./../../config/config";

const Author = (props) => {
  const params = useParams();
  const [authorProfile, setAuthorProfile] = useState({});
  useEffect(() => {
    props.getUserById(params.authorId);
  }, []);
  useEffect(() => {
    if (props.user.individualUserAuth) {
      setAuthorProfile(props.user.individualUser);
      props.beforeUser();
    }
  }, [props.user.individualUserAuth]);
  return (
    <section
      className="author-area explore-area popular-collections-area"
      style={{ padding: "0px" }}
    >
      <div className="">
        <div className="d-flex author-detail-container">
          <div className="author-preview author-card">
            <div className="seller">
              <div className="seller-thumb avatar-lg">
                <img
                  className="rounded-circle"
                  src={props.profileImage ? props.profileImage : ENV.globalPlaceholderImage}
                  alt="User Profile"
                  style={{ height: "110px" }}
                />
              </div>
            </div>
          </div>
          <div className="card-caption p-0 text-center">
            <div className="card-body">
              <h5 className="mb-3">{authorProfile.username}</h5>
              <p className="my-3">{authorProfile.description}</p>
              <div className="input-group">
                <input type="text" className="form-control" placeholder="0x000000000000000000" readOnly value={authorProfile.address}
                  style={{
                    borderRadius: "100px",
                    backgroundColor: "transparent",
                    border: "2px solid",
                    height: "40px",
                    padding: "1.5rem",
                    boxShadow: "none",
                    outline: "none",

                  }}
                />
                <div className="input-group-append"
                  style={{
                    position: "absolute",
                    height: "100%",
                    top: "0",
                    right: "0",
                    borderRadius: "100px",
                    overflow: "hidden",
                  }}
                >
                  <button style={{
                    marginRight: "5px",
                    padding: "12px 16px",
                    backgroundColor: "transparent",
                    color: "#fff",
                    border: "0",
                    outline: "none",
                  }}><i className="icon-docs" /></button>
                </div>
              </div>
              <div className="social-icons d-flex justify-content-center my-3">
                {
                  authorProfile.facebookLink && <a className="facebook" href={authorProfile.facebookLink} target="_blank">
                    <i className="fab fa-facebook-f" />
                  </a>
                }
                {
                  authorProfile.twitterLink && <a className="twitter" href={authorProfile.twitterLink} target="_blank">
                    <i className="fab fa-twitter" />
                  </a>
                }
                {
                  authorProfile.gPlusLink && <a className="google-plus" href={authorProfile.gPlusLink} target="_blank">
                    <i className="fab fa-google-plus-g" />
                  </a>
                }
                {
                  authorProfile.vineLink && <a className="vine" href={authorProfile.vineLink} target="_blank">
                    <i className="fab fa-vine" />
                  </a>
                }
              </div>
              {
                props.followText &&
                <a className="btn btn-bordered-white btn-smaller" href="#">{props.followText}</a>
              }
            </div>
          </div>
          <div className="d-flex collection-wrapper">
            <FilterSearch />
            <div className="nfts-collection-wrapper w-100">
              <Explore />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const mapStateToProps = (state) => ({
  error: state.error,
  user: state.user,
});

export default connect(mapStateToProps, { getUserById, beforeUser })(Author);
