const { expect } = require("chai");
const { ethers } = require("hardhat");

// Configuración para usar Chai con Hardhat y ethers.js
describe("TransFiToken", function () {
  let TransFiToken;
  let token;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Obtener las cuentas de prueba
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Desplegar el contrato
    TransFiToken = await ethers.getContractFactory("TransFiToken");
    token = await TransFiToken.deploy(ethers.utils.parseEther("1000000")); // 1 millón de tokens
    await token.deployed(); // usar deployed() en lugar de waitForDeployment() para ethers v5
  });

  describe("Deployment", function () {
    it("Debería asignar el suministro total al creador", async function () {
      const ownerBalance = await token.balanceOf(owner.address);
      expect(await token.totalSupply()).to.equal(ownerBalance);
    });

    it("Debería establecer el límite correcto por wallet", async function () {
      expect(await token.maxTokensPerWallet()).to.equal(ethers.utils.parseEther("1000"));
    });
  });

  describe("Transactions", function () {
    it("Debería permitir transferencias por debajo del límite", async function () {
      // Transferir 500 tokens de owner a addr1
      await token.transfer(addr1.address, ethers.utils.parseEther("500"));
      
      // Verificar que la transferencia fue exitosa
      expect(await token.balanceOf(addr1.address)).to.equal(ethers.utils.parseEther("500"));
    });

    it("Debería rechazar transferencias que excedan el límite por wallet", async function () {
      // Intentar transferir 1500 tokens (más que el límite) a addr1
      await expect(
        token.transfer(addr1.address, ethers.utils.parseEther("1500"))
      ).to.be.revertedWith("No puedes tener mas de 1000 TFI tokens");
    });

    it("Debería permitir al propietario cambiar el límite por wallet", async function () {
      await token.updateMaxTokensPerWallet(ethers.utils.parseEther("2000"));
      expect(await token.maxTokensPerWallet()).to.equal(ethers.utils.parseEther("2000"));
      
      // Ahora debería permitir transferencias hasta 2000 tokens
      await token.transfer(addr1.address, ethers.utils.parseEther("1500"));
      expect(await token.balanceOf(addr1.address)).to.equal(ethers.utils.parseEther("1500"));
    });
  });
});
