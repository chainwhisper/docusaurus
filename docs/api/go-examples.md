---
id: go-example
title: Go SDK Examples
---

## Create an address

In the following example, you can see how to use go-sdk for creating new address in testnet.

```go
package main

import (
	"fmt"
	"strconv"

	"github.com/binance-chain/go-sdk/client"
	"github.com/binance-chain/go-sdk/common/ledger"
	"github.com/binance-chain/go-sdk/common/types"
	"github.com/binance-chain/go-sdk/keys"
	"github.com/binance-chain/go-sdk/types/msg"
)

// To run this example, please make sure your key address have more than 1:BNB on testnet
func main() {
	types.Network = types.TestNetwork

    //create a random key manager
	keyManager, err := keys.NewKeyManager()
	if err != nil {
		fmt.Println(err.Error())
		return
	}

    //set receiver address
	receiverAddr, err := types.AccAddressFromBech32("tbnb15339dcwlq5nza4atfmqxfx6mhamywz35he2cvv")
	if err != nil {
		fmt.Println(err.Error())
		return
	}

    // init dex client
	dexClient, err := client.NewDexClient("testnet-dex.binance.org:443", types.TestNetwork, keyManager)
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	account, err := dexClient.GetAccount(keyManager.GetAddr().String())
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	floatAmount := 0.0
	for _, coin := range account.Balances {
		if coin.Symbol == "BNB" {
			fmt.Println(fmt.Sprintf("Your account has %s:BNB", coin.Free))
			floatAmount, err = strconv.ParseFloat(coin.Free.String(), 64)
			if err != nil {
				fmt.Println(err.Error())
				return
			}
			break
		}
	}
	if floatAmount <= 1.0 {
		fmt.Println("Your account doesn't have enough bnb")
	}

	fmt.Println(fmt.Sprintf("Please verify sign key address (%s) and transaction data", types.AccAddress(keyManager.GetAddr()).String()))

	//send transaction
	sendResult, err := dexClient.SendToken([]msg.Transfer{{receiverAddr, types.Coins{types.Coin{Denom: "BNB", Amount: 10000000}}}}, true)
	if err != nil {
		fmt.Println(err.Error())
		return
	}
	fmt.Println(fmt.Sprintf("Send result: %t", sendResult.Ok))
}
```