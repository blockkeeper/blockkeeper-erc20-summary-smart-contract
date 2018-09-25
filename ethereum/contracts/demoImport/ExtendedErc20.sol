pragma solidity "0.4.20";

// the Erc20 code can also be imported from a libary
// demo for Consensy Workshop

import "./Erc20.sol";

contract ExtendedErc20 is Erc20 {
    string public name;
    string public symbol;
    uint8 public decimals;
}
