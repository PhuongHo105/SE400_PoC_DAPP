require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();


module.exports = {
  solidity: "0.8.28",
  networks: {
    // hardhat: {
    //   chainId: 1337,
    // },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL, // URL RPC của Sepolia
      accounts: [process.env.PRIVATE_KEY], // Private key của ví
      chainId: 11155111, // Chain ID của Sepolia
    },
  },
};
