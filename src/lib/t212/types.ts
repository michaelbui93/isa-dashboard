export interface T212Account {
  id: number
  currencyCode: string
  cash: number
  freeForStocks: number
  invested: number
  result: number
  total: number
}

export interface T212Position {
  ticker: string
  quantity: number
  averagePrice: number
  currentPrice: number
  ppl: number
  fxPpl: number
  initialFillDate: string
  frontend: string
  maxBuy: number
  maxSell: number
  pieQuantity: number
}

export interface T212HistoryItem {
  dateModified: string
  fillId: string
  orderId: string
  quantity: number
  price: number
  ticker: string
  type: string
  executor: string
  orderedQuantity: number
  filledQuantity: number
}

export interface T212Dividend {
  ticker: string
  quantity: number
  amount: number
  grossAmountPerShare: number
  reference: string
  dateModified: string
  paidOn: string
  type: string
}
