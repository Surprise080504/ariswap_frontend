import { toast } from "react-toastify";
import {
  GET_ERRORS,
  BEFORE_NFT,
  GET_NFTS,
  GET_NFT,
  UPSERT_NFT,
  NFTALL,
} from "../../redux/types";
import { ENV } from "./../../config/config";
import { emptyError } from "../../redux/shared/error/error.action";

export const beforeNFT = () => {
  return {
    type: BEFORE_NFT,
  };
};
export const upsertNFT =
  (type = "create", body, method = "POST") =>
  (dispatch) => {
    dispatch(emptyError());
    const url = `${ENV.url}/nfts/${type}`;

    fetch(url, {
      method,
      headers: {
        Authorization: ENV.Authorization,
        "x-auth-token": ENV.x_auth_token,
        "Access-Control-Allow-Origin": "*",
        "x-access-token":
          ENV.getUserKeys("accessToken") &&
          ENV.getUserKeys("accessToken").accessToken
            ? ENV.getUserKeys("accessToken").accessToken
            : "",
      },
      body,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success(data.message);
          dispatch({
            type: UPSERT_NFT,
            payload: data,
          });
        } else {
          toast.error(data.message);
          dispatch({
            type: GET_ERRORS,
            payload: data,
          });
        }
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          const { data } = error.response;
          if (data.message) toast.error(data.message);
        }
        dispatch({
          type: GET_ERRORS,
          payload: error,
        });
      });
  };

export const getNFTs =
  (qs = "") =>
  (dispatch) => {
    dispatch(emptyError());
    let url = `${ENV.url}nfts/list`;
    if (qs) url += `?${qs}`;

    fetch(url, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: ENV.Authorization,
        "x-auth-token": ENV.x_auth_token,
        "Access-Control-Allow-Origin": "*",
        "x-access-token":
          ENV.getUserKeys("accessToken") &&
          ENV.getUserKeys("accessToken").accessToken
            ? ENV.getUserKeys("accessToken").accessToken
            : "",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data,"check data if ");
        if (data.success) {
          console.log("allData", data.data.allData);
          //change to data.data first dispatch
          dispatch({
            type: GET_NFTS,
            payload: data.data.allData,
          });
          dispatch({
            type: NFTALL,
            payload: data.data.allData,
          });
        } else {
          dispatch({
            type: GET_ERRORS,
            payload: data,
          });
        }
      })
      .catch((errors) => {
        dispatch({
          type: GET_ERRORS,
          payload: errors,
        });
      });
  };

export const getMyNFT = async (postData) => {
  let url = `${ENV.url}nfts/myNFT`;
  try {
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          Authorization: ENV.Authorization,
          "x-auth-token": ENV.x_auth_token,
          "Access-Control-Allow-Origin": "*",
          "x-access-token":
            ENV.getUserKeys("accessToken") &&
            ENV.getUserKeys("accessToken").accessToken
              ? ENV.getUserKeys("accessToken").accessToken
              : "",
        },
        body: JSON.stringify(postData),
      })
        .then((res) => res.json())
        .then((data) => {
          resolve(data);
        });
    });
  } catch (e) {
    return null;
  }
};

export const getNFT = (nftId) => (dispatch) => {
  dispatch(emptyError());
  const url = `${ENV.url}nfts/get/${nftId}`;

  fetch(url, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: ENV.Authorization,
      "x-auth-token": ENV.x_auth_token,
      "Access-Control-Allow-Origin": "*",
      "x-access-token":
        ENV.getUserKeys("accessToken") &&
        ENV.getUserKeys("accessToken").accessToken
          ? ENV.getUserKeys("accessToken").accessToken
          : "",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      // console.log(data,"checking data of nft==>single");
      // alert("called")
      if (data.success) {
        dispatch({
          type: NFTALL,
          payload: data.allData,
        });
        dispatch({
          type: GET_NFT,
          payload: data.nft,
        });
      } else {
        dispatch({
          type: GET_ERRORS,
          payload: data,
        });
      }
    })
    .catch((errors) => {
      dispatch({
        type: GET_ERRORS,
        payload: errors,
      });
    });
};
