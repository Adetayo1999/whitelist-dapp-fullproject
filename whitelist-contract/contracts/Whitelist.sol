//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WhiteList {

   uint public  maxWhiteListAddress;

   uint public numOfWhiteListedAddress;

   mapping(address => bool) whitelistedAddresses;

   constructor(uint _maxWhiteListAddress){
       maxWhiteListAddress = _maxWhiteListAddress;
   }

   function addAddressToWhiteList(address _address) public {
       require( _address != address(0), "Invalid Address");
       require(numOfWhiteListedAddress < maxWhiteListAddress, "Whitelist full");
       require(!whitelistedAddresses[_address], "Address whitelisted");
       numOfWhiteListedAddress += 1;
       whitelistedAddresses[_address] = true;
   }

}