import React from 'react';
import ItemDetail from '../item-details/item-details';
import LiveAuctions from '../auctions/home-auctions';

function ItemDetails(props) {
    return (
        <>
            <ItemDetail history={props.history} />
            <LiveAuctions />
        </>
    );
}

export default ItemDetails;