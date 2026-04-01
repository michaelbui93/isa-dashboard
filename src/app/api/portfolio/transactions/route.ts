import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getT212ClientForUser } from '@/lib/t212/getClientForUser'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const t212 = await getT212ClientForUser(user.id)
    const [orders, dividends] = await Promise.all([
      t212.getOrders(),
      t212.getDividends(),
    ])

    type UnifiedItem = { date: string; type: string; [key: string]: unknown }

    const unified: UnifiedItem[] = [
      ...orders.items.map((o) => ({ ...o, date: o.dateModified, _source: 'order' })),
      ...dividends.items.map((d) => ({ ...d, date: d.dateModified, _source: 'dividend' })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return NextResponse.json(unified)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
