---
id: go-api
title: Go SDK Functions
---

## Notice

For read option, each API will need a Query parameter. Each Query parameter we provide a construct function: `NewXXXQuery`.
We recommend you to use this construct function when you new a Query parameter since the construction only need required parameters,
and for the optional parameters, you can use `WithXXX` to add it.

## Create & Post Transaction

There is one most important point you should notice that we use int64 to represent a decimal.
The decimal length is fixed 8, which means:
`100000000` is equal to `1`
`150000000` is equal to `1.5`
`1050000000` is equal to `10.5`

For a common transaction, the response is:

- **TxCommitResult**
  - Ok   **bool**, if the transaction accepted by chain.
  - Log  **string**, the error message of the transaction.
  - Hash **string**
  - Code **int32**, the result code. Zero represent fine.
  - Data **string**, different kind of transaction return different data message.

### Create Order
```go
createOrderResult, err := client.CreateOrder(tradeSymbol, nativeSymbol, txmsg.OrderSide.BUY, 100000000, 100000000, true)
```
#### Parameters
- baseAssetSymbol **string**
- quoteAssetSymbol **string**,
- op **int8**, enum options are [1,2], 1 means "BUY", 2 means "SELL".
- price **int64**
- quantity **int64**
- sync **bool**, whether wait chain check this transaction. If true, in most case you will get `Data` field of `TxCommitResult`,
otherwise, `Data` field of `TxCommitResult` will be empty.

#### Return
- **CreateOrderResult**
  - **TxCommitResult**
  - OrderId **string**, the order id of this order.


### Cancel Order
```go
cancelOrderResult, err := client.CancelOrder(tradeSymbol, nativeSymbol, createOrderResult.OrderId, createOrderResult.OrderId, true)
```
#### Parameters
- baseAssetSymbol **string**
- quoteAssetSymbol **string**
- id **string**, the order id.
- refId **string**, the order id will be fine.
- sync **bool**, whether wait chain check this transaction.

#### Return
- **CancelOrderResult**
  - **TxCommitResult**


### Send token
```go
send, err := client.SendToken([]msg.Transfer{{testAccount2, []types.Coin{{nativeSymbol, 100000000}}}, {testAccount3, []types.Coin{{nativeSymbol, 100000000}}}}, true)
```
#### Parameters
- transfers **[]Transfer**, the account address of users and coins that you want to send to.
- sync **bool**, whether wait chain check this transaction.

#### Return
  - **SendTokenResult**
  - **TxCommitResult**
### Mint token
```go
mint, err := client.MintToken(issue.Symbol, 100000000, true)
```
#### Parameters
- symbol **string**, which kind of token you want to freeze.
- amount **int64**
- sync **bool**, whether wait chain check this transaction.
#### Return
- **MintTokenResult**
  - **TxCommitResult**


### Freeze token
```go
freeze, err := client.FreezeToken(nativeSymbol, 100000000, true)
```
#### Parameters
- symbol **string**, which kind of token you want to freeze.
- amount **int64**
- sync **bool**, whether wait chain check this transaction.

#### Return
- **FreezeTokenResult**
  - **TxCommitResult**


### UnFreeze token
```go
unFreeze, err := client.UnfreezeToken(nativeSymbol, 100000000, true)
```
#### Parameters
- symbol **string**, which kind of token you want to unfreeze.
- amount **int64**
- sync **bool**, whether wait chain check this transaction.

#### Return
- **UnfreezeTokenResult**
  - **TxCommitResult**

### Burn token
```go
burn, err := client.BurnToken("Client-Token",100000000, true)
```
#### Parameters
- symbol **string**, which kind of token you want to unfreeze.
- amount **int64**
- sync **bool**, whether wait chain check this transaction.

#### Return
- **BurnTokenResult**
  - **TxCommitResult**



### Issue token
```go
issue, err := client.IssueToken("SDK-Token", "sdk", 10000000000000000, true, false)
```
#### Parameters
- name **string**, the name of your token.
- symbol **string**, a symbol of your token.
- supply **int64**
- sync **bool**, whether wait chain checks this transaction.
- mintable **bool**, whether you want mint token in the future.

#### Return
- **IssueTokenResult**
  - **TxCommitResult**
  - Symbol **string**, the actual symbol of your token. (which will end with three random alphabets).


### Submit ListTrade Proposal
```go
listTradingProposal, err := client.SubmitListPairProposal("New trading pair", txmsg.ListTradingPairParams{issue.Symbol, nativeSymbol, 1000000000, "my trade", time2.Now().Add(1 * time2.Hour)}, 200000000000, true)
```
#### Parameters
- title **string**,
- param **txmsg.ListTradingPairParams**
  - BaseAssetSymbol  **string**
  - QuoteAssetSymbol **string**
  - InitPrice        **int64**
  - Description      **string**
  - ExpireTime       **time.Time**, the expire time you active this list trading pair.
- initialDeposit **int64**, the amount of BNB you want deposit for this proposal.
- sync **bool**, whether wait chain check this transaction.
#### Return
- **SubmitProposalResult**
  - *TxCommitResult*
  - ProposalId *int64*, the proposal id generated by the chain. Useful when you vote or deposit for specified proposal.

### Vote Proposal
```go
vote, err := client.VoteProposal(listTradingProposal.ProposalId, txmsg.OptionYes, true)
```
#### Parameters
- proposalID **int64**, the id of the proposal you want to vote.
- option **txmsg.VoteOption**, enum vote options are: [OptionYes, OptionAbstain, OptionNo,O ptionNoWithVeto]
- sync bool, whether wait chain check this transaction.

#### Return
- **VoteProposalResult**
  - **TxCommitResult**

### List Trade pair
```go
lp,err:=client.ListPair(listTradingProposal.ProposalId,  issue.Symbol,  nativeSymbol, 1000000000, true)
```
#### Parameters
- proposalId **int64**, the proposal id that propose by you or others that want to create a new list trading pair. Make sure the proposal is passed.
- baseAssetSymbol **string**
- quoteAssetSymbol **string**
- initPrice **int64**
- sync **bool**,  whether wait chain check this transaction.

#### Return
- **ListPairResult**
  - **TxCommitResult**



### Timelock Tokens
```go
lockResult,err:=client.TimeLock("testlock",ctypes.Coins{{"BNB",100000000}},int64(time2.Now().Add(65*time2.Second).Unix()),true)
```
#### Parameters
- description **string**, you can put the reason for this lock here.
- amount **coins**
- lockTime **int64** : locktime in timestamp
- sync **bool**,  whether wait chain check this transaction.

#### Return
- **TimeLockResult**
  - **TxCommitResult**
  - **LickId**, *int64*, the index for your locking operation

### TimeUnlock Tokens
```go
unlockResult,err:= client.TimeUnLock(lockId,true)
```
#### Parameters
- lockId **int64** : Id of your lock record
- sync **bool**,  whether wait chain check this transaction.

#### Return
- **TimeUnLockResult**
  - **TxCommitResult**
  - **LickId**, *int64*, the index for your locking operation

### TimeRelock Tokens
```go
relockResult,err:=client.TimeReLock(lockResult.LockId,"testlock",ctypes.Coins{{"BNB",200000000}},int64(time2.Now().Add(65*time2.Second).Unix()),true)
```
#### Parameters
- lockId **int64** : Id of your lock record
- description **string**, you can put the reason for this lock here.
- amount **coins**
- lockTime **int64** : locktime in timestamp
- sync **bool**,  whether wait chain check this transaction.

#### Return
- **TimeReLockResult**
  - **TxCommitResult**
  - **LickId**, *int64*, the index for your locking operation


## Query API

### Get Account

```GO
account, err := client.GetAccount("Your address")
```
#### Parameters

- Address - **string** , The address of query account.

#### Returns


- AppAccount - The AppAccount object with the following structure:

	- base **BaseAccount**
	- Name  **string** ,name of this account
	- FrozenCoins **[]Coin** , the balances of frozen coins
	- LockedCoins  **[]Coin** , the balances of locked coins
	- Flags  **int64** ,  the flag info of this account

- BaseAccount - The baseaccount object with the following structure:

	- Number    **int64** , The account number of this user, which is a globally unique number.
	- Address   **string** , the address of this account, which is hash of the public key.
	- Balances  **[]Coin** , the balances of different kind of tokens.
	- PublicKey **[]uint8** , the public key of this user.
	- Sequence  **int64** , the next expected transaction sequence, which is used to prevent a replay attack.

### Get Markets
```
markets, err := client.GetMarkets(api.NewMarketsQuery().WithLimit(1))
```

#### Parameters

- **MarketsQuery**, The query object.
	- Offset **\*uint32** , optional, the offset of the first return symbol pair.
	- Limit  **\*uint32** , optional, the max length of return symbol pair.
#### Returns

- **[]SymbolPair**
  - **SymbolPair**,
    - TradeAsset **string**
    - QuoteAsset **string**
    - Price      **string**, the price of trade assert against quote assert.
    - TickSize   **string**, the minimum price movement of a trading instrument.
    - LotSize    **string**, refers to the quantity of an item ordered for delivery on a specific date or manufactured in a single production run.

### Get Depth
```go
depth, err := client.GetDepth(api.NewDepthQuery(tradeSymbol, nativeSymbol))
```
#### Parameters

- **DepthQuery**, The query object.
  - Symbol **string**, the combination of trade symbol and quote symbol.
  - Limit  **\*uint32**, optional, the max length of return depth.

#### Returns
- **MarketDepth**
	- Bids   **[][]string**, each bid get two string element, the first one is the buy price, the second one is buying quantity. example: `[ [ "0.0024", "10" ] ]`.
	- Asks   **[][]string**, each ask get two string element, the first one is the selling price, the second one is selling quantity. example:` [ [ "0.0024", "10" ] ]`.
	- Height **int64**, the bids and asks are based on a certain height of the chain.
}

### Get Kline
```go
kline, err := client.GetKlines(api.NewKlineQuery(tradeSymbol, nativeSymbol, "1h").WithLimit(1))

```
#### Parameters
- **KlineQuery**, The query object.
  - Symbol    **string**  ,the combination of trade symbol and quote symbol.
  - Interval  **string**  interval like: (5m, 1h, 1d, 1w, etc.).
  - Limit     **\*uint32** , optional.
  - StartTime **\*int64** , optional, which is a nano time.
  - EndTime   **\*int64**  , optional, which is a nano time.


#### Returns
- **[]Kline**
  - **Kline**
	- Close            **float64**, the close price .
	- CloseTime        **int64**, the close time.
	- High             **float64**, the highest price during the time.
	- Low              **float64**, the lowest price during the time.
	- NumberOfTrades   **int32**, the number of the trade transactions.
	- Open             **float64**, the open price.
	- OpenTime         **int64**,  the open time.
	- QuoteAssetVolume **float64**, the volume of the quote asset.
	- Volume           **float64**, the volume of trade asset.

### Get Ticker 24h

```go
ticker24h, err := client.GetTicker24h(api.NewTicker24hQuery().WithSymbol(tradeSymbol, nativeSymbol))
```
#### Parameters
- **Ticker24hQuery**, the query object.
  - Symbol **string**, the combination of trade symbol and quote symbol.

#### Returns
- **[]Ticker24h**
  - **Ticker24h**
  	- Symbol             **string**
	- AskPrice           **string** , in decimal form, e.g. 1.00000000
	- AskQuantity        **string** in decimal form, e.g. 1.00000000
	- BidPrice           **string** in decimal form, e.g. 1.00000000
	- BidQuantity        **string** in decimal form, e.g. 1.00000000
	- CloseTime          **int64**
	- Count              **int64**
	- FirstID            **string**
	- HighPrice          **string** in decimal form, e.g. 1.00000000
	- LastID             **string**
	- LastPrice          **string** in decimal form, e.g. 1.00000000
	- LastQuantity       **string** in decimal form, e.g. 1.00000000
	- LowPrice           **string** in decimal form, e.g. 1.00000000
	- OpenPrice          **string** in decimal form, e.g. 1.00000000
	- OpenTime           **int64**
	- PrevClosePrice     **string** in decimal form, e.g. 1.00000000
	- PriceChange        **string** in decimal form, e.g. 1.00000000
	- PriceChangePercent **string**
	- QuoteVolume        **string** ,in decimal form, e.g. 1.00000000
	- Volume             **string** ,i n decimal form, e.g. 1.00000000
	- WeightedAvgPrice   **string**

### Get Tokens

```go
tokens, err := client.GetTokens()
```
#### Parameters
- No parameters

#### Returns
- **[]Token**
  - **Token**
    - Name        **string**, the name of the token, which ends with three random alphabets.
	- TotalSupply **string**, the total supply of this token.
	- Owner       **string**, who issue this token, which is an address of an account.
	- OriginalSymbol **string**, the original symbol, which do not end with three random alphabets.
}

### Get Trades
```go
trades, err := client.GetTrades(api.NewTradesQuery(testAccount1.String(),true).WithSymbol(tradeSymbol, nativeSymbol))
```
#### Parameters
- **TradesQuery**, the query object.
  - SenderAddress **string**, the address of the trade sender.
  - Symbol        **string**, the symbol of the trade, combination of trade symbol and quote symbol.
  -	Offset        **\*uint32**, optional.
  -	Limit         **\*uint32**, optional.
  -	Start         **\*int64**, optional.
  -	End           **\*int64**, optional.
  -	Side          **enum string**, the side of trades, options is ["BUY","SELL"].
  - Total         **int**, total number required, 0 for not required and 1 for required; default not required, return total=-1 in response

#### Returns
- **Trades**
  - Trade **[]Trade**
    - BuyerOrderID  **string**, the order id of the buyer, which is combination of address and sequence.
    - BuyFee        **string**, the buy fee charged.
    - BuyerId       **string**, the buyer id.
    - Price         **string**, the trade price.
    - Quantity      **string**, the quantity of the trade.
    - SellFee       **string**,  the sell fee charged.
    - SellerId      **string**, the seller id.
    - SellerOrderID **string**, the order id of the buyer, which is combination of address and sequence.
    - Symbol        **string**,
    - Time          **int64**, when the trade happened.
    - TradeID       **string**
    - BlockHeight   **int64**, in what height of the chain the trade happened.
    - BaseAsset     **string**
    - QuoteAsset    **string**
  - Total **int**, the total num of trades.



### Get Time
```go
time, err := client.GetTime()

```
#### Parameters
No parameters.

#### Returns
- **Time**
  - ApTime    **string**, the time of access point.
  - BlockTime **string**, the time of the blockchain.


### Get Order
```go
order, err := client.GetOrder("Your Order Id")
```
#### Parameters
- OrderId **string**, which is combination of account address and sequence.

#### Returns
- **Order**
  - ID                   **string**, the order id.
  -	Owner                **string**, the account address who set the order.
  -	Symbol               **string**, the combination of trade symbol and quote symbol.
  -	Price                **string**, the sell price or buy price.
  -	Quantity             **string**, the quantity of this order.
  -	CumulateQuantity     **string**, the total executed quantity.
  -	Fee                  **string**, the fee charged.
  -	Side                 **int**, 1 for buy and 2 for sell
  -	Status               **enum string**, options is [ ACK, PARTIALLY_FILLED, IOC_NO_FILL, FULLY_FILLED, CANCELED, EXPIRED, FAIL_BLOCKING, FAIL_MATCH, UNKNOWN ]
  -	TimeInForce          **int**, 1 for Good Till Expire(GTE) order and 3 for Immediate Or Cancel (IOC)
  -	Type                 **int**, only 2 is available for now, meaning limit order
  -	TradeId              **string**
  -	LastExecutedPrice    **string**, the price of last executed.
  -	LastExecutedQuantity **string**, the quantity of last execution.
  -	TransactionHash      **string**
  -	TransactionTime      **string**


### Get Open Orders
```go
openOrders, err := client.GetOpenOrders(api.NewOpenOrdersQuery(testAccount1.String(),true))

```
#### Parameters
- **OpenOrdersQuery**
  - SenderAddress **string**,the combination of trade symbol and quote symbol.
  - Symbol        **string**
  - Offset        **\*uint32**, optional.
  - Limit         **\*uint32** , optional.
  - Total         **int** total number required, 0 for not required and 1 for required; default not required, return total=-1 in response

#### Returns
- **OpenOrders**
  - Order **[]Orde**
  - Total **string**

### Get Closed Orders

```go
closedOrders, err := client.GetClosedOrders(api.NewClosedOrdersQuery(testAccount1.String(),true).WithSymbol(tradeSymbol, nativeSymbol))
```
#### Parameters
- **ClosedOrdersQuery**
  - SenderAddress **string**,the combination of trade symbol and quote symbol.
  - Symbol        **string**
  - Offset        **\*uint32**, optional.
  - Limit         **\*uint32** , optional.
  - Total         **int** total number required, 0 for not required and 1 for required; default not required, return total=-1 in response
#### Returns
- **OpenOrders**
  - Order **[]Orde**
  - Total **string**

### Get Tx
```go
tx, err := client.GetTx(openOrders.Order[0].TransactionHash)

```
#### Parameters
- TxHash **string**, the hash of the transaction.

#### Returns
- **TxResult**
  -  Hash **string**
  -  Log  **string**, log info if the transaction failed.
  -  Data **string**, the return result of different kind of transactions.
  -  Code **int32**, the result code of this transaction. Zero represent a good result.

### Get Timelocks
```go
records, err := c.GetTimelocks(address)
```
#### Parameters
  - address  **string**, the account address who set the timelocks.

#### Returns

- **TimeLockRecord**
  -  Id  **string**, id for this record
  -  Description  **string**, timelock description.
  -  Amount **Coins**, locked amount.
  -  LockTime **int32**, locked time.

### Get Timelock
```go
records, err := c.GetTimelock(address, recordId)
```
#### Parameters
  - address  **string**, the account address who set the timelocks.
  - recordId  **int32**, id for this record

#### Returns

- **TimeLockRecord**
  -  Id  **string**, id for this record
  -  Description  **string**, timelock description.
  -  Amount **Coins**, locked amount.
  -  LockTime **int32**, locked time.

### Get Proposals
```go
proposals, err := c.GetProposals(status, 100)
```
#### Parameters
  - status  **string**, the proposal status.
  - limit  **int32**, return limit

#### Returns
- **TextProposal**
  -   ProposalID  **int64**, id for this proposal
  -   Title  **string**
  -   Description **string**
  -   ProposalType **byte**
  -   VotingPeriod ***time.Duration*
  -   Status  **string**
  -   TallyResult **TallyResult**
  -   SubmitTime  **time.Time**
  -   TotalDeposit  **Coins**
  -   VotingStartTime  **time.Time**

### Get Proposal
```go
proposals, err := c.GetProposal(int64(10))
```
#### Parameters
  - id  **int64**, the proposal ID.
#### Returns
- **TextProposal**
  -   ProposalID  **int64**, id for this proposal
  -   Title  **string**
  -   Description **string**
  -   ProposalType **byte**
  -   VotingPeriod ***time.Duration*
  -   Status  **string**
  -   TallyResult **TallyResult**
  -   SubmitTime  **time.Time**
  -   TotalDeposit  **Coins**
  -   VotingStartTime  **time.Time**

### Get TxInfo
```go
tx, err := c.TxInfoSearch(fmt.Sprintf("tx.height=%d", testTxHeight), false, 1, 10)
```
#### Parameters
  - txheight  **int64**, the proposal ID.

#### Returns
- **ResultTx**
  -  Hash **string**
  -  Log  **string**, log info if the transaction failed.
  -  Data **string**, the return result of different kind of transactions.
  -  Code **int32**, the result code of this transaction. Zero represent a good result.
