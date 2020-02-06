---
id: go-websocket
title: Go Websocket Client
---

## Substribe to events

### **1. New Block Height**

- Example:

```go
err := client.SubscribeBlockHeightEvent(quit, func(event *websocket.BlockHeightEvent) {
		bz, _ := json.Marshal(event)
		fmt.Println(string(bz))
		//Todo your process logic here
	}, func(err error) {
	}, nil)
```

- **Event Data Structure**

```python
type BlockHeightEvent struct {
	BlockHeight int64 `json:"h"` // The latest block height, "h": 1499405658658,
}
```

**Example**:

```python
{h: 2867288}
```



### **2. Order Event**

- Example:

```go
err = client.SubscribeTradeEvent(tradeSymbol, types.NativeSymbol, quit, func(events []*websocket.TradeEvent) {
		bz, err := json.Marshal(events)
		assert.NoError(t, err)
		fmt.Println(string(bz))
	}, func(err error) {
		assert.NoError(t, err)
	}, nil)

```

- **Event Data Structure**

```python
type OrderEvent struct {
	EventType            string       `json:"e"` // Event type for this order
	EventTime            int64        `json:"E"` // Event height
	Symbol               string       `json:"s"` // Token symbol
	Side                 int8         `json:"S"` // Trade side: 1 for Buy; 2 for Sell
	OrderType            int8         `json:"o"` // Order type, 2 for only support LIMIT
	TimeInForce          int8         `json:"f"` // Time in force,  1 for Good Till Expire (GTE); 3 for Immediate Or Cancel (IOC)
	OrderQty             types.Fixed8 `json:"q"` // Order quantity
	OrderPrice           types.Fixed8 `json:"p"` // Order price
	CurrentExecutionType string       `json:"x"` // Current execution type: "NEW", always `NEW` for now `will be published`
	CurrentOrderStatus   string       `json:"X"` //Current order status, possible values Ack, Canceled, Expired, IocNoFill, PartialFill, FullyFill, FailedBlocking, FailedMatching, Unknown
	OrderID              string       `json:"i"` //  Order ID
	LastExecutedQty      types.Fixed8 `json:"l"` // Last executed quantity
	LastExecutedPrice    types.Fixed8 `json:"L"` // Last executed price
	CommulativeFilledQty types.Fixed8 `json:"z"` // Cumulative filled quantity
	CommissionAmount     string       `json:"n"` //  Commission amount for all user trades within a given block. Fees will be displayed with each order but will be charged once. Fee can be composed of a single symbol, ex: "10000BNB" or multiple symbols if the available "BNB" balance is not enough to cover the whole fees, ex: "1.00000000BNB;0.00001000BTC;0.00050000ETH"
	TransactionTime      int64        `json:"T"` // Transaction time
	TradeID              string       `json:"t"` // Trade ID
	OrderCreationTime    int64        `json:"O"` // Order creation time
}
```

**Example**:

```python
 {
    "stream": "orders",
    "data": [{
        "e": "executionReport",
        "E": 1499405658658,
        "s": "ETH_BTC",
        "S": 1,
        "o": 2,
        "f": 1,
        "q": "1.00000000",
        "p": "0.10264410",
        "x": "NEW",
        "X": "Ack",
        "i": "91D9...7E18-2317",
        "l": "0.00000000",
        "z": "0.00000000",
        "L": "0.00000000",
        "n": "10000BNB",
        "T": 1499405658657,
        "t": "TRD1",
        "O": 1499405658657,
    }
  }
```

### **3. Trade Event**

- Code Example:

```go
err = client.SubscribeTradeEvent(tradeSymbol, types.NativeSymbol, quit, func(events []*websocket.TradeEvent) {
		bz, err := json.Marshal(events)
		fmt.Println(string(bz))
	}, func(err error) {
	}, nil)
```

- **Event Data Structure**

```python
type TradeEvent struct {
	EventType     string       `json:"e"`  // Event type
	EventTime     int64        `json:"E"`  // Event height
	Symbol        string       `json:"s"`  // Asset Symbol
	TradeID       string       `json:"t"`  // Trade ID
	Price         types.Fixed8 `json:"p"`  // Price
	Qty           types.Fixed8 `json:"q"`  // Quantity
	BuyerOrderID  string       `json:"b"`  // Buyer order ID
	SellerOrderID string       `json:"a"`  // Seller order ID
	TradeTime     int64        `json:"T"`  // Trade time
	SellerAddress string       `json:"sa"` // SellerAddress
	BuyerAddress  string       `json:"ba"` // BuyerAddress
}
```

**Example**:

```python
{
    "stream": "trades",
    "data": [{
        "e": "trade",
        "E": 123456789,
        "s": "BNB_BTC",
        "t": "12345",
        "p": "0.001",
        "q": "100",
        "b": "88",
        "a": "50",
        "T": 123456785,
        "sa": "bnb1me5u083m2spzt8pw8vunprnctc8syy64hegrcp",
        "ba": "bnb1kdr00ydr8xj3ydcd3a8ej2xxn8lkuja7mdunr5"
    }
}
```

### **4. Market Diff Event**

- Code Example:

```go
err = client.SubscribeMarketDiffEvent(tradeSymbol, types.NativeSymbol, quit, func(event *websocket.MarketDeltaEvent) {
		bz, err := json.Marshal(event)
		fmt.Println(string(bz))
	}, func(err error) {
	}, nil)
```

- **Event Data Structure**

```python
type MarketDeltaEvent struct {
	EventType string           `json:"e"` //  Event type
	EventTime int64            `json:"E"` //  Event height
	Symbol    string           `json:"s"` // Asset Symbol
	Bids      [][]types.Fixed8 `json:"b"` // Bid Price
	Asks      [][]types.Fixed8 `json:"a"` // Ask Price
}
```

**Example**:

```python
{
    "stream": "marketDiff",
    "data": {
        "e": "depthUpdate",   // Event type
        "E": 123456789,       // Event time
        "s": "BNB_BTC",       // Symbol
        "b": [                // Bids to be updated
            [
            "0.0024",         // Price level to be updated
            "10"              // Quantity
            ]
        ],
        "a": [                // Asks to be updated
            [
            "0.0026",         // Price level to be updated
            "100"             // Quantity
            ]
        ]
    }
}
```

### **5. Market Depth  Event**

- Code Example:

```go
err = client.SubscribeMarketDepthEvent(tradeSymbol, types.NativeSymbol, quit, func(event *websocket.MarketDepthEvent) {
		bz, err := json.Marshal(event)
		fmt.Println(string(bz))
	}, func(err error) {
	}, nil)
```

- **Event Data Structure**

```python
type MarketDepthEvent struct {
	LastUpdateID int64    `json:"lastUpdateId"` // "lastUpdateId": 160,
	Symbol       string    `json:"symbol"`  //  asset symbol
	Bids         [][]types.Fixed8 `json:"bids"` // array of bids
	Asks         [][]types.Fixed8 `json:"asks"`  // array of ask
}
```

**Example**:

```python
{
    "stream": "marketDepth",
    "data": {
        "lastUpdateId": 160,    // Last update ID
        "symbol": "BNB_BTC",    // symbol
        "bids": [               // Bids to be updated
            [
            "0.0024",           // Price level to be updated
            "10"                // Quantity
            ]
        ],
        "asks": [               // Asks to be updated
            [
            "0.0026",           // Price level to be updated
            "100"               // Quantity
            ]
        ]
    }
}
```

### **6. Account  Event**

- Code Example:

```go
err := client.SubscribeAccountEvent(client.GetKeyManager().GetAddr().String(), quit, func(event *websocket.AccountEvent) {
		bz, _ := json.Marshal(event)
		fmt.Println(string(bz))
	}, func(err error) {
}, nil)
```

- **Event Data Structure**

```python
type AccountEvent struct {
	EventType string              `json:"e"` // Event type
	EventTime int64               `json:"E"` // Event time
	Balances  []EventAssetBalance `json:"B"` // list of changes to account
}
```

```python
type EventAssetBalance struct {
	Asset  string       `json:"a"` // Asset Symbol
	Free   types.Fixed8 `json:"f"` // Free amount
	Frozen types.Fixed8 `json:"r"` // Frozen amount
	Locked types.Fixed8 `json:"l"` // Locked amount
}
```

**Example**:

```python
{
    "stream": "accounts",
    "data": [{
      "e": "outboundAccountInfo",   // Event type
      "E": 1499405658849,           // Event height
      "B": [                        // Balances array
        {
          "a": "LTC",               // Asset
          "f": "17366.18538083",    // Free amount
          "l": "0.00000000",        // Locked amount
          "r": "0.00000000"         // Frozen amount
        },
        {
          "a": "BTC",
          "f": "10537.85314051",
          "l": "2.19464093",
          "r": "0.00000000"
        },
        {
          "a": "ETH",
          "f": "17902.35190619",
          "l": "0.00000000",
          "r": "0.00000000"
        }
      ]
    }]
}
```

### **7. KLine  Event**

- Code Example:

```go
err = client.SubscribeKlineEvent(tradeSymbol, types.NativeSymbol, websocket.OneMinuteInterval, quit, func(event *websocket.KlineEvent) {
		bz, err := json.Marshal(event)
		fmt.Println(string(bz))
	}, func(err error) {
}, nil)
```

- **Event Data Structure**

```python
type KlineEvent struct {
	EventType string           `json:"e"` // Event type
	EventTime int64            `json:"E"`  // Event height
	Symbol    string           `json:"s"` // Asset symbol
	Kline     KlineRecordEvent `json:"k"` //list of kline record
}

// KlineRecordEvent record structure as received from the kafka messages stream
type KlineRecordEvent struct {
	Timestamp        int64        `json:"-"`
	Symbol           string       `json:"s"` // Symbol
	OpenTime         int64        `json:"t"` // Kline start time
	CloseTime        int64        `json:"T"` // Kline close time
	Interval         string       `json:"i"` // Interval
	FirstTradeID     string       `json:"f"` // First trade ID
	LastTradeID      string       `json:"L"` // Last trade ID
	OpenPrice        types.Fixed8 `json:"o"` // Open price
	ClosePrice       types.Fixed8 `json:"c"` // Close price
	HighPrice        types.Fixed8 `json:"h"` // High price
	LowPrice         types.Fixed8 `json:"l"` // Low price
	Volume           types.Fixed8 `json:"v"` // Base asset volume
	QuoteAssetVolume types.Fixed8 `json:"q"` // Quote asset volume
	NumberOfTrades   int32        `json:"n"` // Number of trades
	Closed           bool         `json:"x"` //Is this kline closed?
}
```

**Example**:

```python
{
  "stream": "kline_1m",
  "data": {
    "e": "kline",         // Event type
    "E": 123456789,       // Event time
    "s": "BNBBTC",        // Symbol
    "k": {
      "t": 123400000,     // Kline start time
      "T": 123460000,     // Kline close time
      "s": "BNBBTC",      // Symbol
      "i": "1m",          // Interval
      "f": "100",         // First trade ID
      "L": "200",         // Last trade ID
      "o": "0.0010",      // Open price
      "c": "0.0020",      // Close price
      "h": "0.0025",      // High price
      "l": "0.0015",      // Low price
      "v": "1000",        // Base asset volume
      "n": 100,           // Number of trades
      "x": false,         // Is this kline closed?
      "q": "1.0000",      // Quote asset volume
    }
  }
}
```

### **8. Ticker  Event**

- Code Example:

```go
err := client.SubscribeAllTickerEvent(quit, func(events []*websocket.TickerEvent) {
		bz, _ := json.Marshal(events)
		fmt.Println(string(bz))
	}, func(err error) {
	}, nil)
```

- **Event Data Structure**

```python
type TickerEvent struct {
	EventType          string       `json:"e"`
	EventTime          int64        `json:"E"`
	Symbol             string       `json:"s"` // Symbol
	PriceChange        types.Fixed8 `json:"p"` // Price change
	PriceChangePercent types.Fixed8 `json:"P"` // Price change percent
	WeightedAvgPrice   types.Fixed8 `json:"w"`// Weighted average price
	PrevClosePrice     types.Fixed8 `json:"x"` // Previous day's close price
	LastPrice          types.Fixed8 `json:"c"` // Current day's close price
	LastQuantity       types.Fixed8 `json:"Q"`// Close trade's quantity
	BidPrice           types.Fixed8 `json:"b"`// Best bid price
	BidQuantity        types.Fixed8 `json:"B"`// Best bid quantity
	AskPrice           types.Fixed8 `json:"a"`// Best ask price
	AskQuantity        types.Fixed8 `json:"A"`// Best ask quantity
	OpenPrice          types.Fixed8 `json:"o"`// Open price
	HighPrice          types.Fixed8 `json:"h"`// High price
	LowPrice           types.Fixed8 `json:"l"` // Low price
	Volume             types.Fixed8 `json:"v"` // Total traded base asset volume
	QuoteVolume        types.Fixed8 `json:"q"` // Total traded quote asset volume
	OpenTime           int64        `json:"O"` // Statistics open time
	CloseTime          int64        `json:"C"`// Statistics close time
	FirstID            string       `json:"F"`// First trade ID
	LastID             string       `json:"L"`// Last trade Id
	Count              int64        `json:"n"`// Total number of trades
}
```

**Example**:

```python
{
  "stream": "ticker",
  "data": {
    "e": "24hrTicker",  // Event type
    "E": 123456789,     // Event time
    "s": "BNBBTC",      // Symbol
    "p": "0.0015",      // Price change
    "P": "250.00",      // Price change percent
    "w": "0.0018",      // Weighted average price
    "x": "0.0009",      // Previous day's close price
    "c": "0.0025",      // Current day's close price
    "Q": "10",          // Close trade's quantity
    "b": "0.0024",      // Best bid price
    "B": "10",          // Best bid quantity
    "a": "0.0026",      // Best ask price
    "A": "100",         // Best ask quantity
    "o": "0.0010",      // Open price
    "h": "0.0025",      // High price
    "l": "0.0010",      // Low price
    "v": "10000",       // Total traded base asset volume
    "q": "18",          // Total traded quote asset volume
    "O": 0,             // Statistics open time
    "C": 86400000,      // Statistics close time
    "F": "0",           // First trade ID
    "L": "18150",       // Last trade Id
    "n": 18151          // Total number of trades
  }
}
```

