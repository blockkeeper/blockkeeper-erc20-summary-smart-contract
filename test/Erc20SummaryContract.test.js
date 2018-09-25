require('dotenv').config();

const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider({ "mnemonic": process.env.MNEMONIC }));

const compiledErc20SummaryStorage = require('../ethereum/build/Erc20SummaryStorage.json');
const compiledErc20SummaryLogic = require('../ethereum/build/Erc20SummaryLogic.json');
const compiledErc20 = require('../ethereum/build/Erc20Test.json');

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  dataStorage = await new web3.eth.Contract(JSON.parse(compiledErc20SummaryStorage.interface))
    .deploy({ data: compiledErc20SummaryStorage.bytecode })
    .send({ from: accounts[0], gas: '1500000' });

  logic = await new web3.eth.Contract(JSON.parse(compiledErc20SummaryLogic.interface))
    .deploy({
      data: compiledErc20SummaryLogic.bytecode,
      arguments: [dataStorage.options.address]
    })
    .send({ from: accounts[1], gas: '1500000' });

  erc20 = await new web3.eth.Contract(JSON.parse(compiledErc20.interface))
    .deploy({ 
      data: compiledErc20.bytecode,
      arguments: ['Demo Token', 'DEMO', 18]
    })
    .send({ from: accounts[2], gas: '1500000' });

  secondErc20 = await new web3.eth.Contract(JSON.parse(compiledErc20.interface))
    .deploy({ 
      data: compiledErc20.bytecode,
      arguments: ['Demo Token 2', 'DEMO2', 18]
    })
    .send({ from: accounts[2], gas: '1500000' });

  // register logic in data storage
  await dataStorage.methods.allowAccess(logic.options.address).send({ from: accounts[0], gas: '1000000' });
  await dataStorage.methods.allowAccess(accounts[2]).send({ from: accounts[0], gas: '1000000' });
  await logic.methods.allowAccess(accounts[2]).send({ from: accounts[1], gas: '1000000' });
});

describe('Erc20SummaryStorage', () => {
  it('deploys a contract', () => {
    assert.ok(dataStorage.options.address);
  });

  it('has expected owner', async () => {
    const owner = await dataStorage.methods.owner().call();
    assert.equal(owner, accounts[0]);
  });

  it('adds a smart contract', async () => {
    await dataStorage.methods.addSmartContractByAddress(erc20.options.address).send({ from: accounts[2], gas: '1000000' });
    const contractAddress = await dataStorage.methods.getSmartContractByPosition(0).call();
    assert.equal(erc20.options.address, contractAddress);
  });

  it('does not add the same smart contract twice', async () => {
    await dataStorage.methods.addSmartContractByAddress(erc20.options.address).send({ from: accounts[2], gas: '1000000' });
    
    try {
      await dataStorage.methods.addSmartContractByAddress(erc20.options.address).send({ from: accounts[2], gas: '1000000' });
      // should never be reached as same contract is added again
      assert.equal(true, false);
    } catch (err) {
      assert.equal(err.message, 'VM Exception while processing transaction: revert');
    }
  });

  it('removes a smart contract in a list of two', async () => {
    await dataStorage.methods.addSmartContractByAddress(erc20.options.address).send({ from: accounts[2], gas: '1000000' });
    const sizeAfterOneAdd = await dataStorage.methods.getSmartContractsLength().call();
    assert.equal(sizeAfterOneAdd, 1);
    
    await dataStorage.methods.addSmartContractByAddress(secondErc20.options.address).send({ from: accounts[2], gas: '1000000' });
    const sizeAfterTwoAdd = await dataStorage.methods.getSmartContractsLength().call();
    assert.equal(sizeAfterTwoAdd, 2);

    await dataStorage.methods.removeSmartContractByAddress(erc20.options.address).send({ from: accounts[2], gas: '1000000' });
    const sizeAfterDelete = await dataStorage.methods.getSmartContractsLength().call();
    assert.equal(sizeAfterDelete, 1);
  });

  it('does not crash if a non existing address is deleted', async () => {
    await dataStorage.methods.addSmartContractByAddress(erc20.options.address).send({ from: accounts[2], gas: '1000000' });
    const sizeAfterOneAdd = await dataStorage.methods.getSmartContractsLength().call();
    assert.equal(sizeAfterOneAdd, 1);
    
    await dataStorage.methods.addSmartContractByAddress(secondErc20.options.address).send({ from: accounts[2], gas: '1000000' });
    const sizeAfterTwoAdd = await dataStorage.methods.getSmartContractsLength().call();
    assert.equal(sizeAfterTwoAdd, 2);

    await dataStorage.methods.removeSmartContractByAddress('0x0').send({ from: accounts[2], gas: '1000000' });
    const sizeAfterDelete = await dataStorage.methods.getSmartContractsLength().call();
    assert.equal(sizeAfterDelete, 2);
  });

  it('no exception if call remove on empty list', async () => {
    await dataStorage.methods.removeSmartContractByAddress(erc20.options.address).send({ from: accounts[2], gas: '1000000' });
  });

  it('removes the only smart contract', async () => {
    await dataStorage.methods.addSmartContractByAddress(erc20.options.address).send({ from: accounts[2], gas: '1000000' });
    const sizeAfterOneAdd = await dataStorage.methods.getSmartContractsLength().call();
    assert.equal(sizeAfterOneAdd, 1);

    await dataStorage.methods.removeSmartContractByAddress(erc20.options.address).send({ from: accounts[2], gas: '1000000' });
    const sizeAfterDelete = await dataStorage.methods.getSmartContractsLength().call();
    assert.equal(sizeAfterDelete, 0);
  });
});

describe('Erc20SummaryLogic', () => {
  it('deploys a contract', () => {
    assert.ok(logic.options.address);
  });

  it('has expected owner', async () => {
    const owner = await logic.methods.owner().call();
    assert.equal(owner, accounts[1]);
  });

  it('can access the data storage contract', async () => {
    const accessAllowed = await dataStorage.methods.accessAllowed(logic.options.address).call();
    assert.equal(accessAllowed, true);
  });

  it('can add a ERC20 contract', async () => {
    await logic.methods.addSmartContract(erc20.options.address).send({ from: accounts[2], gas: '1000000' });
  });

  it('does not add a non-ERC20 contract', async () => {
    try {
      await logic.methods.addSmartContract(dataStorage.options.address).send({ from: accounts[2], gas: '1000000' });
      // should never be reached as we try to add an non-ERC20 contract
      assert.equal(true, false);
    } catch (err) {
      assert.equal(err.message, 'VM Exception while processing transaction: revert');
    }
  });
  
  it('returns the correct amount of result (array size)', async () => {
    await logic.methods.addSmartContracts([erc20.options.address, secondErc20.options.address]).send({ from: accounts[2], gas: '1000000' });
    let data = await logic.methods.erc20BalanceForAddress('0x281055Afc982d96fAB65b3a49cAc8b878184Cb16').call();

    // assert two smart contracts
    assert.equal(data[0].length, 2);
    assert.equal(data[1].length, 2);
    assert.equal(data[2].length, 2);
  });

  it('returns the correct decimals amount', async () => {
    await logic.methods.addSmartContracts([erc20.options.address, secondErc20.options.address]).send({ from: accounts[2], gas: '1000000' });
    let data = await logic.methods.erc20BalanceForAddress('0x281055Afc982d96fAB65b3a49cAc8b878184Cb16').call();

    // assert decimals both equal to 18
    assert.equal(data[2][0], 18);
    assert.equal(data[2][1], 18);
  });
});
