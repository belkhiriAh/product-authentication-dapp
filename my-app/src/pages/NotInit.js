// Node module
import React from "react";
import { Alert } from "reactstrap";
const NotInit = (props) => {
  // Component: Displaying election not initialize message.
  return (
    <div>
    <Alert color="dark">Your Account: {props.account}</Alert>

    <Alert color="info">
      <h4 className="alert-heading" style={{ color: "#084298" }}>
        everything looks good
      </h4>
      <p style={{ color: "#084298" }}>
        <p>The election has not been initialize.</p>
      </p>
      <hr />
      <center>
        <p style={{ color: "#084298" }}>Please Wait..</p>
      </center>
    </Alert>
  </div>
  );
};
export default NotInit;
