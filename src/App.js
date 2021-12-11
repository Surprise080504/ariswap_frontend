import React, { Suspense } from 'react'
import routes from './routes'
import { PrivateRoute } from './privateRoute'
import { Switch } from "react-router-dom"
import FullPageLoader from './components/full-page-loader/full-page-loader';
import './App.css';
// import 'swiper/swiper-bundle.css';

const App = () => {
  return (
    <React.Fragment>
      <Suspense fallback={<FullPageLoader />}>
        <div>
          <Switch>
            {
              routes.map((route, index) => {
                return (
                  <PrivateRoute
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    access={true}
                    component={props =>
                      <route.layout {...props} title={route.title}>
                        <route.component {...props} />
                      </route.layout>
                    }
                  />
                )
              })
            }
          </Switch>
        </div>
      </Suspense>
    </React.Fragment>
  )
}

export default App
