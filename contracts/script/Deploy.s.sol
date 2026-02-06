// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/Arena.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        Arena arena = new Arena();
        
        console.log("Arena deployed at:", address(arena));
        console.log("FollowerRegistry deployed at:", address(arena.followerRegistry()));
        
        vm.stopBroadcast();
    }
}


