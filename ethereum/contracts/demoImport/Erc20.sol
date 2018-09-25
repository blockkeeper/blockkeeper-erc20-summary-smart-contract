pragma solidity "0.4.20";

// At least one of the project contracts includes an import from a library/contract or an ethPM package.

contract Erc20 {
    /** ERC20 Interface **
    * Source: https://github.com/ethereum/EIPs/issues/20
    * Downloaded: 2018.08.16
    * Version without events and comments
    * The full version can be downloaded at the source link
    */
    
    function allowance(address, address) external constant returns (uint);
    function approve(address, uint) external returns (bool);
    function balanceOf(address) external constant returns (uint);
    function totalSupply() external constant returns (uint);
    function transfer(address, uint) external returns (bool);
}
