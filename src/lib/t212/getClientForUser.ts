import { createAdminClient } from '@/lib/supabase/admin'
import { T212Client } from './client'

export async function getT212ClientForUser(userId: string): Promise<T212Client> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('t212_credentials')
    .select('api_key_encrypted, environment')
    .eq('user_id', userId)
    .single()

  if (error || !data) throw new Error('No T212 credentials found. Please add your API key in Settings.')

  return new T212Client(data.api_key_encrypted, data.environment as 'live' | 'demo')
}
