require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require("hardhat-deploy")
require("@nomiclabs/hardhat-etherscan");
require("hardhat-gas-reporter");
require("solidity-coverage");
// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [{version: "0.8.4"}]
  },
  networks: {
    hardhat: {
      chainId: 31337,
      blockConfirmaations: 1
    },
    rinkeby: {
      chainId: 4,
      blockConfirmaations: 6,
      url: process.env.RINKEBY_TESTNET_URL,
      accounts: process.env.RINKEBY_PRIVATE_KEY !== undefined ? [process.env.RINKEBY_PRIVATE_KEY] : [],
    }
  },
  defaultNetwork: "hardhat",
  namedAccounts: {
    deployer: {
      default: 0
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
