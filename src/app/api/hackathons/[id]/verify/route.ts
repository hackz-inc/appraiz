import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface HackathonPasswordData {
  access_password: string
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { password } = await request.json()
    const hackathonId = params.id

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    // Use server client to bypass RLS
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('hackathon')
      .select('access_password')
      .eq('id', hackathonId)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Hackathon not found' },
        { status: 404 }
      )
    }

    const hackathonData = data as HackathonPasswordData
    const isValid = hackathonData.access_password === password

    return NextResponse.json({ isValid })
  } catch (error) {
    console.error('Password verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
