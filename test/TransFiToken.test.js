const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TransFiToken", function () {
  let TransFiToken;
  let token;
  let owner;
  let addr1;
  let addr2;

  // Constante para convertir a unidades del token (18 decimales por defecto en ERC20)
  const toTokens = (amount) => ethers.utils.parseEther(amount.toString());
  
  beforeEach(async function () {
    // Obtener los signers (cuentas) para las pruebas
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    
    // Desplegar el contrato
    TransFiToken = await ethers.getContractFactory("TransFiToken");
    token = await TransFiToken.deploy(toTokens(1000000)); // 1 millón de tokens
    await token.deployed();
  });

  describe("Despliegue", function () {
    it("Debería asignar el suministro total al dueño", async function () {
      const ownerBalance = await token.balanceOf(owner.address);
      expect(await token.totalSupply()).to.equal(ownerBalance);
    });

    it("Debería establecer el nombre y símbolo correctamente", async function () {
      expect(await token.name()).to.equal("TransFi Token");
      expect(await token.symbol()).to.equal("TFI");
    });

    it("Debería establecer maxTokensPerWallet a 1000 tokens", async function () {
      const maxPerWallet = await token.maxTokensPerWallet();
      expect(maxPerWallet).to.equal(toTokens(1000));
    });
  });

  describe("Transacciones", function () {
    it("Debería permitir transferencias dentro del límite", async function () {
      // Transferir 500 tokens de owner a addr1
      await token.transfer(addr1.address, toTokens(500));
      const addr1Balance = await token.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(toTokens(500));
      
      // Transferir 200 tokens de addr1 a addr2
      await token.connect(addr1).transfer(addr2.address, toTokens(200));
      const addr2Balance = await token.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(toTokens(200));
    });

    it("Debería fallar si el destinatario excede maxTokensPerWallet", async function () {
      // Primero enviamos 800 tokens a addr1
      await token.transfer(addr1.address, toTokens(800));
      
      // Intentamos enviar 300 más, lo que excedería el límite de 1000
      await expect(
        token.transfer(addr1.address, toTokens(300))
      ).to.be.revertedWith("No puedes tener más de 1000 TFI tokens");
    });

    it("Debería permitir exactamente hasta el límite de 1000 tokens", async function () {
      // Enviar exactamente 1000 tokens a addr1
      await token.transfer(addr1.address, toTokens(1000));
      const addr1Balance = await token.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(toTokens(1000));
      
      // Intentar enviar 1 token más debería fallar
      await expect(
        token.transfer(addr1.address, toTokens(1))
      ).to.be.revertedWith("No puedes tener más de 1000 TFI tokens");
    });
  });
});
