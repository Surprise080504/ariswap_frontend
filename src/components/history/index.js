import React, { useEffect, useState, Fragment } from "react";
import { Table, Pagination } from "react-bootstrap";
import axios from 'axios';
import { toast } from "react-toastify";

import { ClaimFundsAfterBidding } from './../../utils/web3'
import { ENV } from "../../config/config";
import "./index.css";
import { useHistory } from "react-router";

// const BASE_URL = "http://localhost:5000/v1/front/";

const BASE_URL= process.env.REACT_APP_BASE_URL
// console.log('base url', BASE_URL)
const History = () => {
  const history=useHistory()
  const [list, setList] = useState([]);
  const [tokens, settokens] = useState([]);

  const getClaimableBids = () => {
    axios.get(`${BASE_URL}bid/claimableListbyUserId?userId=${ENV.getUserKeys("_id")._id}`)
            .then(res => {
             
                setList(res.data.data);
            });
}
const getTokens = () => {
    axios.get(`${BASE_URL}nftTokens/tokens`)
            .then(res => {
              
                settokens(res.data.data);
            });
}
  useEffect(()=>{
        getClaimableBids();
        getTokens();
    }, []);

    function  claimfunds(bid) {
 
        // toAddress

        const token = tokens.find(x => x.nftId === bid.nftId);
        ClaimFundsAfterBidding(token.nftToken).then(x => {
            axios.put(`${BASE_URL}bid/claimedBid?bidId=${bid._id}`)
            .then(res => {
                getClaimableBids();
            });
        });
    }
    if(!ENV.getUserKeys('_id')._id){
      toast.error("Please login to  view history")
      history.push('/')
         return " "
     }
     else {

  
  return (
    <Fragment>
      <div className="history-page">
        <div className="container">
          {/* <div className="claim-btn-wrap d-flex justify-content-end mb-3">
                    
                </div> */}
          <h3>History</h3>
          <div className="history-table-c table-dark">
            <Table className="mb-0" responsive bordered variant="dark">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Amount</th>
                  <th>Currency</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                { list?.allBids?.map( (item, index) => <tr>
                    <th>{index + 1}</th>
                  
                  <td>{item.price.amount}</td>
                  <td>{item.price.currency}</td>
                  <td>
                    <button class="btn btn-sm" onClick={() => claimfunds(item)}>Claim Funds</button>
                  </td>
                </tr>)}
              </tbody>
            </Table>
            <div className="pagination-wrap mt-4">
              <Pagination className="justify-content-center">
                <Pagination.Prev />
                <Pagination.Item>{1}</Pagination.Item>
                <Pagination.Item>{11}</Pagination.Item>
                <Pagination.Item className="active">{12}</Pagination.Item>
                <Pagination.Item>{13}</Pagination.Item>
                <Pagination.Next />
              </Pagination>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
                }
};

export default History;
