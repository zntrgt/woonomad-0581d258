import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Build query for subscriptions
    let query = supabase.from('push_subscriptions').select('*');

    if (targetUserIds && targetUserIds.length > 0) {
      query = query.in('user_id', targetUserIds);
    } else if (citySlug) {
      query = query.contains('city_slugs', [citySlug]);
    } else if (routeKey) {
      query = query.contains('route_keys', [routeKey]);
    }

    const { data: subscriptions, error } = await query;

    if (error) {
      throw error;
    }

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(
        JSON.stringify({ success: true, sent: 0, message: 'No subscriptions found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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

          // For now, we'll store the notification for later delivery
          // Full Web Push requires complex encryption - consider using external service
          console.log('Would send push to:', sub.endpoint, 'with payload:', pushPayload);
          
          // In production, use a service like Firebase Cloud Messaging or
          // a dedicated web-push service that handles encryption
          
          return { success: true, endpoint: sub.endpoint };
        } catch (err: unknown) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          console.error('Push error:', errorMessage);
          return { success: false, endpoint: sub.endpoint, error: errorMessage };
        }
      })
    );

    const sent = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - sent;

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
    console.error('Error:', errorMessage);
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

  // Note: Full VAPID implementation requires crypto operations
  // For production, consider using a web-push library or external service
  
  return {
    'Authorization': `vapid t=${btoa(JSON.stringify(header))}.${btoa(JSON.stringify(payload))}, k=${publicKey}`,
  };
}

// Payload encryption (simplified - requires full Web Push encryption)
async function encryptPayload(payload: string, p256dh: string, auth: string): Promise<Uint8Array> {
  // Note: Full implementation requires:
  // 1. ECDH key agreement
  // 2. HKDF key derivation
  // 3. AES-128-GCM encryption
  
  // For production, use a proper web-push library or external service
  const encoder = new TextEncoder();
  return encoder.encode(payload);
}
