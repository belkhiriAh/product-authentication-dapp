// -- React and related libs
import React from "react";
import { connect } from "react-redux";
import {  withRouter, Redirect } from "react-router";

// -- Third Party Libs
import PropTypes from "prop-types";

// -- Custom Components
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import Footer from "../Footer/Footer";
import Dashboard from "../../pages/dashboard/Dashboard";
import AddProduct from "../../pages/AddProduct/AddProduct";
import Company from "../../pages/Company/Company";
import Transfer from "../../pages/Transfer/Transfer";
import Notifications from "../../pages/notifications/Notifications";
import MarketPlace from "../../pages/marketPlace/MarketPlace";
import Main from "../../backend/products/Main"
import Login from "../../backend/auth/Login"
import Logout from "../../backend/auth/Logout"
import Signup from "../../backend/auth/Signup"


import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";


// -- Component Styles
import s from "./Layout.module.scss";

const Layout = (props) => {

  return (
    <div className={s.root}>
      <div className={s.wrap}>
        <Header />
        <Sidebar />
        <main className={s.content}>
          {/* <Breadcrumbs url={props.location.pathname} /> */}
          <Switch>
        
            <Route path="/dashboard" exact component={Dashboard}/>
            <Route path="/Product" exact component={AddProduct} />
            <Route path="/company" exact component={Company} />
            <Route path="/Transfer" exact component={Transfer} />
            <Route path="/MarketPlace" exact component={MarketPlace} />
            <Route path="/Addproduct" exact component={Main} />
            <Route path="/login" exact component={Login} />
            <Route path="/signup" exact component={Signup} />
            <Route path="/logout" exact component={Logout} />
            <Route path="/Notifications" exact component={Notifications} />
     
           
          </Switch>
        </main>
        <Footer />
      </div>
    </div>
  );
}

Layout.propTypes = {
  sidebarOpened: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
}

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
  };
}

export default withRouter(connect(mapStateToProps)(Layout));
