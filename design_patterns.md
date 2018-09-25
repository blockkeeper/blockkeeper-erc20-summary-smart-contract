# Design Patterns

## Updatable Pattern

The project consist of two smart contracts: a data storage and a logic contract. While the data storage contract is responsible to store all data and implement the basic data structures the logic is used to access the data storage.

In case of an implementation issue in the logic a new logic contract (update) can be deployed and the access of the old logic can be revoked. This will leave the new logic contract with the old data storage.

## Emergency Stop

In case of a big problem the execution of the main functions can be stopped.
