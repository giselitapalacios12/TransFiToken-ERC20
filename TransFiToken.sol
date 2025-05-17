// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TransFiToken is ERC20 {
    uint256 public maxTokensPerWallet = 1000 * (10 ** decimals());

    constructor(uint256 initialSupply) ERC20("TransFi Token", "TFI") {
        _mint(msg.sender, initialSupply);
    }

    // Condición sin afectar el resto del contrato
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        super._beforeTokenTransfer(from, to, amount);

        // Solo se aplica si no es una quema (burn) o mint inicial
        if (to != address(0)) {
            require(
                balanceOf(to) + amount <= maxTokensPerWallet,
                "No puedes tener más de 1000 TFI tokens"
            );
        }
    }
}
