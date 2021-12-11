import React, {
  useState,
  useEffect,
} from "react";
import {
  Container,
  Row,
  Col,
  Nav,
} from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import { connect } from "react-redux";
import {
  beforeNFT,
  getNFT,
  upsertNFT,
} from "./nfts.action";
import FullPageLoader from "../../components/full-page-loader/full-page-loader";
import NFTPreview from "../nft-preview/nft-preview";
import { decimalNumberValidator } from "../../utils/functions";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
import moment from "moment";
import currencyIcon from "../../assets/images/binance.svg";
import { ENV } from "../../config/config";
import {openNFTForBidding} from '../../utils/web3';
import {SellOnFixedPrice} from '../../utils/web3'
import { toast } from "react-toastify";
const {
  currencies,
  dateRangeInitialSettings,
  serviceFee,
} = ENV;

const config1 = {
  price: {
    currency: ENV.currency,
    amount: "",
  },
  listingSchedule: {
    startDate: moment(),
    endDate: moment().add(6, "months"),
    startTime: moment(new Date()).format("HH:mm"),
    endTime: "23:59",
  },
  reserveFor: "", // if user selects reserve buyer
};
const config2 = {
  method: 1, // 1 = Sell to the highest bidder or 2 = Sell with the declining price
  startPrice: {
    currency: ENV.currency,
    amount: "",
  },
  duration: {
    startDate: moment(),
    endDate: moment().add(6, "months"),
    startTime: moment(new Date()).format("HH:mm"),
    endTime: "23:59",
  },
  // if user includes reserve price
  reservePrice: {
    currency: ENV.currency,
    amount: "",
  },
};

const SellNFT = (props) => {
  const [sellingMethod, setSellingMethod] =
    useState(1); // 1 = Fixed Price, 2 = Timed Auction
  const [fixedPriceConfig, setFixedPriceConfig] =
    useState(config1);
  const [
    timedAuctionConfig,
    setTimedAuctionConfig,
  ] = useState(config2);
  const [nft, setNft] = useState(null);
  const [loader, setLoader] = useState(true); // NFT loader
  const [reserveBuyer, setReserveBuyer] =
    useState(false);
  const [reservePrice, setReservePrice] =
    useState(false);
    const [tokensData,setTokensData]=useState([])

  useEffect(() => {
    window.scroll(0, 0);
    const { itemId } = props.match.params;
    if (itemId) props.getNFT(window.atob(itemId));
    else props.history.push("/explore-all");
    getTokens()
  }, []);

  // when NFT data is received
  useEffect(() => {
    if (props.nft.nftsAuth) {
      const nft = props.nft.nftsData;
      setNft(nft);
      setLoader(false);
      props.beforeNFT();
    }
  }, [props.nft.nftsAuth]);

  // when NFT data is updated
  useEffect(() => {
    if (props.nft.upsertAuth) {
      const { nft } = props.nft.nftsData;
      const pathname = nft.sellingMethod === 1 ? '/explore-all' : '/auctions'
      setLoader(false);
      props.beforeNFT();
      props.history.push(pathname);
    }
  }, [props.nft.upsertAuth]);

  // when an error is received
  useEffect(() => {
    setLoader(false);
  }, [props.error]);

  const onChange = (e) => {
    const { name, value } = e.target;
    let data = null;
    if (sellingMethod === 1)
      data = fixedPriceConfig;
    else data = timedAuctionConfig;

    const keys = name.split("."); // fixedPriceConfig, price, currency
    if (keys && keys[2])
      data[keys[1]][keys[2]] = value;
    else if (keys && keys[1])
      data[keys[1]] = value;

    if (sellingMethod === 1)
      setFixedPriceConfig({ ...data });
    else setTimedAuctionConfig({ ...data });
  };

  const handleDateChange = (e, picker) => {
    const { name } = e.target;
    const { startDate, endDate } = picker;

    // set start date
    onChange({
      target: {
        name: `${name}.startDate`,
        value: startDate,
      },
    });

    // set end date
    onChange({
      target: {
        name: `${name}.endDate`,
        value: endDate,
      },
    });
  };

  const submit = () => {
 
    const payload = {
      _id: nft._id,
      sellingMethod,
      sellingConfig: JSON.stringify(
        sellingMethod === 1
          ? fixedPriceConfig
          : timedAuctionConfig
      ),
    };
 

    let test=new Date(timedAuctionConfig.duration.endDate).getTime()
    let time=timedAuctionConfig.duration.endTime

var r = Number(time.split(':')[0])*60+Number(time.split(':')[1])*1000;
// 
  const timeInMiliSeconds=r+test;
 
  // console.log('yoken data', tokensData)
  const nftToken=tokensData.data.find((item)=>item?.nftId===nft?._id)

   if(nftToken){
    sellingMethod==1?SellOnFixedPrice(nftToken?.nftToken,fixedPriceConfig.price.amount):openNFTForBidding(nftToken.nftToken,timeInMiliSeconds)

    setLoader(true);

    var formData = new FormData();
    for (const key in payload)
      formData.append(key, payload[key]);

    props.upsertNFT("edit", formData, "PUT");
   }
   else {
    toast.error("there was an issue while creating nft, please try later")
   }
 
  };


  const getTokens=()=>{
    const url= process.env.REACT_APP_BASE_URL + 'nftTokens/tokens' 
  
  fetch(url, {
   method: 'GET',
   headers: {
      'content-type': 'application/json',
      'Authorization': ENV.Authorization,
      'x-auth-token': ENV.x_auth_token,
      'Access-Control-Allow-Origin': '*',
      'x-access-token': ENV.getUserKeys('accessToken') && ENV.getUserKeys('accessToken').accessToken ? ENV.getUserKeys('accessToken').accessToken : ''
  },

}).then(res => res.json()).then(data => {

  setTokensData(data)

  
}).catch(error => {
  
  console.log(error,"error in catch blcok")
  

})

  }

  return (
    <div className="padding-wrapper">
      {loader && <FullPageLoader />}
      <div
        className=""
        style={{
          maxWidth: "85%",
          margin: "auto",
        }}
      >
        <div className="d-flex">
          <div className="tabs-container">
            <span className="head-wrapper">
              List of Bundle for Sale
            </span>
            <div className="market-tabs-wrapper">
              <Tab.Container
                id="marketplace-tabs"
                defaultActiveKey="fixedPrice"
              >
                <Row>
                  <Col
                    lg="12"
                    md="12"
                    sm="12"
                    xs="12"
                  >
                    <Nav
                      variant="pills"
                      className="flex-row"
                    >
                      <Nav.Item className="nav-item-wrapper">
                        <div className="mb-2">
                          Type
                        </div>
                        <Nav.Link
                          eventKey="fixedPrice"
                          onClick={() =>
                            setSellingMethod(1)
                          }
                        >
                          <i className="fas fa-dollar-sign" />
                          <div>Fixed Price</div>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item className="nav-item-wrapper">
                        <div className="text-right mr-4 mb-2">
                          <i className="fas fa-exclamation-circle ml-2" />
                        </div>
                        <Nav.Link
                          eventKey="timedAuction"
                          onClick={() =>
                            setSellingMethod(2)
                          }
                        >
                          <i className="fas fa-clock" />
                          <div>Timed Auction</div>
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Col>
                </Row>
                <div className="market-tab-content">
                  <Container fluid>
                    <Tab.Content>
                      <Tab.Pane eventKey="fixedPrice">
                        <div className="price-wrapper d-flex">
                          <div className="price-text position-relative">
                            <div className="text-white mb-2 absolute-wrapper">
                              <b>Price</b>
                            </div>
                            <div className="text-right mb-2">
                              <i className="fas fa-exclamation-circle ml-2" />
                            </div>
                            <div className="d-flex">
                              <button
                                type="button"
                                className="ethereum-btn"
                              >
                                <svg
                                  viewBox="0 0 126.61 126.61"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  height="18"
                                  width="18"
                                >
                                  <g>
                                    <path d="m38.73 53.2 24.59-24.58 24.6 24.6 14.3-14.31-38.9-38.91-38.9 38.9z" />
                                    <path d="m0 63.31 14.3-14.31 14.31 14.31-14.31 14.3z" />
                                    <path d="m38.73 73.41 24.59 24.59 24.6-24.6 14.31 14.29-38.9 38.91-38.91-38.88z" />
                                    <path d="m98 63.31 14.3-14.31 14.31 14.3-14.31 14.32z" />
                                    <path d="m77.83 63.3-14.51-14.52-10.73 10.73-1.24 1.23-2.54 2.54 14.51 14.5 14.51-14.47z" />
                                  </g>
                                </svg>
                                <span className="ml-2">
                                  {ENV.currency}
                                </span>
                              </button>
                              <input
                                type="text"
                                name="fixedPriceConfig.price.amount"
                                placeholder="Amount"
                                className="amount-btn ml-3"
                                style={{
                                  borderRadius:
                                    "4px",
                                }}
                                onChange={(e) =>
                                  onChange(e)
                                }
                                onKeyDown={(e) =>
                                  decimalNumberValidator(
                                    e
                                  )
                                }
                                defaultValue={
                                  fixedPriceConfig
                                    .price.amount
                                }
                                required
                              />
                              {/* <div className="text-right mb-2 dollar-wrapper">
                                $ 0.00
                              </div> */}
                            </div>
                          </div>
                        </div>
                        <div className="price-wrapper d-flex">
                          <div className="price-text">
                            <div className="text-white">
                              <b>
                                Schedule Listing
                              </b>
                            </div>
                            <div className="date-picker">
                              <DateRangePicker
                                initialSettings={
                                  dateRangeInitialSettings
                                }
                                onApply={
                                  handleDateChange
                                }
                              >
                                <button
                                  name="fixedPriceConfig.listingSchedule"
                                  className="calender-btn"
                                >

                                  {fixedPriceConfig.listingSchedule.startDate.format(
                                    "MMMM D, YYYY"
                                  )}{" "}
                                  -{" "}
                                  {fixedPriceConfig.listingSchedule.endDate.format(
                                    "MMMM D, YYYY"
                                  )}
                                  &nbsp;&nbsp;&nbsp;
                                  <i className="fas fa-calendar-week" />
                                </button>
                              </DateRangePicker>
                            </div>

                            <div className="row">
                              <div className="mr-auto my-3 budle-wrapper">
                                <input
                                  type="time"
                                  name="fixedPriceConfig.listingSchedule.startTime"
                                  placeholder="Start Time"
                                  onChange={(e) =>
                                    onChange(e)
                                  }
                                  defaultValue={
                                    fixedPriceConfig
                                      .listingSchedule
                                      .startTime
                                  }
                                  required
                                />
                              </div>

                              <div className="ml-auto my-3 budle-wrapper">
                                <input
                                  type="time"
                                  name="fixedPriceConfig.listingSchedule.endTime"
                                  placeholder="End Time"
                                  onChange={(e) =>
                                    onChange(e)
                                  }
                                  defaultValue={
                                    fixedPriceConfig
                                      .listingSchedule
                                      .endTime
                                  }
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <div className="price-wrapper d-flex">
                          <div className="price-text">
                            <div className="text-white">
                              <b>
                                Reserve for
                                specific buyer
                              </b>
                            </div>
                          </div>
                          <div>
                            <label className="switch">
                              <input
                                type="checkbox"
                                checked={
                                  reserveBuyer
                                }
                                onChange={() =>
                                  setReserveBuyer(
                                    !reserveBuyer
                                  )
                                }
                              />
                              <span className="slider round"></span>
                            </label>
                          </div>
                        </div> */}
                        {reserveBuyer && (
                          <div
                            className="mb-3 budle-wrapper"
                            style={{
                              borderBottom:
                                "1px solid",
                              paddingBottom:
                                "2rem",
                            }}
                          >
                            <span>
                              <input
                                type="text"
                                placeholder="0xf45a189..."
                                required
                                defaultValue={
                                  fixedPriceConfig.reserveFor
                                }
                                onChange={(e) =>
                                  onChange(e)
                                }
                                name="fixedPriceConfig.reserveFor"
                              />
                            </span>
                          </div>
                        )}
                      </Tab.Pane>
                      <Tab.Pane eventKey="timedAuction">
                        <div className="form-group">
                          <label
                            htmlFor="method"
                            className="text-white mb-2"
                          >
                            <b>Method</b>
                          </label>
                          <select
                            className="form-control"
                            id="timed-auction-method"
                            name="timedAuctionConfig.method"
                            onChange={(e) =>
                              onChange(e)
                            }
                          >
                            <option value={1}>
                              Sell to the highest
                              bidder
                            </option>
                            {/* <option value={2}>
                              Sell with the
                              declining price
                            </option> */}
                          </select>
                        </div>

                        <div className="price-wrapper d-flex">
                          <div className="price-text position-relative">
                            <div className="text-white mb-2 absolute-wrapper">
                              <b>
                                Starting Price
                              </b>
                            </div>
                            <div className="text-right mb-2">
                              <i className="fas fa-exclamation-circle ml-2" />
                            </div>
                            <div className="d-flex">
                              <button
                                type="button"
                                className="ethereum-btn"
                              >
                                <svg
                                  viewBox="0 0 126.61 126.61"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="currentColor"
                                  height="18"
                                  width="18"
                                >
                                  <g>
                                    <path d="m38.73 53.2 24.59-24.58 24.6 24.6 14.3-14.31-38.9-38.91-38.9 38.9z" />
                                    <path d="m0 63.31 14.3-14.31 14.31 14.31-14.31 14.3z" />
                                    <path d="m38.73 73.41 24.59 24.59 24.6-24.6 14.31 14.29-38.9 38.91-38.91-38.88z" />
                                    <path d="m98 63.31 14.3-14.31 14.31 14.3-14.31 14.32z" />
                                    <path d="m77.83 63.3-14.51-14.52-10.73 10.73-1.24 1.23-2.54 2.54 14.51 14.5 14.51-14.47z" />
                                  </g>
                                </svg>
                                <span className="ml-2">
                                  {ENV.currency}
                                </span>
                              </button>
                              <input
                                type="text"
                                name="timedAuctionConfig.startPrice.amount"
                                placeholder="Amount"
                                className="amount-btn ml-3"
                                style={{
                                  borderRadius:
                                    "4px",
                                }}
                                onChange={(e) =>
                                  onChange(e)
                                }
                                onKeyDown={(e) =>
                                  decimalNumberValidator(
                                    e
                                  )
                                }
                                defaultValue={
                                  timedAuctionConfig
                                    .startPrice
                                    .amount
                                }
                                required
                              />
                              {/* <div className="text-right mb-2 dollar-wrapper">
                                $ 0.00
                              </div> */}
                            </div>
                          </div>
                        </div>
                        <div className="price-wrapper d-flex">
                          <div className="price-text">
                            <div className="text-white">
                              <b>Duration</b>
                            </div>
                            <div className="date-picker">
                              <DateRangePicker
                                initialSettings={
                                  dateRangeInitialSettings
                                }
                                onApply={
                                  handleDateChange
                                }
                              >
                                <button
                                  name="timedAuctionConfig.duration"
                                  className="calender-btn"
                                >
                                  <i className="fas fa-calendar-week" />
                                  &nbsp;&nbsp;&nbsp;
                                  {timedAuctionConfig.duration.startDate.format(
                                    "MMMM D, YYYY"
                                  )}{" "}
                                  -{" "}
                                  {timedAuctionConfig.duration.endDate.format(
                                    "MMMM D, YYYY"
                                  )}
                                </button>
                              </DateRangePicker>
                            </div>

                            <div className="row">
                              <div className="mr-auto my-3 budle-wrapper">
                                <input
                                  type="time"
                                  name="timedAuctionConfig.duration.startTime"
                                  placeholder="Start Time"
                                  onChange={(e) =>
                                    onChange(e)
                                  }
                                  defaultValue={
                                    timedAuctionConfig
                                      .duration
                                      .startTime
                                  }
                                  required
                                />
                              </div>

                              <div className="ml-auto my-3 budle-wrapper">
                                <input
                                  type="time"
                                  name="timedAuctionConfig.duration.endTime"
                                  placeholder="End Time"
                                  onChange={(e) =>
                                    onChange(e)
                                  }
                                  defaultValue={
                                    timedAuctionConfig
                                      .duration
                                      .endTime
                                  }
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* <div className="reverse-price d-flex">
                          <div className="price-text">
                            <div className="text-white">
                              <b>
                                Include reserve
                                price
                              </b>
                            </div>
                          </div>
                          <div>
                            <label className="switch">
                              <input
                                type="checkbox"
                                checked={
                                  reservePrice
                                }
                                onChange={() =>
                                  setReservePrice(
                                    !reservePrice
                                  )
                                }
                              />
                              <span className="slider round"></span>
                            </label>
                          </div>
                        </div> */}
                        {reservePrice && (
                          <div className="d-flex">
                            <button
                              type="button"
                              className="ethereum-btn"
                            >
                              <svg
                                viewBox="0 0 126.61 126.61"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                height="18"
                                width="18"
                              >
                                <g>
                                  <path d="m38.73 53.2 24.59-24.58 24.6 24.6 14.3-14.31-38.9-38.91-38.9 38.9z" />
                                  <path d="m0 63.31 14.3-14.31 14.31 14.31-14.31 14.3z" />
                                  <path d="m38.73 73.41 24.59 24.59 24.6-24.6 14.31 14.29-38.9 38.91-38.91-38.88z" />
                                  <path d="m98 63.31 14.3-14.31 14.31 14.3-14.31 14.32z" />
                                  <path d="m77.83 63.3-14.51-14.52-10.73 10.73-1.24 1.23-2.54 2.54 14.51 14.5 14.51-14.47z" />
                                </g>
                              </svg>
                              <span className="ml-2">
                                {ENV.currency}
                              </span>
                            </button>
                            <input
                              type="text"
                              name="timedAuctionConfig.reservePrice.amount"
                              placeholder="Amount"
                              className="amount-btn ml-3"
                              style={{
                                borderRadius:
                                  "4px",
                              }}
                              onChange={(e) =>
                                onChange(e)
                              }
                              onKeyDown={(e) =>
                                decimalNumberValidator(
                                  e
                                )
                              }
                              defaultValue={
                                timedAuctionConfig
                                  .reservePrice
                                  .amount
                              }
                              required
                            />
                            {/* <div className="text-right mb-2 dollar-wrapper">
                              $ 0.00
                            </div> */}
                          </div>
                        )}
                      </Tab.Pane>
                    </Tab.Content>

                    <div className="d-flex justify-content-between my-3 text-white">
                      <div>
                        <b>Fees</b>
                      </div>
                      <div>
                        <i className="fas fa-exclamation-circle" />
                      </div>
                    </div>
                    <div className="d-flex justify-content-between text-white mb-4">
                      <div>Service Fee</div>
                      <div>{serviceFee}%</div>
                    </div>
                    <div className="d-flex justify-content-between text-white mb-4">
                      <div>Creator Royalty</div>
                      <div>
                        {nft?.royalty || 0}%
                      </div>
                    </div>

                    <button
                      className="complete-listing-btn p-3"
                      onClick={() => submit()}
                    >
                      Complete Listing
                    </button>
                  </Container>
                </div>
              </Tab.Container>
            </div>
          </div>
          <div className="summary-container">
            {nft && <NFTPreview {...nft} />}
            {/* IMPORTED NFT PREVIEW SO THIS CODE IS NOT NEEDED ANYMORE */}
            {/* <div className="d-flex justify-content-center align-items-center">
              <img src="img/auction_1.jpg" className="img-fluid" style={{ height: "250px", width: "300px" }} />
            </div>
            <div className="pt-3 pb-3">
              <div className="d-flex justify-content-between text-white pb-2">
                <div>WannaPanda - PnPIbqI9ZF</div>
                <div>Price</div>
              </div>
              <div className="d-flex justify-content-between text-white pb-2">
                <div>1</div>
                <div><i className="fab fa-ethereum" />0</div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  nft: state.nft,
  error: state.error,
});

export default connect(mapStateToProps, {
  beforeNFT,
  getNFT,
  upsertNFT,
})(SellNFT);
