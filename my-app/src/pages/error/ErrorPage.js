import React from "react";
import {
  Button,
} from "reactstrap";
import s from "./ErrorPage.module.scss";



const ErrorPage = (props) => {
  return (
    <div className={s.pageContainer}>
      <div className={s.errorContainer}>
        <h1 className={s.errorCode}>401</h1>
        <p className={s.errorInfo}>
          Oops. Looks like the page you're looking for needs something 
        </p>
        <p className={s.errorHelp}>
          So you need to install Metamask or setup your account on it
        </p>
        <a   target="_blank" href="https://metamask.io/">
          <Button className={`${s.errorBtn} rounded-pill`} type="submit" color="secondary-red">
            Download Metamask
          </Button>
        </a>
      </div>
   
   
    </div>
  );
}

export default ErrorPage;
