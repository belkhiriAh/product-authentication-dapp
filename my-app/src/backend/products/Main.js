import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import EmployeeList from "./EmployeeList";
import AddProductModal from "./AddProductModal";
import axios from "axios";
import API_URL from "../../constants/Index";
import { Redirect } from "react-router-dom";

class Main extends Component {
  state = {
    products: [],
  };

  componentDidMount() {
    this.resetState();
  }

  getProducts = () => {
    var token = localStorage.getItem("token");
    if (token) {
      axios
        .get(API_URL, {
          headers: {Authorization: `Token ${localStorage.getItem('token')}` },
        })
        .then((res) =>
          this.setState({
            products: res.data,
          })
        );

       
    } else {
      return <Redirect to="http://localhost:8000/" />;
    }
  };

  resetState = () => {
    this.getProducts();
  };

  render() {
    return (
      <div className="Main">
        <div className="text-center">

        </div>
        <Container style={{ marginTop: "20px" }}>
          <Row>
            <Col>
              <EmployeeList
                products={this.state.products}
                resetState={this.resetState}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <AddProductModal create={true} resetState={this.resetState} />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Main;
