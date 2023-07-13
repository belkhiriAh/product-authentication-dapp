// Node modules
import React, { Component } from "react";
import { Link } from "react-router-dom";

// Components
// import Navbar from "../Navbar/Navigation"
// import NavbarAdmin from "../Navbar/NavigationAdmin"
// import NotInit from "../NotInit"

// Contract
import getWeb3 from "../../getWeb3";
import ProductAuthentication from "../../contracts/ProductAuthentication.json";
import { toast } from "react-toastify";
import Notification from "../../components/Notification/Notification.js";
import axios from "axios";
import API_URL from "../../constants/Index";
import { Redirect } from "react-router-dom";
import ErrorPage from "../error/ErrorPage.js";

import {
  Spinner,
  Button,
  Modal,
  ModalFooter,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  Input,
  Table,
  Card,Row
} from "reactstrap";
import QRCode from "react-qr-code";
import NoItem from "../error/NoItem";

export default class Transfer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      metamask:false,
      modal: false,
      qrmodel:false,
      transferModel:false,
      newOwner:"",
      proofOfOwnership:"",
      //   activeItem: {
      //     title: "",
      //     description: "",
      //     price: 0,
      //     // forsale: false,
      //     productid: "",
      //   },

      pk: 0,
      owner: 0,
      // title: "",
      // description: "",
      // price: 0,
      // productid: this.props.productId,
      // // forsale: false,
      // image_url:null,
      logged:false,
      ProductAuthInstance: undefined,
      account: null,
      web3: null,
      isAdmin: false,
      productCount: undefined,
      products: [],

      currentCompany: {
        address: undefined,
        name: null,
        phone: null,
        isVerified: false,
        isRegistered: false,
      },
    };

    this.onInputchange = this.onInputchange.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
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

      const productList = await this.state.ProductAuthInstance.methods
        .getProductsByOwner(this.state.account)
        .call();
      // console.log(productList.length)

      for (let i = 0; i < productList.length; i++) {
        const product = await this.state.ProductAuthInstance.methods
          .checkProduct(productList[i])
          .call();

        if (product[3] === this.state.account) {
          if (!this.state.products.some((e) => e.productId == product[0])) {
            this.state.products.push({
              productId: product[0],
              manufacturer: product[1],
              serialNumber: product[2],
              currentOwner: product[3],
              proofOfOwnership: product[4],
              sell: product[5],
              rate: product[7],
            usesCount: product[8],

            });
          }
        }
      }
      this.setState({ products: this.state.products });

      // Admin account and verification
      const admin = await this.state.ProductAuthInstance.methods
        .getAdmin()
        .call();
      if (this.state.account === admin) {
        this.setState({ isAdmin: true });
      }
    } catch (error) {
      // toast(<Notification type="noweb3" />);
      this.setState({ metamask: true });
    }


    if (localStorage.getItem('token') ) {
      this.setState({logged:true})
    } 
    axios
      .get("http://localhost:8000/api/v1/users/current_user_id/", {
        headers: { Authorization: `Token ${localStorage.getItem("token")}` },
      })
      .then((res) =>
        this.setState({
          owner: res.data.id,
        })
      );
  };


  onInputchange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleImageChange = (e) => {
    this.setState({ [e.target.name]: e.target.files[0] });
  };

  renderProducts = (product) => {
    const transferProduct = async (id) => {
      await this.state.ProductAuthInstance.methods
        .transferOwnership(id, this.state.newOwner, this.state.proofOfOwnership)
        .send({ from: this.state.account });
      window.location.reload();
    },
  
      sellProduct = async (pId) => {
        await this.state.ProductAuthInstance.methods
          .sellProduct(pId, this.state.price)
          .send({ from: this.state.account });

        console.log(this.state.title, this.state.owner);
        try {
          let form_data = new FormData();
          if (this.state.image_url)
            form_data.append(
              "image_url",
              this.state.image_url,
              this.state.image_url.name
            );
          form_data.append("title", this.state.title);
          form_data.append("owner", this.state.owner);
          form_data.append("description", this.state.description);
          form_data.append("price", this.state.price);
          form_data.append("productid", pId);
          // form_data.append('forsale', this.state.forsale);

          axios
            .post(API_URL, form_data, {
              headers: {
                Authorization: `Token ${localStorage.getItem("token")}`,
                "content-type": "multipart/form-data",
              },
            })
            .then(() => {
              window.location.reload();
            });
        } catch {
          return <Redirect to="http://localhost:3000/" />;
        }

        // window.location.reload();
      };

      
     
    // Toggle for Modal
    const toggle = () => this.setState({ modal: !this.state.modal });
    const toggleqr = () => this.setState({ qrmodel: !this.state.qrmodel });
    const transferToggle = () => this.setState({ transferModel: !this.state.transferModel });
    
    const { items } = this.state;
    return (
      <div className="container-list success">
        
<Card  style={{
            padding: "5px",
            margin: "5px",
          }}> 
        <Table>
          <tr>
            <th>Product ID</th>
            <td>{product.productId.slice(0,4)+" ........ "+product.productId.slice(-5,-1)+"       "}
            
            <Button
               
               color="info"
                onClick={() => {
                  this.setState({ productId: product.productId });
                  toggleqr();
                }}
              >
                QR
              </Button>
            </td>
          </tr>

          <tr>
            <th>Serial Number</th>
            <td>{product.serialNumber}</td>
          </tr>
          {/* <tr>
            <th>Proof of Ownership</th>
            <td>{product.proofOfOwnership}</td>
          </tr> */}
          <tr>
            <th>Uses Count</th>
            <td>{product.usesCount}</td>
          </tr>
          <tr>
            <th>rate</th>
            <td>{product.rate}</td>
          </tr>
          {/* <tr>
            <th>Current Owner</th>
            <td>
              {product.currentOwner == this.state.account
                ? "me"
                : this.state.account}
            </td>
          </tr> */}
          <tr>
            <th> transaction</th>
            <td>
              <Button
                color="info"
                onClick={() => {
                  this.setState({ productId: product.productId });
                  transferToggle();
                }}
                className="mr-3"
              >
                Transfer
              </Button>
              {/* <Button
                              onClick={this.createItem}
                              className="vote-bth"
                              // disabled={
                              //   !this.state.currentCompany.isRegistered ||
                              //   !this.state.currentCompany.isVerified

                              // }
                          >
                              toMarketPlace
                          </Button> */}
              <Button
                disabled={product.sell}
                color="primary"
                onClick={() => {
                  this.setState({ productId: product.productId });
                  toggle();
                }}
              >
                Sell Product
              </Button>
            </td>
          </tr>
        </Table>
        </Card>
        <Modal isOpen={this.state.modal} toggle={this.state.toggle}>
          <ModalHeader toggle={this.state.toggle}>
            Sell Product
          </ModalHeader>
          {this.state.logged?
            <>
 <ModalBody>
            <FormGroup>
              <Label for="title">title:</Label>
              <Input
                name="title"
                type="text"
                value={this.state.title}
                onChange={this.onInputchange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="description">description:</Label>
              <Input
                name="description"
                type="text"
                value={this.state.description}
                onChange={this.onInputchange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="price">price:</Label>
              <Input
                name="price"
                type="text"
                value={this.state.price}
                onChange={this.onInputchange}
              />
            </FormGroup>

        
            <FormGroup>
              <Label for="productid">productid:</Label>
              <Input
                disabled
                type="productid"
                title="productid"
                value={this.state.productId}
              />
            </FormGroup>

    
            <Input
              type="file"
              name="image_url"
              accept="image/jpeg,image/png,image/gif"
              onChange={this.handleImageChange}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => {
                // sellProduct(this.state.productId, this.state.price);
                sellProduct(this.state.productId);
              }}
            >
              Okay
            </Button>
            <Button
              color="danger"
              onClick={() => {
                // sellProduct(this.state.productId, this.state.price);
                toggle();
              }}
            >
              close
            </Button>
          </ModalFooter>
          </>
        :
        <>
              <ModalBody>
        only authenticated users can add items to marketplace
        </ModalBody>
        <ModalFooter>
        <Link to="/Login"><Button color="primary" >
            login
          </Button></Link>
          {' '}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
        </>
        

        }
         
          
        </Modal>
        <Modal isOpen={this.state.qrmodel} toggle={this.state.qrmodel}>
          <ModalHeader >
            QR model
          </ModalHeader>
          <ModalBody>
       

           
              <Label for="productid">productid:</Label>
              <Input
                disabled
                type="productid"
                title="productid"
                // onChange={this.onChange}
                value={this.state.productId}
              />
            <div style={{ height: "auto", margin: " 25px auto", maxWidth: 256, width: "100%" }}>
    <QRCode
    size={256}
    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
    value={this.state.productId}
    viewBox={`0 0 256 256`}
    />
</div>
           
          
          </ModalBody>
          <ModalFooter>
           
          <Button
              color="danger"
              onClick={() => {
                toggleqr();
              }}
            >
              close
            </Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.transferModel} toggle={this.state.transferModel}>
          <ModalHeader >
            transfer model
          </ModalHeader>
          <ModalBody>
      
      
    
            <FormGroup>
              <Label for="productid">productid:</Label>
              <Input
                disabled
                type="productid"
                title="productid"
                // onChange={this.onChange}
                value={this.state.productId}
              />
            </FormGroup>
            <FormGroup>
              <Label for="newOwner">new owner address:</Label>
              <Input
                name="newOwner"
                type="text"
                value={this.state.newOwner}
                onChange={this.onInputchange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="proofOfOwnership">proof Of Ownership</Label>
              <Input
                name="proofOfOwnership"
                type="text"
                value={this.state.proofOfOwnership}
                onChange={this.onInputchange}
              />
            </FormGroup>

    
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => {
                transferProduct(this.state.productId);
              }}
            >
              Okay
            </Button>
            <Button
              color="danger"
              onClick={() => {
                transferToggle();
              }}
            >
              close
            </Button>
        
          </ModalFooter>
        </Modal>
      </div>
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
        {/* {this.state.isAdmin ? <NavbarAdmin /> : <Navbar />} */}
        <div className="container-main">
     
          <small>Total products: {this.state.products.length}</small>
       
          {this.state.products.length < 1 ? (
            <div className="container-item attention">
              <center><NoItem/></center>
            </div>
          ) : (   <Row lg={2}>
            <>{this.state.products.map(this.renderProducts)}</>
            </Row>
          )}
          
        </div>
      </>
    );
  }
}
