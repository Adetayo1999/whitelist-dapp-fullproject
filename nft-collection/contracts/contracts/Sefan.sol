//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import  "./IWhitelist.sol";

contract SefanNFT is ERC721Enumerable, Ownable{

  string baseTokenURI;
  uint public _price = 0.01 ether;
  bool public presaleStarted;
  bool public _paused;
  uint public maxTokenIds = 10;
  uint public tokenIds;
  uint public presaleEnded;
  IWhitelist whitelist;

    constructor(string memory _baseUrl, address _whitelistAddress) ERC721("SEFAN NFT", "SNFT"){
             baseTokenURI = _baseUrl;
             whitelist = IWhitelist(_whitelistAddress);
    }

    modifier onlyWhenNotPaused{
        require(!_paused, "Contract Paused");
        _;
    }

    function startPresale() public  onlyOwner{
        presaleEnded = block.timestamp + 5 minutes;
        presaleStarted = true;
    }

    function presaleMint() public payable onlyWhenNotPaused {
        require(presaleStarted && presaleEnded > block.timestamp, "Presale Ended");
        require(whitelist.whitelistedAddresses(msg.sender),"Address not whitelisted");
        require(tokenIds < maxTokenIds, "NFT sold out");
        require(msg.value >= _price, "Incorrect NFT price supplied");
          tokenIds++;
        _safeMint(msg.sender, tokenIds);

    }

    function mint() public payable onlyWhenNotPaused{
        require(presaleStarted && presaleEnded <= block.timestamp, "Presale Still on Going Or Has Not Started");
        require(tokenIds < maxTokenIds, "NFT sold out");
        require(msg.value >= _price, "Incorrect NFT price supplied");
          tokenIds++;
        _safeMint(msg.sender, tokenIds);
 
    }

    function _baseURI() internal view  virtual override returns (string memory){
         return baseTokenURI;
    }

    function setPaused(bool val) public onlyOwner {
         _paused = val;
    }

    function withDraw() public payable onlyOwner {
        (bool sent,) = owner().call{ value: address(this).balance }("");
        require(sent, "Transaction failed");
    }

    fallback() external payable {}
    receive() external payable {}

}