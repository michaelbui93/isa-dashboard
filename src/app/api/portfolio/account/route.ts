import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getT212ClientForUser } from '@/lib/t212/getClientForUser'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const t212 = await getT212ClientForUser(user.id)
    const account = await t212.getAccount()
    return NextResponse.json(account)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
