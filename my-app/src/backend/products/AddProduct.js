import React, {Component} from 'react';
import axios from "axios";
import API_URL from '../../constants/Index';
import {Redirect} from 'react-router-dom';
import { Button, Form, FormGroup, Input, Label } from "reactstrap";

class AddProduct extends Component{
  state = {
    pk : 0,
    owner:0,
    title: "",
    description: "",
    productid: "",
    forsale: false,
    image_url:null
  };

  componentDidMount(){

    if(this.props.product){
      const { pk,owner,  title, description, forsale, productid, image_url } = this.props.product;
      this.setState({ pk,owner,  title, description, forsale, productid, image_url});
 
    }
  }
  onChange = (e) => {
    this.setState({ [e.target.title]: e.target.value });
  };
  onClick = (e) => {
    this.setState({forsale: e.target.checked});
  };
  getUserID = () => {
    axios.get("http://localhost:8000/api/v1/users/current_user_id/", {headers: {Authorization: `Token ${localStorage.getItem('token')}`}
  }).then(res =>
    this.setState({
      owner: res.data.id
    })
    // console.log(res.data.id)
  );

  };

  addProduct = (e) => {
    e.preventDefault();
    this.getUserID();
    try{
      let form_data = new FormData();
      if (this.state.image_url) form_data.append('image_url', this.state.image_url, this.state.image_url.name);
      form_data.append('title', this.state.title);
      form_data.append('owner', this.state.owner);
      form_data.append('description', this.state.description);
      form_data.append('productid', this.state.productid);
      form_data.append('forsale', this.state.forsale);
   
      axios.post(API_URL, form_data, {headers:  {Authorization: `Token ${localStorage.getItem('token')}` ,'content-type': 'multipart/form-data',}
      }).then(() => {
        this.props.resetState();
        this.props.toggle();
      });
    }
    catch{
      return(
        <Redirect to='http://localhost:3000/'/>
      );
    }
  };

  editProduct = (e) => {
    e.preventDefault();
    try{
      let form_data = new FormData();
      if (this.state.image_url) form_data.append('image_url', this.state.image_url, this.state.image_url.name);
      form_data.append('title', this.state.title);
      form_data.append('owner', this.state.owner);
      form_data.append('description', this.state.description);
      form_data.append('productid', this.state.productid);
      form_data.append('forsale', this.state.forsale);
      axios.put(API_URL + this.state.pk + "/", form_data,
        { headers: {Authorization: `Token ${localStorage.getItem('token')}` ,'content-type': 'multipart/form-data',}})
        .then(() => {
        this.props.resetState();
        this.props.toggle();
      });
    }
    catch(err){
      return(
        <Redirect to='http://localhost:3000/'/>
      );
    }
  };

  defaultIfEmpty = (value) => {
    return value === "" ? "" : value;
  };
  handleImageChange = (e) => {
 
    this.setState({ [e.target.title]: e.target.files[0] });
};

  render(){
  
    return(
      <Form
        onSubmit={this.props.product ? this.editProduct : this.addProduct}
      >
        <FormGroup>
          <Label for="title">title:</Label>
          <Input
            type="text"
            title="title"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.title)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="description">description:</Label>
          <Input
            type="description"
            title="description"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.description)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="productid">productid:</Label>
          <Input
            type="productid"
            title="productid"
            onChange={this.onChange}
            value={this.defaultIfEmpty(this.state.productid)}
          />
        </FormGroup>

        <FormGroup check>
          <Input type="checkbox"   onClick={this.onClick} checked={this.state.forsale}/>
          <Label check>Check me out</Label>
        </FormGroup>
        <Input type="file" 
    title="image_url"
    accept="image/jpeg,image/png,image/gif"
    onChange={this.handleImageChange}/>

        <Button>Send</Button>
      </Form>
    );
  }
}

export default AddProduct;
