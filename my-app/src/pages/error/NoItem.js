import React from "react";
import {
  Button,
} from "reactstrap";
import s from "./ErrorPage.module.scss";



const NoItem = (props) => {
  return (
    <div className={s.pageContainer}>
      <div className={s.errorContainer}>
        <h1 className={s.errorCode}>Hmm</h1>
        <p className={s.errorInfo}>
          Oops. Looks like the page you're looking for nothing on it 
        </p>
        <p className={s.errorHelp}>
        there is no item here in this page 
        </p>
        {/* <a   target="_blank" href="https://metamask.io/">
          <Button className={`${s.errorBtn} rounded-pill`} type="submit" color="secondary-red">
            Download Metamask
          </Button>
        </a> */}
      </div>
   
   
    </div>
  );
}

export default NoItem;
