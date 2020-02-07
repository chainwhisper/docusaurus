---
id: go-intro
title: Go SDK Overview
---

The Go SDK is a set of packages for interacting with most aspects of the Binance Chain ecosystem. Developers can use it to interact with all services provided by fullnodes and accelerated nodes.

It includes the following core components:

* client - implementations of Binance Chain transaction types and query, such as for transfers and trading.
* common - core cryptographic functions, uuid functions and other useful functions.
* e2e - end-to-end test package for go-sdk developer. For common users, it is also a good reference to use go-sdk.
* keys - implement KeyManage to manage private key and accounts.
* types - core type of Binance Chain, such as coin, account, tx and msg.

