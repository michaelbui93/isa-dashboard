import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { T212Client } from '@/lib/t212/client'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  // Get all users with T212 credentials
  const { data: credentials } = await supabase
    .from('t212_credentials')
    .select('user_id, api_key_encrypted, environment')

  if (!credentials?.length) return NextResponse.json({ message: 'No users to snapshot' })

  const today = new Date().toISOString().split('T')[0]
  const results = []

  for (const cred of credentials) {
    try {
      const t212 = new T212Client(cred.api_key_encrypted, cred.environment)
      const account = await t212.getAccount()

      await supabase.from('portfolio_snapshots').upsert({
        user_id: cred.user_id,
        snapshot_date: today,
        total_value: account.total,
        cash_balance: account.cash,
        invested_value: account.invested,
        ppl: account.result,
      }, { onConflict: 'user_id,snapshot_date' })

      results.push({ user_id: cred.user_id, status: 'ok' })
    } catch (e) {
      results.push({ user_id: cred.user_id, status: 'error', message: (e as Error).message })
    }
  }

  return NextResponse.json({ snapshotted: results.length, results })
}
