require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      // Configuración para la red local de desarrollo
    },
    // Puedes añadir más redes aquí (testnet, mainnet, etc.)
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    artifacts: "./artifacts",
    cache: "./cache"
  },
};
