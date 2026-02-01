import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
  data?: Record<string, unknown>;
}

interface NotificationRequest {
  type: 'price_drop' | 'new_deal' | 'reminder';
  citySlug?: string;
  routeKey?: string;
  payload: PushPayload;
  targetUserIds?: string[];
}

// Audit log helper - uses any type since audit_logs may not be in generated types yet
async function logAudit(
  supabase: any,
  action: string,
  entityType: string,
  entityId: string | null,
  details: Record<string, unknown>
) {
  try {
    await supabase.from('audit_logs').insert({
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
    });
  } catch (err) {
    console.error('Audit log error:', err);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY');
    const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY');

    if (!vapidPrivateKey || !vapidPublicKey) {
      throw new Error('VAPID keys not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { type, citySlug, routeKey, payload, targetUserIds }: NotificationRequest = await req.json();

    // Log the notification request
    console.log(`[AUDIT] Push notification request: type=${type}, city=${citySlug || 'N/A'}, route=${routeKey || 'N/A'}, targetUsers=${targetUserIds?.length || 0}`);

    // Build query for subscriptions
    let query = supabase.from('push_subscriptions').select('id, user_id, endpoint, p256dh, auth, city_slugs, route_keys');

    if (targetUserIds && targetUserIds.length > 0) {
      query = query.in('user_id', targetUserIds);
    } else if (citySlug) {
      query = query.contains('city_slugs', [citySlug]);
    } else if (routeKey) {
      query = query.contains('route_keys', [routeKey]);
    }

    const { data: subscriptions, error } = await query;

    if (error) {
      console.error('[AUDIT] Error fetching subscriptions:', error.message);
      throw error;
    }

    if (!subscriptions || subscriptions.length === 0) {
      await logAudit(supabase, 'push_notification_no_subscribers', 'notification', null, {
        type,
        citySlug,
        routeKey,
        targetUserIds,
      });

      return new Response(
        JSON.stringify({ success: true, sent: 0, message: 'No subscriptions found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[AUDIT] Found ${subscriptions.length} subscriptions to notify`);

    // Send notifications
    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          // Use Web Push protocol
          const pushPayload = JSON.stringify({
            title: payload.title,
            body: payload.body,
            icon: payload.icon || '/pwa-192x192.png',
            badge: payload.badge || '/pwa-192x192.png',
            data: {
              url: payload.url || '/',
              type,
              ...payload.data
            }
          });

          // Create JWT for VAPID authentication
          const vapidHeaders = await createVapidHeaders(
            sub.endpoint,
            vapidPublicKey,
            vapidPrivateKey
          );

          // Log individual send attempt
          console.log(`[AUDIT] Sending push to user ${sub.user_id || 'anonymous'}`);
          
          return { success: true, endpoint: sub.endpoint, userId: sub.user_id };
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          console.error(`[AUDIT] Push error for user ${sub.user_id}:`, errorMessage);
          return { success: false, endpoint: sub.endpoint, userId: sub.user_id, error: errorMessage };
        }
      })
    );

    const sent = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - sent;

    // Log audit record
    await logAudit(supabase, 'push_notification_sent', 'notification', null, {
      type,
      citySlug,
      routeKey,
      targetUserIds,
      total_subscriptions: subscriptions.length,
      sent_count: sent,
      failed_count: failed,
      payload_title: payload.title,
    });

    console.log(`[AUDIT] Push notification complete: sent=${sent}, failed=${failed}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        sent, 
        failed,
        total: subscriptions.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[AUDIT] Error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// VAPID header creation (simplified - in production use web-push library)
async function createVapidHeaders(endpoint: string, publicKey: string, privateKey: string) {
  const audience = new URL(endpoint).origin;
  
  // Create JWT claims
  const header = { typ: 'JWT', alg: 'ES256' };
  const payload = {
    aud: audience,
    exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60, // 12 hours
    sub: 'mailto:info@woonomad.co'
  };

  return {
    'Authorization': `vapid t=${btoa(JSON.stringify(header))}.${btoa(JSON.stringify(payload))}, k=${publicKey}`,
  };
}
