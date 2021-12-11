import React, { Component } from "react";
import { connect } from 'react-redux';
import Header from '../../components/header/header';
import Breadcrumb from '../../components/breadcrumb/breadcrumb';
import Footer from '../../components/footer/footer';
import ModalSearch from '../../components/modal-search/modal-search';
import ModalMenu from '../../components/modal-menu/modal-menu';
import Scrollup from '../../components/scroll-up/sroll-up';
const bannerImg = '/img/placeholder.png';

class Layout1 extends Component {
    state = {
        banner: null
    }
    componentDidUpdate() {
        if (this.props.collection.getAuth && this.props.collection.collection && !this.state.banner) {
            const { collection } = this.props.collection
            if (collection.banner)
                this.setState({banner: collection.banner})
        }
        if (this.props.user.individualUserAuth && this.props.user.individualUser && !this.state.banner) {
            const user = this.props.user.individualUser
            if (user.bannerImage)
                this.setState({banner: user.bannerImage})
        }
    }
    render() {
        const { title } = this.props
        return (
            <div className="main">
                <Header />
                <Breadcrumb title={title} banner={this.state.banner || bannerImg}/>
                {this.props.children}
                <Footer />
                <ModalSearch />
                <ModalMenu />
                <Scrollup />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    error: state.error,
    collection: state.collection,
    user: state.user,
});

export default connect(mapStateToProps, {})(Layout1);