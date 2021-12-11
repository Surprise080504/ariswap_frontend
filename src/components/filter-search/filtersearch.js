import React from 'react';
import Select from 'react-select'


const options = [
    { value: 'United States Dollar (USD)', label: '💲 United States Dollar (USD)' },
    { value: 'Ether (ETH)', label: '⧫ Ether (ETH)' },
  ]

function FilterSearch(props){
    return(
        <React.Fragment>
             <div className="filter-wrapper">
                <div className="filter-div">
                  <i className="fas fa-sort-amount-down-alt" /> <span className="ml-2">Filter</span>
                </div>
                <div className="status-wrapper d-flex">
                    <div><span><b>Status</b></span></div><div><i className="fas fa-chevron-down"/></div>
                </div>
                <div className="statuses-boxex "style={{border:"none"}}>
                        <div className="on-auction">On Auction</div><div className="on-auction">Has Offer</div>
                </div>
                <div className="statuses-boxex" style={{border:"none", paddingTop:"0"}}>
                        <div className="on-auction">New</div>
                </div>
                <div className="status-wrapper d-flex">
                <div><span><b>Price</b></span></div><div><i className="fas fa-chevron-down"/></div>
                </div>
                <div className="statuses-boxex2">
                        <Select options={options}
                        className="select-custom-style"
                        styles={{
                    menu: (provided, state) => ({
                      ...provided,
                      color: state.isDisabled ? 'grey' : 'hsl(0,0%,20%)',
                      cursor: state.isDisabled ? 'not-allowed' : 'pointer'
                    })
                  }}/>
                  <div className="d-flex justify-content-center align-items-center mt-3"><input type="text" className="min-max mr-2" placeholder="min" /> to <input type="text" placeholder="max" className="min-max ml-2"/></div>
                <button className="apply-btn">Apply</button>
                </div>
              </div>
        </React.Fragment>
    );
}
export default FilterSearch;
