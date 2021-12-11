import React, { Component } from 'react';
import Help from '../help/help';
import Faq from '../faq/faq';

class HelpCenter extends Component {

    componentDidMount() {
        window.scroll(0, 0)
    }

    render() {
        return (
            <>
                {/* <Help /> */}
                <Faq />
            </>
        );
    }
}

export default HelpCenter;