import React, { Component, useLayoutEffect } from "react";

// import Navbar from "../Navbar/Navigation"
// import NavbarAdmin from "../Navbar/NavigationAdmin"

import getWeb3 from "../../getWeb3";
import ProductAuthentication from "../../contracts/ProductAuthentication.json";

import ErrorPage from "../error/ErrorPage.js";

import {
  Spinner,
  Button,
  Card,

  FormGroup,
  Form,
  Label,
  Input,
  Table,

  Alert,
  Row,
  Col,
} from "reactstrap";


export default class AddProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ProductAuthInstance: undefined,
      web3: null,
      accounts: null,
      metamask:false,
      header: "",
      serialNumber: "",
      manufacturer: "",
      currentOwner: "",
      products: [],
      newOwner: "",
      productId: "",
      proofOfOwnership: "",
      
      currentCompany: {
        address: undefined,
        name: null,
        phone: null,
        isVerified: false,
        isRegistered: false,
      },
    };
  }

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
      this.setState({
        web3: web3,
        ProductAuthInstance: instance,
        account: accounts[0],
      });


      const company = await this.state.ProductAuthInstance.methods
        .companyDetails(this.state.account)
        .call();
      this.setState({
        currentCompany: {
          address: company.companyAddress,
          name: company.name,
          phone: company.phone,
          isVerified: company.isVerified,
          isRegistered: company.isRegistered,
          productCount: company.productCount,
          productList: company.productList,
        },
      });

      const productList = await this.state.ProductAuthInstance.methods
        .getProductsByManufacturer(this.state.account)
        .call();

      for (let i = 0; i < productList.length; i++) {
        const product = await this.state.ProductAuthInstance.methods
          .checkProduct(productList[i])
          .call();

        this.state.products.push({
          productId: product[0],
          manufacturer: product[1],
          serialNumber: product[2],
          currentOwner: product[3],
  
        });
      }

      this.setState({ products: this.state.products });

      console.log(this.state.products);
    }catch (error) {
      this.setState({ metamask: true });
    }
  };
  updateHeader = (event) => {
    this.setState({ header: event.target.value });
  };
  updateSerialNumber = (event) => {
    this.setState({ serialNumber: event.target.value });
  };
  updateNewOwner = (event) => {
    this.setState({ newOwner: event.target.value });
  };
  updateProductId = (event) => {
    this.setState({ productId: event.target.value });
  };
  updateProofOfOwnership = (event) => {
    this.setState({ proofOfOwnership: event.target.value });
  };



  addProduct = async () => {
    await this.state.ProductAuthInstance.methods
      .addProduct(this.state.serialNumber)
      .send({ from: this.state.account});

      window.location.reload();
  };
  changeowner = async () => {
    await this.state.ProductAuthInstance.methods
      .transferOwnership(this.state.productId, this.state.newOwner,"hello hi")
      .send({ from: this.state.account });

    window.location.reload();
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
    if (!this.state.currentCompany.isVerified) {
      return (
        <>
          <Alert color="danger">only Verified company</Alert>
        
        </>
      );
    }
    return (
      <>
  
        <Alert color="primary">
        <center style={{ color: "" }}>Control Panle</center>
  </Alert>
        <Row className="container-main">
          <Col xs={12} lg={6}>
            <Form>
              <FormGroup>
                <Label>
                  Account Address
                  <Input
                    className={"input-r"}
                    type="text"
                    value={this.state.account}
                    style={{ width: "400px" }}
                    disabled
                  />{" "}
                </Label>
              </FormGroup>
              <FormGroup>
                <Label>
                  Name
                  <Input
                    className={"input-r"}
                    type="text"
                    placeholder="eg. Ava"
                    value={this.state.currentCompany.name}
                    onChange={this.updateCompanyName}
                    disabled
                  />{" "}
                </Label>
              </FormGroup>
              <FormGroup>
                <Label>
                  Serial Number <span style={{ color: "tomato" }}>*</span>
                  <Input
                    className={"input-r"}
                    type="text"
                    placeholder="eg.1020012312312"
                    value={this.state.serialNumber}
                    onChange={this.updateSerialNumber}
                  />
                </Label>
              </FormGroup>

              <Button
                color="primary"
                disabled={
                  this.state.serialNumber.length < 10 ||
                  !this.state.currentCompany.isVerified
                }
                onClick={this.addProduct}
              >
                ADD
              </Button>
            </Form>
          </Col>

          <Col xs={12} lg={6} >
            <Form>
              <FormGroup>
                <Label>
                  new Owner address
                  <Input
                    className={"input-r"}
                    type="text"
                    placeholder=""
                    value={this.state.newOwner}
                    onChange={this.updateNewOwner}
                  />{" "}
                </Label>
              </FormGroup>
              {/* <FormGroup>
                <Label>
                proofOfOwnership
                  <Input
                    className={"input-r"}
                    type="text"
                    placeholder=""
                    value={this.state.proofOfOwnership}
                    onChange={this.updateProofOfOwnership}
                  />{" "}
                </Label>
              </FormGroup> */}
           
              <FormGroup>
                <Label>
                  Product ID <span style={{ color: "tomato" }}>*</span>
                  <Input
                    className={"input-r"}
                    type="text"
                    placeholder=""
                    value={this.state.productId}
                    onChange={this.updateProductId}
                  />
                </Label>
              </FormGroup>
              <Button
                className="btn-add"
                disabled={
                  this.state.newOwner.length < 40 ||
                  this.state.productId.length < 60 ||
                  !this.state.currentCompany.isVerified
                }
                onClick={this.changeowner}
              >
                Transfer
              </Button>
            </Form>
          </Col>
        </Row>
        {loadAdded(this.state.products,this.state.account)}
      </>
    );
  }
}

export function loadAdded(products,myaccount) {
  
  const renderAdded = (product) => {
    return (
      <>
      <Card className="mt-3">
        <Table >
          <tr>
            <th>Product ID</th>
            <td>{product.productId}</td>
          </tr>

          <tr>
            <th>Serial Number</th>
            <td>{product.serialNumber}</td>
          </tr>
          <tr>
            <th>Current Owner</th>
            <td>{product.currentOwner==myaccount?" me":product.currentOwner}</td>
          </tr>
        </Table>
        </Card>
      </>
    );
  };
  return (
    <div className="mt-3">
      <Alert color="primary">
        <center style={{ color: "" }}>Products</center>
  </Alert>
      {products.length < 1 ? (
        <div className="container-item alert">
          <center>No products added.</center>
        </div>
      ) : (
       
      <div >
 
         {products.map(renderAdded)}</div>
      )}
    </div>
  );
}
