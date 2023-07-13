// Node modules
import React, { Component } from "react";

// import NotInit from "../NotInit";

import { ToastContainer, toast } from "react-toastify";
import Notification from "../../components/Notification/Notification.js";
import ErrorPage from "../error/ErrorPage.js";

import {
  Spinner,
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  CardSubtitle,
  FormGroup,
  Form,
  Label,
  Input,
  Table,
  Nav,
  NavLink,
  NavItem,
  Fade,
  Alert,
  Row,
} from "reactstrap";
// CSS

// Contract
import getWeb3 from "../../getWeb3";
import ProductAuthentication from "../../contracts/ProductAuthentication.json"

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      metamask:false,
      ProductAuthInstance: undefined,
      web3: null,
      account: null,
      isAdmin: false,
      isElStarted: false,
      isElEnded: false,
      companyCount: undefined,
      companyName: "",
      companyEmail: "",
      companies: [],
      currentCompany: {
          address: undefined,
          name: null,
          Email: null,
          isVerified: false,
          isRegistered: false,
      },
  }
  }

  // refreshing once
  componentDidMount = async () => {
    if (!(window.location.hash.slice(-1) === "#")) {
      window.location = window.location + "/#";
      window.location.reload();
    }
    try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3()

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts()

        // Get the contract instance.
        const networkId = await web3.eth.net.getId()
        const deployedNetwork = ProductAuthentication.networks[networkId]
        const instance = new web3.eth.Contract(
            ProductAuthentication.abi,
            deployedNetwork && deployedNetwork.address
        )

        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        this.setState({
            web3: web3,
            ProductAuthInstance: instance,
            account: accounts[0],
        })

      // Admin account and verification
      const admin = await this.state.ProductAuthInstance.methods.getAdmin().call();
      if (this.state.account === admin) {
        this.setState({ isAdmin: true });
      }

      // Total number of companies
      const companyCount = await this.state.ProductAuthInstance.methods
      .getTotalCompany()
      .call()
  this.setState({ companyCount: companyCount })

  // Loading all the companies
  for (let i = 0; i < this.state.companyCount; i++) {
      const companyAddress = await this.state.ProductAuthInstance.methods
          .companies(i)
          .call()
      const company = await this.state.ProductAuthInstance.methods
          .companyDetails(companyAddress)
          .call()
      this.state.companies.push({
          address: company.companyAddress,
          name: company.name,
          email: company.email,
    
          isVerified: company.isVerified,
          isRegistered: company.isRegistered,
      })
  }
  this.setState({ companies: this.state.companies })

  // Loading current companies
  const company = await this.state.ProductAuthInstance.methods
      .companyDetails(this.state.account)
      .call()
  this.setState({
      currentCompany: {
          address: company.companyAddress,
          name: company.name,
          email: company.email,
          isVerified: company.isVerified,
          isRegistered: company.isRegistered,
      },
  })
    } catch (error) {
      console.error(error);

      // toast(<Notification type="noweb3" />);
      this.setState({ metamask: true });
    }
  };
  updateCompanyName = (event) => {
    this.setState({ companyName: event.target.value })
}
updateCompanyEmail = (event) => {
    this.setState({ companyEmail: event.target.value })
}
registerAsCompany = async () => {
    await this.state.ProductAuthInstance.methods
        .registerAsCompany(this.state.companyName, this.state.companyEmail)
        .send({ from: this.state.account })
    window.location.reload()
 };
  render() {
    if (!this.state.web3) {
      return (
        <>
          <center>
              <Spinner
                className={this.state.metamask? "d-none":null}
                style={{
                  height: "6rem",
                  width: "6rem",
                }}
              >
                Loading...
              </Spinner>{" "}
            </center>
            <div   className={!this.state.metamask? "d-none":null} >


             <ErrorPage/>
     
            </div>
        
        </>
      );
    }
    return (
      <>
     
    

        {!this.state.currentCompany ? (
          <div>
          <Alert color="dark">Your Account: {this.state.account}</Alert>

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
        ) : (
          <>
            {!this.state.currentCompany.isRegistered ? (
              <Card className="mb-3">
                <CardBody>
                  <CardTitle tag="h5">Registration</CardTitle>
                  {/* <CardSubtitle className="mb-2 text-muted" tag="h6">
                    Total registered voters: {this.state.companies.length}
                  </CardSubtitle> */}
                  <CardText>
                    <Form>
                      <FormGroup>
                        <Label for="exampleEmail">Address</Label>
                        <Input
                          value={this.state.account}
                          id="exampleEmail"
                          type="text"
                          disabled
                        />
                        <Label className="mt-2 " for="exampleEmail">
                          Name
                        </Label>

                        <Input
                          type="email"
                          placeholder="eg .company"
                          value={this.state.companyName}
                          onChange={this.updateCompanyName}
                        />
                        <Label className="mt-2 " for="exampleEmail">
                       Email
                        </Label>
                        <Input
                          type="text"
                          placeholder="eg. admin@company.com"
                          value={this.state.companyEmail}
                          onChange={this.updateCompanyEmail}
                        />
                      </FormGroup>
                      <Button
                        color="primary"
                        disabled={
                        
                          this.state.currentCompany.isVerified
                        }
                        onClick={this.registerAsCompany}
                      >
                        
                        Submit
                      </Button>
                    </Form>
                  </CardText>
                </CardBody>
              </Card>
            ) : null}
            <Card>
              {/* <div
              className="container-main"
              style={{
                borderTop: this.state.currentVoter.isRegistered
                  ? null
                  : "1px solid",
              }}
            ></div> */}
              {loadCurrentCompany(
                this.state.currentCompany,
                this.state.currentCompany.isRegistered
              )}
            </Card>
            {/* </div> */}

            {/* {this.state.isAdmin ? (
              <div
                className="container-main"
                style={{ borderTop: "1px solid" }}
              >
                <small>TotalVoters: {this.state.voters.length}</small>
                {loadAllVoters(this.state.voters)}
              </div>
            ) : null} */}
          </>
        )}
      </>
    );
  }
}
export function loadCurrentCompany(company, isRegistered) {
  return (
    <>
      <Table borderless responsive size="">
        <thead>
          <tr>
            <th>#</th>
            <th>Your Registered Info</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Account Address</th>
            <td>{company.address}</td>
          </tr>
          <tr>
            <th>Name</th>
            <td>{company.name}</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>{company.email}</td>
          </tr>

          <tr>
            <th>Verification</th>
            <td>{company.isVerified ? "True" : "False"}</td>
          </tr>
          <tr>
            <th>Registered</th>
            <td>{company.isRegistered ? "True" : "False"}</td>
          </tr>
        </tbody>
      </Table>
    </>
  );
}
