---
id: doc3
title: Transfer Tokens
---

Binance Chain is essentially a digital asset creation and exchange platform.
The features listed below are currently supported on Binance Chain:

* The Issuance, Burning, Minting and Freezing of Tokens
* Transfer of Tokens
* The Listing and Delisting of Tokens

Transfer is the most basic transaction Binance Chain supports, it moves assets among different addresses.

Please note the fees must be paid first in`BNB` before the transaction can be executed.



## Create an Account

The first thing you’ll need to do anything on the Binance Chain is an account. Each account has a public key and a private key. It is created by a user of the blockchain. It also includes account number and sequence number for replay protection. Whenever a new address receives an asset, the corresponding transaction would create an Account for that address, which contains balances across all assets that are owned on this address.

The balance (the amount of tokens) of each asset is composed of 3 different parts:

* Available: the amount of tokens that can be transferred, and spent to swap (buy) other assets
* Locked: the amount of tokens that has been used in any outstanding orders. Once the order terminates (either filled, canceled or expired), the locked amount will decrease.
* Frozen: the amount of tokens that has been frozen via Freeze transactions.

Because the private key must be kept secret, you can generate the private key with the following command:

<!--DOCUSAURUS_CODE_TABS-->
<!--JavaScript-->

```js
// generate key entropy
const privateKey = crypto.generatePrivateKey()
// get an address
const address = crypto.getAddressFromPrivateKey(privateKey)

const BnbApiClient = require('@binance-chain/javascript-sdk');
const axios = require('axios');
const bnbClient = new BnbApiClient(api);
const httpClient = axios.create({ baseURL: api });
bnbClient.chooseNetwork("testnet"); // or this can be "mainnet"
bnbClient.setPrivateKey(privKey);
bnbClient.initChain();

const address = bnbClient.getClientKeyAddress();

console.log('address: ',address)
```
<!--Golang-->

```golang
//-----   Init KeyManager  -------------
km, _ := NewKeyManager()
//-----   Init sdk  -------------
client, err := sdk.NewDexClient("testnet-dex.binance.org", types.TestNetwork, keyManager)
accn,_:=client.GetAccount(client.GetKeyManager().GetAddr().String())
//-----   Print Address
fmt.Println(accn)
```

<!--python-->

```py
from binance_chain.wallet import Wallet
from binance_chain.environment import BinanceEnvironment

testnet_env = BinanceEnvironment.get_testnet_env(, env=testnet_env)
wallet = Wallet.create_random_wallet(env=env)
print(wallet.address)
```

<!--END_DOCUSAURUS_CODE_TABS-->