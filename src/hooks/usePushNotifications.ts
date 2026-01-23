import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

// Note: push_subscriptions table was added but types.ts hasn't been regenerated yet
// This hook will work correctly once types are synced

export function usePushNotifications() {
  const { user } = useAuth();
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  // Check if push notifications are supported
  useEffect(() => {
    const checkSupport = () => {
      const supported = 'serviceWorker' in navigator && 
                        'PushManager' in window && 
                        'Notification' in window;
      setIsSupported(supported);
    };
    checkSupport();
  }, []);

  // Check existing subscription
  useEffect(() => {
    const checkSubscription = async () => {
      if (!isSupported) return;
      
      try {
        const registration = await navigator.serviceWorker.ready;
        const sub = await registration.pushManager.getSubscription();
        
        if (sub) {
          setSubscription(sub);
          setIsSubscribed(true);
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
      }
    };
    
    checkSubscription();
  }, [isSupported]);

  // Request permission and subscribe
  const subscribe = useCallback(async (citySlugs: string[] = [], routeKeys: string[] = []) => {
    if (!isSupported || !user) {
      toast.error('Bildirimler desteklenmiyor veya giriş yapmanız gerekiyor');
      return false;
    }

    setIsLoading(true);
    
    try {
      // Request notification permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        toast.error('Bildirim izni verilmedi');
        return false;
      }

      // Get VAPID public key from env
      const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        console.error('VAPID public key not found');
        toast.error('Bildirim yapılandırması eksik');
        return false;
      }

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;
      
      // Subscribe to push notifications
      const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey as BufferSource
      });

      // Extract keys
      const p256dhKey = sub.getKey('p256dh');
      const authKey = sub.getKey('auth');
      
      if (!p256dhKey || !authKey) {
        throw new Error('Failed to get push subscription keys');
      }
      
      const p256dh = btoa(String.fromCharCode.apply(null,
        Array.from(new Uint8Array(p256dhKey))));
      const auth = btoa(String.fromCharCode.apply(null, 
        Array.from(new Uint8Array(authKey))));

      // Save to database
      // @ts-ignore - push_subscriptions table added via migration, types will sync
      const { error } = await supabase
        .from('push_subscriptions')
        .upsert({
          user_id: user.id,
          endpoint: sub.endpoint,
          p256dh,
          auth,
          city_slugs: citySlugs,
          route_keys: routeKeys,
        }, {
          onConflict: 'endpoint'
        });

      if (error) throw error;

      setSubscription(sub);
      setIsSubscribed(true);
      toast.success('Bildirimler aktif edildi!');
      return true;
    } catch (error) {
      console.error('Error subscribing:', error);
      toast.error('Bildirim aboneliği başarısız');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, user]);

  // Unsubscribe
  const unsubscribe = useCallback(async () => {
    if (!subscription || !user) return false;

    setIsLoading(true);
    
    try {
      await subscription.unsubscribe();

      // Remove from database
      // @ts-ignore - push_subscriptions table added via migration, types will sync
      await supabase
        .from('push_subscriptions')
        .delete()
        .eq('endpoint', subscription.endpoint);

      setSubscription(null);
      setIsSubscribed(false);
      toast.success('Bildirimler kapatıldı');
      return true;
    } catch (error) {
      console.error('Error unsubscribing:', error);
      toast.error('Bildirim iptali başarısız');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [subscription, user]);

  // Update subscription preferences
  const updatePreferences = useCallback(async (citySlugs: string[], routeKeys: string[]) => {
    if (!subscription || !user) return false;

    try {
      // @ts-ignore - push_subscriptions table added via migration, types will sync
      const { error } = await supabase
        .from('push_subscriptions')
        .update({
          city_slugs: citySlugs,
          route_keys: routeKeys,
        })
        .eq('endpoint', subscription.endpoint);

      if (error) throw error;
      
      toast.success('Bildirim tercihleri güncellendi');
      return true;
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Tercihler güncellenemedi');
      return false;
    }
  }, [subscription, user]);

  return {
    isSupported,
    isSubscribed,
    isLoading,
    subscribe,
    unsubscribe,
    updatePreferences,
  };
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
