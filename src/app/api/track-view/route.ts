import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { page, referrer, userAgent } = await request.json();

    // Get client IP address from headers
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIp = request.headers.get('x-client-ip');

    // Use the first available IP address
    const ip = forwarded?.split(',')[0]?.trim() ||
               realIp ||
               clientIp ||
               'unknown';

    // Check if supabase is available
    if (!supabase) {
      console.error('Supabase client not initialized');
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }

    // Insert view record
    const { error } = await supabase
      .from('portfolio_views')
      .insert([
        {
          page,
          user_agent: userAgent,
          ip_address: ip,
          referrer,
          viewed_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      console.error('Error tracking view:', error);
      return NextResponse.json({ error: 'Failed to track view' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in track-view API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
