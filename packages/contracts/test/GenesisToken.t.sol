// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/GenesisToken.sol";

contract GenesisTokenTest is Test {
    GenesisToken token;
    address owner = address(this);
    address alice = address(0x1);
    address bob = address(0x2);

    function setUp() public {
        token = new GenesisToken();
    }

    function test_initial_supply_assigned_to_owner() public view {
        assertEq(token.balanceOf(owner), 1_000_000 * 10 ** 18);
        assertEq(token.totalSupply(), 1_000_000 * 10 ** 18);
    }

    function test_transfer_success() public {
        uint256 amount = 500 * 10 ** 18;
        token.transfer(alice, amount);
        assertEq(token.balanceOf(alice), amount);
        assertEq(token.balanceOf(owner), (1_000_000 * 10 ** 18) - amount);
    }

    function test_transfer_reverts_on_insufficient_balance() public {
        vm.prank(alice);
        vm.expectRevert();
        token.transfer(bob, 100);
    }

    function test_approve_and_transferFrom() public {
        uint256 amount = 1_000 * 10 ** 18;
        token.approve(alice, amount);
        assertEq(token.allowance(owner, alice), amount);

        vm.prank(alice);
        token.transferFrom(owner, bob, amount);
        assertEq(token.balanceOf(bob), amount);
        assertEq(token.allowance(owner, alice), 0);
    }

    function test_mint_only_owner() public {
        token.mint(alice, 100);
        assertEq(token.balanceOf(alice), 100);

        vm.prank(bob);
        vm.expectRevert(GenesisToken.Unauthorized.selector);
        token.mint(bob, 100);
    }
}
