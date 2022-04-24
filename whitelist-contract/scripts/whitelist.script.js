const { ethers } = require("hardhat");

(async () => {
  const WhitelistedContract = await ethers.getContractFactory("WhiteList");
  const deployedWhitelistContract = await WhitelistedContract.deploy(10);
  await deployedWhitelistContract.deployed();
  console.log("Whitelist Address: " + deployedWhitelistContract.address);
})();
