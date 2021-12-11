import React from 'react';
import { connect } from 'react-redux';
import Author from '../authors/authors';
import TopSeller from '../top-seller/topseller2';

const Authors = (props) => {
    return (
        <>
            <Author/>
            <TopSeller/>
        </>
    )
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, { })(Authors);