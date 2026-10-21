// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/GenesisToken.sol";
import "../src/Vault.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        GenesisToken token = new GenesisToken();
        SecuredVault vault = new SecuredVault();

        console.log("GenesisToken deployed at:", address(token));
        console.log("SecuredVault deployed at:", address(vault));

        vm.stopBroadcast();
    }
}
