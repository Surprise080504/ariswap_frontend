import React from 'react';
import { Route } from "react-router-dom";

export const PrivateRoute = ({ component: Component, access, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            access === true ?
                (<Component {...props} />)
                :
                ''
        } />
);