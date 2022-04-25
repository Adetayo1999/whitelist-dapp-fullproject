const { ethers } = require("hardhat");

(async () => {
  const SefanNFT = await ethers.getContractFactory("SefanNFT");
  const deployedSefanNFT = await SefanNFT.deploy(
    "https://nft-satoshi.herokuapp.com/api/v1/meta/",
    "0x65eEACc74dC5B132fB28BF32A966903E48d9e51F"
  );
  await deployedSefanNFT.deployed();
  console.log(`SefanNFT ${deployedSefanNFT.address}`);
})();
