// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/Vault.sol";

// Reentrant attacker contract to test CEI immunity
contract ReentrancyAttacker {
    SecuredVault vault;

    constructor(address payable _vault) {
        vault = SecuredVault(_vault);
    }

    function attack() external payable {
        vault.deposit{value: msg.value}();
        vault.withdraw();
    }

    receive() external payable {
        // Attempt recursive reentrant call
        if (address(vault).balance >= 1 ether) {
            vault.withdraw();
        }
    }
}

contract SecuredVaultTest is Test {
    SecuredVault vault;
    ReentrancyAttacker attacker;
    address user = address(0xAA);

    function setUp() public {
        vault = new SecuredVault();
        attacker = new ReentrancyAttacker(payable(address(vault)));
        vm.deal(user, 10 ether);
        vm.deal(address(attacker), 2 ether);
    }

    function test_deposit_and_withdraw_success() public {
        vm.startPrank(user);
        vault.deposit{value: 5 ether}();
        assertEq(vault.balances(user), 5 ether);
        assertEq(vault.totalVaultBalance(), 5 ether);

        vault.withdraw();
        assertEq(vault.balances(user), 0);
        assertEq(vault.totalVaultBalance(), 0);
        vm.stopPrank();
    }

    function test_reentrancy_attack_reverts() public {
        // Honest user deposits 5 ETH into the vault
        vm.prank(user);
        vault.deposit{value: 5 ether}();

        // Attacker attempts to exploit and drain the vault
        // Must revert due to nonReentrant or CEI pattern
        vm.expectRevert();
        attacker.attack{value: 1 ether}();

        // Honest funds remain completely secure
        assertEq(vault.totalVaultBalance(), 5 ether);
    }
}
