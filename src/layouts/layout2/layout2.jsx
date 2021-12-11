import React, { Component } from "react";
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import ModalSearch from '../../components/modal-search/modal-search';
import ModalMenu from '../../components/modal-menu/modal-menu';
import Scrollup from '../../components/scroll-up/sroll-up';

class Layout2 extends Component {
    render() {
        return (
            <div className="main">
                <Header />
                {this.props.children}
                <Footer />
                <ModalSearch />
                <ModalMenu />
                <Scrollup />
            </div>
        );
    }
}

export default Layout2;
