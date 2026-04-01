import type { T212Account, T212Position, T212HistoryItem, T212Dividend } from './types'

const BASE_URLS = {
  live: 'https://live.trading212.com/api/v0',
  demo: 'https://demo.trading212.com/api/v0',
} as const

export class T212Client {
  private apiKey: string
  private baseUrl: string

  constructor(apiKey: string, environment: 'live' | 'demo' = 'live') {
    this.apiKey = apiKey
    this.baseUrl = BASE_URLS[environment]
  }

  private async fetch<T>(path: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      headers: {
        'Authorization': this.apiKey,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 }, // 5 min cache
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`T212 API error ${res.status}: ${text}`)
    }

    return res.json()
  }

  async getAccount(): Promise<T212Account> {
    return this.fetch('/equity/account/cash')
  }

  async getPositions(): Promise<T212Position[]> {
    return this.fetch('/equity/portfolio')
  }

  async getOrders(limit = 50): Promise<{ items: T212HistoryItem[] }> {
    return this.fetch(`/equity/history/orders?limit=${limit}`)
  }

  async getDividends(limit = 50): Promise<{ items: T212Dividend[] }> {
    return this.fetch(`/history/dividends?limit=${limit}`)
  }
}
