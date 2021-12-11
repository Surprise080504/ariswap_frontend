import React, { Component } from "react";

class Layout4 extends Component {
    render() {
        return (
            <div className="main">
                {this.props.children}
            </div>
        );
    }
}

export default Layout4;
