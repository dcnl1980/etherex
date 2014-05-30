EtherEx: A decentralized exchange built on Ethereum
===================================================

Abstract
--------

At the end of January 2014, an organisation called Ethereum announced their existence to the world and took the minds of developers and cryptocurrency enthusiasts all over the world. With such an innovative, versatile and secure platform to build upon, we now have the means to create the solution to the Achille's heel of cryptocurrencies, and that solution is a decentralized exchange.

This document will go further into the details of this implementation of a decentralized exchange built on Ethereum, the concepts, potential problems and solutions, requirements and innovations.


[TOC]



Requirements
------------

* Fully operational Ethereum network
* EtherEx website for external services
* A wallet and API per cryptocurrency



Problems and solutions
----------------------

Centralized exchanges suffer from a serious trust problem. A decentralized exchange solves most of these problems, but also has challenges of its own. We'll take a look at those in this section.


* Handling other cryptocurrencies (wallets, APIs, security)
* Possible blockchain bloat
* Fiat integration


Managing the integration of other cryptocurrencies is a challenging part of a decentralized exchange, and probably the main reason why none has emerged so far. Ethereum now provides a solution to the security and decentralization, but also brings the necessary building blocks for other cryptocurrencies to start interacting. EtherEx aims to be the first to take advantage of those possibilities.

Outside of the Ethereum network, EtherEx will need secure wallets and their related APIs to communicate information back into the trading engine. We could host a plethora of cryptocurrency clients with an API wrapper, find a provider like Blockchain.info for each currency, or a mix of both solutions per currency or even within the same currency. The first implementation for ETH/BTC will most likely use Blockchain.info for the low costs, security, track record and immediate availability of their API. Decisions will need to be taken regarding other trading pairs, and easier and more direct implementations into the Ethereum network will offer alternatives that will also have to be considered when they arise.

...


Implementation of a decentralized exchange on Ethereum
------------------------------------------------------

EtherEx is made of set of contracts running on the Ethereum blockchain. We've been running tests and simulations since their first proof-of-concept (poc) was made available and already made a number of contributions to the codebase of Ethereum itself. Although very basic at the moment, those were exactly what we needed to confirm the feasibility of this project, a sort of poc-within-a-poc. Below is an even more simplistic example outlining some of the basic ideas of a exchange contract :

```python
init:
    contract.storage[2] = msg.sender # Set sender as owner
code:
    statusindex = 1
    ownerindex = 2
    buyindex = 3
    sellindex = 4
    status = contract.storage[statusindex]
    owner = contract.storage[ownerindex]
    if status == 0 and msg.sender == owner:
        if tx.value < 1 * 10 ^ 18: # Minimum 1 ETH to initialize
            return(0)
        contract.storage[statusindex] = 1
        return(1)
    else:
        if tx.value < 1 * 10 ^ 18: # Minimum 1 ETH for this example
            return(0)
        buyorsell = msg.data[0]
        availabletobuy = contract.storage[sellindex]
        if buyorsell == 1:
            if availabletobuy <= msg.value: 
                return(0)
            contract.storage[sellindex] = availabletobuy - msg.value
            ret = send(500, msg.sender, 2 * msg.value)
            return(ret)
        elif buyorsell == 2:
            contract.storage[sellindex] = availabletobuy + msg.value
        return(1)
    return(0) # Should have returned something
```

You will notice how this is a one way exchange and barely touches the surface of what is possible. Remember that this contract is for the sake of the example only. Every version of the contracts that will be used will be different in almost every way, but the same concepts will still apply.

Let's take a look at what this example would do.

First we define the different storage indexes that will be used and get the contract status from the contract's storage. We then proceed to check if the contract has been initialized, and if not, make sure our owner is funding the exchange with at least 1 ether. If that verification passes, the owner's address is written into the contract's storage at the specified index and the contract's status is changed afterwards.

Once the contract is initialized, after the else statement, fees are calculated, and the transaction's value is checked to be at least 10 times the base fees, which are fixed for this example.

The `msg.data[0]` field is then checked to indicate a buy (passing 1 as first value) or a sell (passing 2 as first value) and the current balance available to buy. In our example, a seller would actually be giving away instead of selling. If the sender is buying and the balance allows it, we proceed to subtract the amount minus the fees from the balance in storage, send twice the value less the fees to the buyer, and send the exchange's owner part of the fees. If the sender is selling, as mentioned before, the transaction's value minus the fees is added to the balance in storage and the sender can now feel very generous. Exchange fees are also sent to the owner in that case.

This outlines how this example works only, and the real implementation will be much more complex and useful. Other contracts will be receiving transactions from EtherEx only, acting as secure data feeds thus allowing to update balances inside the exchange's contracts in a secure fashion.

! ... [fig. 1. Deposit and trade](http://etherex.org/sites/etherex.org/files/emm.png)  
fig. 1. Deposit and trade

Deposit : User ---> EtherEx multisig BTC wallet --> EtherEx to Ethereum TX (deposit confirmed) --> EtherEx updates from blockchain
Trade : User to Ethereum TX (trade) --> EtherEx & User update from blockchain



A New Approach
--------------

Ethereum now allows us to build an exchange with a decentralized but shared order book, and where every asset denominated in ether can be handled in a trust system.

[ More info about interactions between contracts and other feeds, backend servers, the website, other interfaces, limitations, etc. ]



Data structure and API
----------------------

A full description of the final contract storage data structure will be provided for anyone to read the exchange's orderbook and data.

### API

* __WARNING: Provisional API only, we are in the process of refactoring the API to offload more features to the interface__
* The API is the format of the data field for the Ethereum transactions.
* You only need an Ethereum client to use the API.


### Trades (buy / sell)
```
<operation> <amount> <price> <marketid>
```


### Deposits / Withdrawals
```
<operation> <amount> <currency>
```


### Cancellations
```
<operation> <id>
```


### Operations

Allowed values:
```
1 = BUY
2 = SELL
3 = DEPOSIT
4 = WITHDRAW
5 = CANCEL 
6 = ADDMARKET
```


### Amounts

* Amount in wei for ETH or XETH
* Amount in satoshi for BTC


### Prices

* Price in ETH/BTC * 10 ^ 8, as long integer
* Price in ETH/XETH * 10 ^ 8, as long integer


### Market IDs
```
1 = ETH/XETH
```
New market IDs will be created as DAO creators add their subcurrency to the exchange.


### Currencies
```
1 = ETH
2 = XETH
3 = BTC
```
New currency IDs will also be created as markets get added.


### Examples

Buy 1000 ETH at 1200 ETH/BTC (for 1.2 BTC)
```
1 1000000000000000000000 120000000000 1
```

Sell 1000 ETH at 1200 ETH/BTC (for 1.2 BTC)
```
2 1000000000000000000000 120000000000 1
```

Deposit 1 BTC
```
3 100000000 2
```

Withdraw 1 ETH
```
4 1000000000000000000 1
```

Cancel operation
```
5 0x3039
```


Notes
-----
* Your Ethereum address is used as your identity
* You can only make trades for your address



JSON API
========

A complete JSON-RPC API will be provided to retrieve information about the exchange, however providing your own nodes will be highly encouraged. All of the exchange's data will be available to you from the interface within the Ethereum client.

There will be no JSON or other type of trading API since the exchange is using Ethereum. Trading is done by sending transactions directly to the contract(s) running the exchange.



Interface
=========

EtherEx will provide an open source interface on the Ethereum platform both as a standalone web app that connects to your node and as a client-browser interface.



Conclusion
==========

Using blockchain technology allows to solve many problems by having the users and the exchange access the same data as easily. New challenges are introduced at many levels, and allocation of resources have to be carefully managed to allow a good user experience and provide useful decentralized services.