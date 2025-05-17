// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TransFiToken is ERC20, Ownable {
    uint256 public maxTokensPerWallet;
    
    constructor(uint256 initialSupply) ERC20("TransFi Token", "TFI") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply);
        maxTokensPerWallet = 1000 * (10 ** decimals());
    }
    
    // Usar _update en lugar de _transfer (disponible en OpenZeppelin v5.0+)
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override virtual {
        // Verificar límite por wallet antes de la transferencia
        // Solo aplicar la restricción en transferencias normales (no en mint o burn)
        if (from != address(0) && to != address(0)) {
            require(
                balanceOf(to) + amount <= maxTokensPerWallet,
                "No puedes tener mas de 1000 TFI tokens"
            );
        }
        
        // Ejecutar la operación estándar
        super._update(from, to, amount);
    }
    
    // Permite al propietario actualizar el límite por wallet si es necesario
    function updateMaxTokensPerWallet(uint256 newLimit) external onlyOwner {
        maxTokensPerWallet = newLimit;
    }
}
