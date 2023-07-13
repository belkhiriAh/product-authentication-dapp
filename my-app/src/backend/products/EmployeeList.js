import React, { Component } from "react";
import { Table,Card } from "reactstrap";
import AddProductModal from "./AddProductModal";
import ConfirmRemovalModal from "./ConfirmRemovalModal";
function IdToString(props) {
  return <>{props.data.substring(0, 4)+".........."+props.data.substring(props.data.length -4)}</>;
}
class EmployeeList extends Component {
  render() {
    const products = this.props.products;
    return (
      <Card>

      <Table >
        <thead>
          <tr>
            <th>img</th>
            <th>title</th>
            <th>description</th>
            <th>sale state</th>
            <th>productid</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {!products || products.length <= 0 ? (
            <tr>
              <td colSpan="6" align="center">
                <b>Oops, no one here yet</b>
              </td>
            </tr>
          ) : (
            products.map(product => (
              <tr key={product.pk}>
                <td>
                  <img src={product.image_url} width='40' alt="" />
                  </td>
                  <td>{product.title}</td>
                <td>{product.description}</td>
                <td>{product.forsale ? "true" : "false"}</td>
                <td><IdToString data={product.productid}/></td>
                <td align="center">
                  <AddProductModal
                    create={false}
                    product={product}
                    resetState={this.props.resetState}
                  />
                  &nbsp;
                  &nbsp;
                  <ConfirmRemovalModal
                    pk={product.pk}
                    resetState={this.props.resetState}
                    />
                </td>
              </tr>
            ))
            )}
        </tbody>
      </Table>
            </Card>
    );
  }
}

export default EmployeeList;
