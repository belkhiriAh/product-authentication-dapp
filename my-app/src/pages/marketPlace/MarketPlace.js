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
import { ToastContainer, toast } from "react-toastify";
import Notification from "../../components/Notification/Notification.js";
import axios from "axios";
import API_URL from "../../constants/Index";
import { Redirect } from "react-router-dom";

import DislikeIcon from "../../components/Icons/AuthIcons/DislikeIcon.js";
import LikeIcon from "../../components/Icons/AuthIcons/LikeIcon.js";
import ErrorPage from "../error/ErrorPage.js";
import NoItem from "../error/NoItem.js";

import {
  Spinner,
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardFooter,
  Button,
  Row,
  ButtonGroup,
  CardSubtitle,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  FormGroup,
  Label,
  Modal,
} from "reactstrap";
export default class MarketPlace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      metamask:false,

      modal: false,
      ratingmodal: false,
      rating:false,
      //   activeItem: {
      //     title: "",
      //     description: "",
      //     price: 0,
      //     // forsale: false,
      //     productid: "",
      //   },

      pk: 0,
      owner: 0,
      title: "",
      // title: "",
      // description: "",
      // price: 0,
      // productid: this.props.productId,
      // // forsale: false,
      // image_url:null,

      ProductAuthInstance: undefined,
      account: null,
      web3: null,
      isAdmin: false,
      productCount: undefined,
      products: [],

      productFromDB: [],
      hasRated:[],
      productId: undefined,
      currentOwner: undefined,
      price: undefined,
      soldCount: undefined,
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

      
      this.setState({
        web3: web3,
        ProductAuthInstance: instance,
        account: accounts[0],
      });

      await axios.get("http://127.0.0.1:8000/api/productsList/").then((res) =>
        this.setState({
          productFromDB: res.data,
        })
      );
      await axios.get("http://127.0.0.1:8000/api/hasrated/").then((res) =>
        this.setState({
          hasRated: res.data,
        })
      );
      

      const soldCount = await this.state.ProductAuthInstance.methods
        .getSoldProduct()
        .call();
      this.setState({ soldCount: soldCount });

      function findIndexByProperty(data, key, value) {
        for (var i = 0; i < data.length; i++) {
          if (data[i][key] === value) {
            return i;
          }
        }
        return -1;
      }
     

      function findIndexByProperty2(data, key, value) {
        for (var i = data.length - 1; (i) => 0; i--) {
          if (data[i][key] === value) {
            return i;
          }
        }
        return -1;
      }

      function findhasRatedIndexByProperty(data, key, value,key2,value2) {
        for (var i = 0; i < data.length; i++) {
          if (data[i][key] === value) {
            if (data[i][key2] === value2) {
            return i;}
          }
        }
        return -1;
      }

      for (let i = 0; i < this.state.soldCount; i++) {
        const productAddress = await this.state.ProductAuthInstance.methods
          .soldProducts(i)
          .call();
        const product = await this.state.ProductAuthInstance.methods
          .checkProduct(productAddress)
          .call();

        if (product[5]) {
          var productIndex = findIndexByProperty(
            this.state.products,
            "productId",
            product[0]
          );
          var productIndexInDb = findIndexByProperty2(
            this.state.productFromDB,
            "productid",
            product[0]
          );
          
          var hasRatedIndex = findhasRatedIndexByProperty(
            this.state.hasRated,
            "producId",
            product[0],
            "sender",
            this.state.account

            

          );
          console.log(hasRatedIndex)
         

          const _product = {
            productId: product[0],
            manufacturer: product[1],
            serialNumber: product[2],
            currentOwner: product[3],
            proofOfOwnership: product[4],
            sell: product[5],
            price: product[6],
            rate: product[7],
            usesCount: product[8],


            hasRated:hasRatedIndex==-1?false:true,
          

            manufacturerName: await this.state.ProductAuthInstance.methods
            .getCompanyName(product[1])
            .call(),

            // information from database
            image_url: this.state.productFromDB[productIndexInDb].image_url,
            title: this.state.productFromDB[productIndexInDb].title,
            description: this.state.productFromDB[productIndexInDb].description,
          };

  

          if (productIndex > -1) {
            this.state.products[productIndex] = _product;
          } else {
            this.state.products.push(_product);
          }
        }

     
      }
    
      this.setState({ products: this.state.products });
      console.log(this.state.products);

      // Admin account and verification
      const admin = await this.state.ProductAuthInstance.methods
        .getAdmin()
        .call();
      if (this.state.account === admin) {
        this.setState({ isAdmin: true });
      }
    } catch (error) {

      this.setState({ metamask: true });
    }
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
    const buyProduct = async (pId, currentOwner, price) => {
      await this.state.ProductAuthInstance.methods
        .buyProduct(pId, this.state.title)
        .send({
          from: this.state.account,
          to: currentOwner,
          value: this.state.web3.utils.toWei(price, "ether"),

        });

      window.location.reload();
    };
    const productRate = async (pId) => {
      await this.state.ProductAuthInstance.methods
        .productRate(pId, this.state.rating)
        .send({
          from: this.state.account,
        

        });
        try {
          let form_data = new FormData();
         
          form_data.append("producId", pId);
          form_data.append("sender", this.state.account);
       
          // form_data.append('forsale', this.state.forsale);

          axios
            .post("http://127.0.0.1:8000/api/hasrated/", form_data)
            .then(() => {
              window.location.reload();
            });
        } catch {
          window.location.reload();
        }
      
    };

    

    // Toggle for Modal
    const toggle = () => this.setState({ modal: !this.state.modal });
    const toggle2 = () => this.setState({ ratingmodal: !this.state.ratingmodal });
   

    return (
      <div className="container-list success">
        <Card
          className="flex-fill"
          style={{
            padding: "5px",
            margin: "5px",
          }}
        >
          <CardImg
            top
            height="180px"
            width="100%"
            src={
              product.image_url
                ? product.image_url
                : "https://h.top4top.io/p_2687f92j31.jpg"
            }
            alt="Card image cap"
          />
          <CardBody>
            <CardTitle tag="h5">{product.title}</CardTitle>
            <CardSubtitle className="mb-2 text-muted"tag="h6">
           

            
           {product.manufacturerName}
           
         
              {/* <svg
                fill="#16365f"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 448 512"
              >
                <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
              </svg> */}
             
              
              
            </CardSubtitle>

            <CardText>{product.description}</CardText>
          </CardBody>
          <CardFooter>
            <Row style={{ justifyContent: "space-between" }}>
            <ButtonGroup className="my-2" size="sm">
                <Button color="danger" disabled={product.hasRated} onClick={() => {
                  this.setState({ productId: product.productId });
                  this.setState({ rating: false });
                  toggle2();
                }}>
                  <DislikeIcon />
                </Button>
                <Button disabled>{product.rate}</Button>
                <Button color="info" disabled={product.hasRated} onClick={() => {
                  this.setState({ productId: product.productId });
                  this.setState({ rating: true });
         
                  toggle2();
                }}>
                  <LikeIcon />
                </Button>
              </ButtonGroup>

              <Button
                // disabled={product.sell}

                color="primary"
                onClick={() => {
                  this.setState({ productId: product.productId });
                  this.setState({ currentOwner: product.currentOwner });
                  this.setState({ price: product.price });
                  toggle();
                }}
              >
                {product.price} ETH
              </Button>
            </Row>
            Uses Count:{product.usesCount}
          </CardFooter>
        </Card>
        <Modal isOpen={this.state.modal} toggle={this.state.toggle}>
          <ModalHeader toggle={this.state.toggle}>
            are u sure you want to buy this item
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
            {/* <FormGroup>
              <Label for="title">Proof of Ownership:</Label>
              <Input
                name="title"
                type="text"
                value={this.state.title}
                onChange={this.onInputchange}
              />
            </FormGroup> */}
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => {
                // sellProduct(this.state.productId, this.state.price);
                buyProduct(
                  this.state.productId,
                  this.state.currentOwner,
                  this.state.price
                );
              }}
            >
              Okay
            </Button>
            <Button color="danger" onClick={toggle}>
            Cancel
          </Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.ratingmodal} toggle={this.state.toggle2}>
          <ModalHeader toggle={this.state.toggle2}>
          Are you sure you want to accomplish this transaction

          </ModalHeader>
          <ModalBody>
          You need to know applying this transaction is going to cost you some amount of eth  
        </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => {
                productRate(
                  this.state.productId,
              
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

              <center>

                <NoItem/>
              </center>
            ) : (
              <Row lg={4}>
              <>{this.state.products.map(this.renderProducts)}</>
              </Row>
            )}
        
        </div>
      </>
    );
  }
}
