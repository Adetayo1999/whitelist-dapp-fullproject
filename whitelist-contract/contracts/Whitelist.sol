//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WhiteList {

   uint8 public  maxWhitelistedAddress;

   uint8 public numAddressesWhitelisted;

   mapping(address => bool) public  whitelistedAddresses;

   constructor(uint8 _maxWhitelistAddresses){
       maxWhitelistedAddress = _maxWhitelistAddresses;
   }

   function addAddressToWhitelist() public {
       require(msg.sender != address(0), "Invalid Address");
       require(numAddressesWhitelisted < maxWhitelistedAddress, "Whitelist full");
       require(!whitelistedAddresses[msg.sender], "Address whitelisted");
       numAddressesWhitelisted += 1;
       whitelistedAddresses[msg.sender] = true;
   }

}