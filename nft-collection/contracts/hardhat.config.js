require("dotenv").config();
require("@nomiclabs/hardhat-waffle");

const { ALCHEMY_API_KEY, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: ALCHEMY_API_KEY,
      accounts: [PRIVATE_KEY],
    },
  },
};
