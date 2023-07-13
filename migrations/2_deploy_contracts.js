// var Election = artifacts.require("./Election.sol");
var ProductAuthentication = artifacts.require("./ProductAuthentication.sol");

module.exports = function(deployer) {
  deployer.deploy(ProductAuthentication);
  // deployer.deploy(Election);
};
