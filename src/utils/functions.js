import axios from "axios";
import { ENV } from "../config/config";
import { Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { emptyError } from "../redux/shared/error/error.action";
import {
  GET_ERRORS,
  BEFORE_BID,
  GET_BIDS,
  DELETE_BID,
  CREATE_BID,
  ACCEPT_BID,
} from "../redux/types";
let baseUrl = process.env.REACT_APP_BASE_URL;

export const axiosSyncPost = (url, data, isMultipart = false) => {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams();
    let keys = Object.keys(data);
    for (let x = 0; x < keys.length; x++) {
      params.append(keys[x], data[keys[x]]);
    }

    const config = {
      headers: {
        "Content-Type": isMultipart
          ? "multipart/form-data"
          : "application/x-www-form-urlencoded",
        Authorization: ENV.Authorization,
        "x-auth-token": ENV.x_auth_token,
        "x-access-token":
          ENV.getUserKeys("accessToken") &&
          ENV.getUserKeys("accessToken").accessToken
            ? ENV.getUserKeys("accessToken").accessToken
            : "",
      },
    };

    url = baseUrl + url;

    axios.post(url, params, config).then(
      (res) => {
        resolve(res.data);
      },
      (error) => {
        resolve(error);
      }
    );
  });
};

export const uploadFile = async (body, setPercentage) => {
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: ENV.Authorization,
        "x-auth-token": ENV.x_auth_token,
        "x-access-token":
          ENV.getUserKeys("accessToken") &&
          ENV.getUserKeys("accessToken").accessToken
            ? ENV.getUserKeys("accessToken").accessToken
            : "",
      },
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const percent = Math.floor((loaded * 100) / total);

        if (percent <= 100) {
          setPercentage(percent);
        }
      },
    };
    const { data } = await axios.post(ENV.url + "nfts/upload", body, config);

    return data;
  } catch (error) {
    console.log(error.message);
  }
};

export const axiosPostFormData = (url, body, isMultipart = false) => {
  return new Promise((resolve, reject) => {
    const config = {
      headers: {
        "Content-Type": isMultipart
          ? "multipart/form-data"
          : "application/json",
        Authorization: ENV.Authorization,
        "x-auth-token": ENV.x_auth_token,
        "x-access-token":
          ENV.getUserKeys("accessToken") &&
          ENV.getUserKeys("accessToken").accessToken
            ? ENV.getUserKeys("accessToken").accessToken
            : "",
      },
    };

    // url = testingURl + url;

    axios.post(ENV.url + url, body, config).then(
      (res) => {
        // console.log(res,"res success");
        resolve(res.data);
      },
      (error) => {
        console.log(error, "res error");
        resolve(error);
      }
    );
  });
};

export const decimalNumberValidator = (evt) => {
  let e = evt || window.event;

  // Allow: backspace, delete, tab, escape, enter and .
  const specialKeys = [46, 8, 9, 27, 13, 110];

  // Allow: Ctrl+A,Ctrl+C,Ctrl+V, Command+A
  if (
    specialKeys.includes(e.keyCode) ||
    // Allow: Ctrl+A,Ctrl+C,Ctrl+Z,Ctrl+X Command+A
    ((e.keyCode === 65 ||
      e.keyCode === 67 ||
      e.keyCode === 90 ||
      e.keyCode === 88) &&
      (e.ctrlKey === true || e.metaKey === true)) ||
    // Allow: home, end, left, right, down, up
    (e.keyCode >= 35 && e.keyCode <= 40)
  ) {
    // let it happen, don't do anything
    return;
  }

  let key = e.keyCode || e.which;
  if (
    !e.shiftKey &&
    !e.altKey &&
    !e.ctrlKey &&
    (key === 190 ||
      key === 110 ||
      (key >= 48 && key <= 57) ||
      (key >= 96 && key <= 105) ||
      key === 8 ||
      key === 9 ||
      key === 13 ||
      key === 35 ||
      key === 36 ||
      key === 37 ||
      key === 39 ||
      key === 46 ||
      key === 45)
  ) {
  } else {
    e.returnValue = false;
    if (e.preventDefault) e.preventDefault();
  }
};
export const setFixedPriceNftTOken = (body) => {
  let url = `${ENV.url}nftFixedTokens/getFixedtokens`;
  // let url = `http://3.142.91.8/v1/front/auctions/live`;

  // console.log(url,"url==>123")

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
    body: body,
  })
    .then((res) => res.json())
    .then((data) => {
      // console.log(data,"created nft token")
      if (data.success) {
      } else {
      }
    })
    .catch((errors) => {
      console.log(errors, "error");
    });
};

export const changeOwnerShip = (nftOwnerId, currentUserId) => {
  // alert("changing ownership")
  let url = `${ENV.url}nfts/editNft`;
  // console.log('fetch url', url)
  let body = {
    nftOwnerId,
    currentUserId,
  };
  fetch(url, {
    method: "PATCH",
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
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        toast.success("Successfully bought nft");
        window.location.href = "/explore-all";
      }
      // console.log(data,"response from the change ownershiop")
    })
    .catch((errors) => {
      console.log("error", errors);
    });
};
export const acceptBit = (tokenId, body) => {
  const url = `${ENV.url}bid/accept`;

  fetch(url, {
    method: "PUT",
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
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        // acceptNftOffer(tokenId,body);

        toast.success(data.message);
        window.location.href = "/explore-all";
        // dispatch({
        //     type: ACCEPT_BID,
        //     payload: data
        // })
      } else {
        toast.error(data.message);
      }
    })
    .catch((error) => {
      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.message) toast.error(data.message);
      }
    });
};

export const placeBidApi = (body) => {
  console.log("im here");

  const url = `${ENV.url}bid/create`;

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
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("data", data);
      if (data.success) {
        //    placeBidNft(body,tokenId,price,toAddress,fromAddress)

        toast.success(data.message);
        window.location.href = "/explore-all";
        // dispatch({
        //     type: CREATE_BID,
        //     payload: data
        // })
      } else {
        toast.error(data.message);
        // dispatch({
        //     type: GET_ERRORS,
        //     payload: data
        // })
      }
    })
    .catch((error) => {
      console.log("listing", error);
      if (error.response && error.response.data) {
        const { data } = error.response;
        if (data.message) toast.error(data.message);
      }
      // dispatch({
      //     type: GET_ERRORS,
      //     payload: error
      // })
    });
};
