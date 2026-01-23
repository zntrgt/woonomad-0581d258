import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PriceAlert {
  id: string;
  user_id: string;
  alert_type: string;
  origin_code: string | null;
  destination_code: string | null;
  city_slug: string | null;
  target_price: number | null;
  current_price: number | null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const travelpayoutsToken = Deno.env.get('TRAVELPAYOUTS_API_TOKEN');
    const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY');
    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY');

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all active alerts
    const { data: alerts, error: alertsError } = await supabase
      .from('price_alerts')
      .select('*')
      .eq('is_active', true);

    if (alertsError) throw alertsError;
    if (!alerts || alerts.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No active alerts', checked: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const priceDrops: Array<{ alert: PriceAlert; oldPrice: number; newPrice: number }> = [];
    const priceHistory: Array<{ route_key: string; price: number; currency: string }> = [];

    // Check prices for each alert
    for (const alert of alerts as PriceAlert[]) {
      try {
        let newPrice: number | null = null;
        let routeKey = '';

        if (alert.alert_type === 'flight' && alert.origin_code && alert.destination_code) {
          routeKey = `${alert.origin_code}-${alert.destination_code}`;
          
          // Fetch current price from Travelpayouts
          if (travelpayoutsToken) {
            const today = new Date();
            const departDate = new Date(today.setDate(today.getDate() + 30));
            const returnDate = new Date(today.setDate(today.getDate() + 7));
            
            const priceUrl = `https://api.travelpayouts.com/aviasales/v3/prices_for_dates?origin=${alert.origin_code}&destination=${alert.destination_code}&departure_at=${departDate.toISOString().split('T')[0]}&return_at=${returnDate.toISOString().split('T')[0]}&unique=false&sorting=price&direct=false&cy=try&limit=1&page=1&token=${travelpayoutsToken}`;
            
            const priceResponse = await fetch(priceUrl);
            if (priceResponse.ok) {
              const priceData = await priceResponse.json();
              if (priceData.data && priceData.data.length > 0) {
                newPrice = priceData.data[0].price;
              }
            }
          }
        }

        if (newPrice !== null && routeKey) {
          // Save to price history
          priceHistory.push({
            route_key: routeKey,
            price: newPrice,
            currency: 'TRY'
          });

          // Check for price drop
          const oldPrice = alert.current_price;
          if (oldPrice && newPrice < oldPrice) {
            const dropPercentage = ((oldPrice - newPrice) / oldPrice) * 100;
            
            // Notify if price dropped more than 5%
            if (dropPercentage >= 5) {
              priceDrops.push({ alert, oldPrice, newPrice });
            }
          }

          // Update current price in alert
          await supabase
            .from('price_alerts')
            .update({ 
              current_price: newPrice, 
              last_checked_at: new Date().toISOString() 
            })
            .eq('id', alert.id);
        }
      } catch (err) {
        console.error(`Error checking alert ${alert.id}:`, err);
      }
    }

    // Save price history
    if (priceHistory.length > 0) {
      await supabase.from('price_history').insert(priceHistory);
    }

    // Send notifications for price drops
    for (const drop of priceDrops) {
      try {
        // Get user's push subscription
        const { data: subscriptions } = await supabase
          .from('push_subscriptions')
          .select('*')
          .eq('user_id', drop.alert.user_id);

        if (subscriptions && subscriptions.length > 0) {
          const dropPercentage = Math.round(((drop.oldPrice - drop.newPrice) / drop.oldPrice) * 100);
          
          // Call send-push-notification function
          await fetch(`${supabaseUrl}/functions/v1/send-push-notification`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseServiceKey}`
            },
            body: JSON.stringify({
              type: 'price_drop',
              targetUserIds: [drop.alert.user_id],
              payload: {
                title: '🎉 Fiyat Düştü!',
                body: `${drop.alert.origin_code} → ${drop.alert.destination_code} rotası %${dropPercentage} ucuzladı! Yeni fiyat: ₺${drop.newPrice.toLocaleString('tr-TR')}`,
                url: `/ucus/${drop.alert.origin_code?.toLowerCase()}-${drop.alert.destination_code?.toLowerCase()}`,
                data: {
                  alertId: drop.alert.id,
                  oldPrice: drop.oldPrice,
                  newPrice: drop.newPrice
                }
              }
            })
          });
        }
      } catch (err) {
        console.error('Error sending notification:', err);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        checked: alerts.length,
        priceDrops: priceDrops.length,
        historyRecords: priceHistory.length
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
