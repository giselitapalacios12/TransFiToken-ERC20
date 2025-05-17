require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      // Configuración para la red local de desarrollo
    },
    // Puedes añadir más redes aquí (testnet, mainnet, etc.)
  },
  paths: {
    sources: "./",
    tests: "./test",
    artifacts: "./artifacts",
  },
};
