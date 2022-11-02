require("@nomiclabs/hardhat-ethers");
require('@nomiclabs/hardhat-waffle');
require("@openzeppelin/hardhat-upgrades");
require("@nomiclabs/hardhat-etherscan");
require('hardhat-contract-sizer');
require('hardhat-docgen');
require('solidity-coverage')
require('dotenv').config();

module.exports = {
  solidity: {
    version: "0.8.2",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    goerli: {
      url: `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY_GOERLI}`,
      accounts: [process.env.PRI_KEY],
    },
    mainnet: {
      url: `https://eth-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY_MAINNET}`,
      accounts: [process.env.PRI_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  docgen: {
    path: './docs',
    clear: true,
    runOnCompile: true,
  }
};
