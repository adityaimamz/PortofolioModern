import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const revalidate = 0;

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase credentials missing.");
    }
    

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: rawLogs, error } = await supabase
      .from('chat_logs')
      .select('session_id, created_at, role')
      .order('created_at', { ascending: false })
      .limit(1000);

    if (error) {
      console.error("Gagal menarik data chat logs:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const sessionsMap = new Map<string, any>();

    rawLogs?.forEach((log) => {
      if (!sessionsMap.has(log.session_id)) {
        sessionsMap.set(log.session_id, {
          session_id: log.session_id,
          latest_message: log.created_at,
          message_count: 0
        });
      }
      sessionsMap.get(log.session_id)!.message_count += 1;
    });


    const sessionsArray = Array.from(sessionsMap.values()).sort(
      (a: any, b: any) => new Date(b.latest_message).getTime() - new Date(a.latest_message).getTime()
    );

    return NextResponse.json(sessionsArray);

  } catch (error: any) {
    console.error('API Admin Chat Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
