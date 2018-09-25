# Common Attacks Countermeasures

Reference:
https://consensys.github.io/smart-contract-best-practices/known_attacks

## Reentrancy

The contract does not execute any external code like call.value(). Only trusted code of the data storage contract is executed. 

## Cross-function Race Conditions

The contract does not execute any external code like call.value(). Only trusted code of the data storage contract is executed. 

## Pitfalls in Race Condition Solutions

The contract does not execute any external code like call.value(). Only trusted code of the data storage contract is executed. 

## Transaction-Ordering Dependence (TOD) / Front Running

The contract only adds and removes ERC20 contracts. The functions add and delete are implemented to work also on empty arrays etc. Even changing the order of the executions of add and delete will not cause any problems for the user.

## Timestamp Dependence

The timestamp of the current block is not used.

## Integer Overflow and/or Underflow

There is a potential underflow issue in the removeSmartContractByAddress function in the storage contract. If the endPointer reaches 0 the while loop could not stop that is why this line:

```
if(endPointer == 0) break;
```

takes care of a force leave in the decrement while loop so that an underflow can not happen here.

## DoS with (Unexpected) revert

No external code is called where an revert could be triggered. All required statements are fully controlled by the code of the contract.

## DoS with Block Gas Limit

This is potential problem in the removeSmartContractByAddress function. As the array size is unknown there is a potential requirement for multiple transactions. But the amount of contracts added is controlled by the owner. So no external party can force add new contracts and so create an issue in the delete phase.

## Forcibly Sending Ether to a Contract

The balance of the contract is not used anywhere and so a force add Ether to the contract will not cause any issues.
