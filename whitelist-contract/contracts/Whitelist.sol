//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WhiteList {

   uint8 public  maxWhiteListAddress;

   uint8 public numOfWhiteListedAddress;

   mapping(address => bool) public  whitelistedAddresses;

   constructor(uint8 _maxWhiteListAddress){
       maxWhiteListAddress = _maxWhiteListAddress;
   }

   function addAddressToWhiteList() public {
       require(msg.sender != address(0), "Invalid Address");
       require(numOfWhiteListedAddress < maxWhiteListAddress, "Whitelist full");
       require(!whitelistedAddresses[msg.sender], "Address whitelisted");
       numOfWhiteListedAddress += 1;
       whitelistedAddresses[msg.sender] = true;
   }

}