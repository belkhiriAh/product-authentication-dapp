const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "my-app/src/contracts"),
  networks: {
    development: {
      network_id: "*",
      host: "127.0.0.1",
      // port: 7545, // for ganache gui
      port: 7545, // for ganache-cli
      gas: 6721975,
      gasPrice: 20000000000,
    },
    
  },
  compilers: {
    solc: {
      version: "0.6.0",    // Fetch exact version from solc-bin (default: truffle's version)
    },
   }
};
