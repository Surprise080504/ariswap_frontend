import React, { Component } from "react";
import Footer from '../../components/footer/footer';
import ModalSearch from '../../components/modal-search/modal-search';
import ModalMenu from '../../components/modal-menu/modal-menu';
import Scrollup from '../../components/scroll-up/sroll-up';

class Layout3 extends Component {
    render() {
        return (
            <div className="main">
                {this.props.children}
                <Footer />
                <ModalSearch />
                <ModalMenu />
                <Scrollup />
            </div>
        );
    }
}

export default Layout3;
