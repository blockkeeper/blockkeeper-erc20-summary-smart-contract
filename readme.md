ERC20 Summary Smart Contract
=======

# README

Plenty of smart contracts implement the ERC20 standard. All those contracts are deployed on the Ethereum blockchain but nowhere connected. This makes it especially hard to query the amount of tokens for a certain address somebody owns. Each ERC20 token needs to be queried one by one. This smart contract intends to summarize the amount of tokens owned by multiple ERC20 contracts which is useful if you do not want to rely on third party APIs like Etherscan. 

This smart contact was written as part of the ConsenSys Academy 2018 Developer Program.

## Get Started

To build the smart contract run:

```sh
$ npm install
$ npm run build
```

## Run Tests

To test the project you need to add a .env file with a MNEMONIC. You might use the example in: .env.template. This is not secure as it is a [public test vector](https://github.com/trezor/python-mnemonic/blob/master/vectors.json). Please don't use this MNEMONIC in any production environment. 

After run the tests:

```sh
$ npm install
$ npm test
```

## User Interface

This smart contract is in real usage for [blockkeeper.io](https://blockkeeper.io). Blockkeeper is a zero-knowloage portfolio tracker for crypto assets. This contract is used to drastically reduce the amount of calls made to any Ethereum node. 

You can find and deploy the user interface (refere to the local readme.md) at our [Github repository](https://github.com/blockkeeper/blockkeeper-frontend-web)

## Play With It

The contract and the ABI are published on Etherscan and can be found here:
https://etherscan.io/address/0x000003ed2eb44cded8ade31c01dda60da466b2d1#readContract

## License

[MIT License](license.md)
