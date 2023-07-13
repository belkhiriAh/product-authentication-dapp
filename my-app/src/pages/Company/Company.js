import React, { Component } from "react";

// import Navbar from "../../Navbar/Navigation";
// import NavbarAdmin from "../../Navbar/NavigationAdmin";

// import AdminOnly from "../../AdminOnly";

import getWeb3 from "../../getWeb3";
import ProductAuthentication from "../../contracts/ProductAuthentication.json";

import { ToastContainer, toast } from "react-toastify";
import Notification from "../../components/Notification/Notification.js";
import axios from "axios";

import {
  Spinner,
  Button,
  Card,
  ButtonGroup,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Modal,
  
 
  Table,
  Row,
  Fade,
  Alert,
} from "reactstrap";
import DislikeIcon from "../../components/Icons/AuthIcons/DislikeIcon.js";
import LikeIcon from "../../components/Icons/AuthIcons/LikeIcon.js";
import ErrorPage from "../error/ErrorPage.js";
import NoItem from "../error/NoItem";

// CSS
export default class Company extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ProductAuthInstance: undefined,
      account: null,
      web3: null,
      isAdmin: false,
      companyCount: undefined,
      companies: [],

      rating:false,
      companyAddress: undefined,
      hasRated:[],
    };
  }


  // refreshing once
  componentDidMount = async () => {
    // refreshing page only once
    if (!(window.location.hash.slice(-1) === "#")) {
      window.location = window.location + "/#";
      window.location.reload();
    }
  
    try {
     // Get network provider and web3 instance.
     const web3 = await getWeb3();

     // Use web3 to get the user's accounts.
     const accounts = await web3.eth.getAccounts();

     // Get the contract instance.
     const networkId = await web3.eth.net.getId();
     const deployedNetwork = ProductAuthentication.networks[networkId];
     const instance = new web3.eth.Contract(
       ProductAuthentication.abi,
       deployedNetwork && deployedNetwork.address
     );

     // Set web3, accounts, and contract to the state, and then proceed with an
     // example of interacting with the contract's methods.
     this.setState({ web3, ProductAuthInstance: instance, account: accounts[0] });

     // Total number of candidates
     const productCount = await this.state.ProductAuthInstance.methods
       .getTotalProduct()
       .call();
     this.setState({ productCount: productCount });

     // Admin account and verification
     const admin = await this.state.ProductAuthInstance.methods.getAdmin().call();
     if (this.state.account === admin) {
       this.setState({ isAdmin: true });
     }
     // Total number of voters
     const companyCount = await this.state.ProductAuthInstance.methods
       .getTotalCompany()
       .call();
     this.setState({ companyCount: companyCount });


     await axios.get("http://127.0.0.1:8000/api/hasrated_company/").then((res) =>
     this.setState({
       hasRated: res.data,
     })
   );
   
     function findhasRatedIndexByProperty(data, key, value,key2,value2) {
      for (var i = 0; i < data.length; i++) {
        if (data[i][key] === value) {
          if (data[i][key2] === value2) {
          return i;}
        }
      }
      return -1;
    }
     for (let i = 0; i < this.state.companyCount; i++) {
   
       const companyAddress = await this.state.ProductAuthInstance.methods
         .companies(i)
         .call();
       const company = await this.state.ProductAuthInstance.methods
         .companyDetails(companyAddress)
         .call();

         var hasRatedIndex = findhasRatedIndexByProperty(
          this.state.hasRated,
          "CompanyAdress",
          companyAddress,
          "Sender",
          this.state.account
  
          
  
        );


       this.state.companies.push({
         address: company.companyAddress,
         name: company.name,
         email: company.email,
         isVerified: company.isVerified,
         isRegistered: company.isRegistered,
         rate:company.rate,
         hasRated:hasRatedIndex==-1?false:true,
       });
     }
     this.setState({ companies: this.state.companies });
   }catch (error) {
      this.setState({ metamask: true });
    }
  };

  renderUnverifiedCompany = (company) => {
    const verifyCompany = async (verifiedStatus, address) => {
      await this.state.ProductAuthInstance.methods
        .verifyCompany(verifiedStatus, address)
        .send({ from: this.state.account});
      window.location.reload();
    };
    return (
      <>
         {this.state.isAdmin?<div style={{ display: company.isVerified ? "none" : null }}>
          <Card>
            <Table>
              <tr>
                <th>Account address</th>
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
       
              {/* <tr>
                <th>Verified</th>
                <td>{company.isVerified ? "True" : "False"}</td>
              </tr>
              <tr>
                <th>Registered</th>
                <td>{company.isRegistered ? "True" : "False"}</td>
              </tr> */}
            </Table>

            <center >
              <Button
              color="primary"
                className="mb-3"
                disabled={company.isVerified}
                onClick={() => verifyCompany(true, company.address)}
              >
                Approve
              </Button>
            </center>
          </Card>
        </div>:null}
        
    
     
      </>
    );
  };
  renderverifiedCompany = (company) => {
    const companyRate = async (_companayAddress) => {
      await this.state.ProductAuthInstance.methods
        .companyRate(_companayAddress, this.state.rating)
        .send({
          from: this.state.account,
        
        
        });
        try {
          let form_data = new FormData();
         
          form_data.append("companyAdress", _companayAddress);
          form_data.append("sender", this.state.account);
       
          // form_data.append('forsale', this.state.forsale);

          axios
            .post("http://127.0.0.1:8000/api/hasrated_company/", form_data)
            .then(() => {
              window.location.reload();
            });
        } catch {
          window.location.reload();
        }
      
    };
    
    const toggle2 = () => this.setState({ ratingmodal: !this.state.ratingmodal });

    return (
      <>
      
        {company.isVerified ? (
          <div className="container-list success">
            <Card className="ml-1 mr-1">
              <center>
                <p style={{ margin: "7px 0px" }}>AC: {company.address}</p>
              </center>
              <Table>
                <tr>
                  <th>Name</th>
                  <th>email</th>
                  <th></th>
                </tr>
                <tr>
                  <td>{company.name}</td>
                  <td>{company.email}</td>
                  <td>

                  <ButtonGroup className="my-2" size="sm">
                <Button color="danger" disabled={company.hasRated} onClick={() => {
                  this.setState({ companyAddress: company.address });
                  this.setState({ rating: false });
                  toggle2();
                }}>
                  <DislikeIcon />
                </Button>
                <Button disabled>{company.rate}</Button>
                <Button color="info" disabled={company.hasRated} onClick={() => {
                  this.setState({ companyAddress: company.address });
                  this.setState({ rating: true });
         
                  toggle2();
                }}>
                  <LikeIcon />
                </Button>
              </ButtonGroup>

                  </td>
                </tr>
              </Table>
            </Card>
          </div>
        ) : null}

<Modal isOpen={this.state.ratingmodal} toggle={this.state.toggle2}>
          <ModalHeader toggle={this.state.toggle2}>
            are u sure you want to do this transaction
          </ModalHeader>
          <ModalBody>
          you need to know applying this transaction goinig to cost you some amount of eth 
        </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => {
                // sellProduct(this.state.productId, this.state.price);
                companyRate(
                  this.state.companyAddress,
              
                );
              }}
            >
              Okay
            </Button>
            <Button color="danger" onClick={toggle2}>
            Cancel
          </Button>
          </ModalFooter>
        </Modal>
     
      </>
    );
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
        {/* <NavbarAdmin /> */}
        <div className="container-main">
          {this.state.companies.length < 1 ? (
            <center className="container-item info">
                <NoItem/>
        
            </center>
          ) : (
            <>
     
                     <Row lg={2}>
              {this.state.companies.map(this.renderUnverifiedCompany)}
              </Row>
              <Alert color="primary" className="mt-3">
        <center style={{ color: "black" }}>List of registered company</center>
  </Alert>
              <Row lg={2}>
              {this.state.companies.map(this.renderverifiedCompany)}
              </Row>
            </>
          )}
        </div>
      </>
    );
  }
}
