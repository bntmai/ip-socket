import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
// import { renderRoutes } from 'react-router-config';
import { createStore, applyMiddleware } from "redux";
import { Provider, connect } from "react-redux";
import thunk from "redux-thunk";
import Loadable from 'react-loadable';
import './App.scss';
import ipApp from "./reducers";
import {auth} from "./actions";

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;
let store = createStore(ipApp, applyMiddleware(thunk));

// Containers
const Dashboard = Loadable({
  loader: () => import('./containers/DefaultLayout/DefaultLayout'),
  loading
});

// Pages
const Login = Loadable({
  loader: () => import('./views/SocialWeb/Login/Login'),
  loading
});

const Register = Loadable({
  loader: () => import('./views/SocialWeb/Register/Register'),
  loading
});

const Page404 = Loadable({
  loader: () => import('./views/Pages/Page404'),
  loading
});

const Page500 = Loadable({
  loader: () => import('./views/Pages/Page500'),
  loading
});

class RootContainerComponent extends Component {
  componentDidMount() {
    this.props.loadUser();
  }

  PrivateRoute = ({component: ChildComponent, ...rest}) => {
    return <Route {...rest} render={props => {
      if (this.props.auth.isLoading) {
        return <em>Loading...</em>;
      } else if (!this.props.auth.isAuthenticated) {
        return <Redirect to="/login" />;
      } else {
        return <ChildComponent {...props} />
      }
    }} />
  }
  render() {
    let {PrivateRoute} = this;
    return (
      <BrowserRouter>
          <Switch>
            <Route exact path="/login" name="Login Page" component={Login} />
            <Route exact path="/register" name="Register Page" component={Register} />
            <Route exact path="/404" name="Page 404" component={Page404} />
            <Route exact path="/500" name="Page 500" component={Page500} />
            <PrivateRoute path="/home" component={Dashboard} />
          </Switch>
      </BrowserRouter>
    );
  }
}
const mapStateToProps = state => {
  return {
    auth: state.auth,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadUser: () => {
      return dispatch(auth.loadUser());
    }
  }
}

let RootContainer = connect(mapStateToProps, mapDispatchToProps)(RootContainerComponent);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <RootContainer />
      </Provider>
    )
  }
}