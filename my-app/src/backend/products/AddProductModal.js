import React, { Component, Fragment } from "react";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import AddProduct from "./AddProduct";

class AddProductModal extends Component {
  state = {
    modal: false
  };

  toggle = () => {
    this.setState(previous => ({
      modal: !previous.modal
    }));
  };

  render() {
    const create = this.props.create;
    var title = "Editing Employee";
    var button = <Button onClick={this.toggle}>Edit</Button>;
    if (create) {
      title = "Adding New Employee";
      button = (
        <Button
          color="primary"
          className="float-right"
          onClick={this.toggle}
          style={{ minWidth: "200px" }}
        >
          Add New
        </Button>
      );
    }

    return (
      <Fragment>
        {button}
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>{title}</ModalHeader>
          <ModalBody>
            <AddProduct
              resetState={this.props.resetState}
              toggle={this.toggle}
              product={this.props.product}
            />
          </ModalBody>
        </Modal>
      </Fragment>
    );
  }
}

export default AddProductModal;
