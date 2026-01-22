import { useState } from 'react';
import { Wifi, Upload, Clock, Activity, MapPin, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface WifiSpeedTestFormProps {
  citySlug: string;
  defaultLocationType?: string;
  defaultLocationSlug?: string;
  defaultLocationName?: string;
  onSuccess?: () => void;
}

export function WifiSpeedTestForm({ 
  citySlug, 
  defaultLocationType,
  defaultLocationSlug,
  defaultLocationName,
  onSuccess 
}: WifiSpeedTestFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    locationType: defaultLocationType || 'coworking',
    locationSlug: defaultLocationSlug || '',
    locationName: defaultLocationName || '',
    downloadSpeed: '',
    uploadSpeed: '',
    pingMs: '',
    isStable: true,
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Giriş Gerekli',
        description: 'WiFi hız testi paylaşmak için giriş yapmalısınız.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.downloadSpeed || !formData.locationName) {
      toast({
        title: 'Eksik Bilgi',
        description: 'Lütfen konum adı ve indirme hızını girin.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('wifi_speed_tests').insert({
        user_id: user.id,
        city_slug: citySlug,
        location_type: formData.locationType,
        location_slug: formData.locationSlug || formData.locationName.toLowerCase().replace(/\s+/g, '-'),
        location_name: formData.locationName,
        download_speed: parseFloat(formData.downloadSpeed),
        upload_speed: formData.uploadSpeed ? parseFloat(formData.uploadSpeed) : null,
        ping_ms: formData.pingMs ? parseFloat(formData.pingMs) : null,
        is_stable: formData.isStable,
        notes: formData.notes || null,
      });

      if (error) throw error;

      toast({
        title: 'Başarıyla Eklendi!',
        description: 'WiFi hız testi sonucunuz paylaşıldı. Teşekkürler!',
      });

      // Reset form
      setFormData({
        locationType: defaultLocationType || 'coworking',
        locationSlug: '',
        locationName: '',
        downloadSpeed: '',
        uploadSpeed: '',
        pingMs: '',
        isStable: true,
        notes: '',
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error submitting speed test:', error);
      toast({
        title: 'Hata',
        description: 'Hız testi kaydedilirken bir hata oluştu.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-8 text-center">
          <Wifi className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">
            WiFi hız testi paylaşmak için giriş yapın
          </p>
          <Button asChild variant="outline">
            <a href="/auth">Giriş Yap</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wifi className="h-5 w-5 text-primary" />
          WiFi Hız Testi Paylaş
        </CardTitle>
        <CardDescription>
          Çalıştığınız mekanın internet hızını paylaşarak topluluğa katkıda bulunun
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="locationType">Mekan Türü</Label>
              <Select
                value={formData.locationType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, locationType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Mekan türü seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="coworking">Coworking</SelectItem>
                  <SelectItem value="cafe">Kafe</SelectItem>
                  <SelectItem value="hotel">Otel</SelectItem>
                  <SelectItem value="library">Kütüphane</SelectItem>
                  <SelectItem value="other">Diğer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="locationName">Mekan Adı</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="locationName"
                  placeholder="Örn: Starbucks Kadıköy"
                  value={formData.locationName}
                  onChange={(e) => setFormData(prev => ({ ...prev, locationName: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="downloadSpeed">İndirme Hızı (Mbps) *</Label>
              <div className="relative">
                <Wifi className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="downloadSpeed"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="50"
                  value={formData.downloadSpeed}
                  onChange={(e) => setFormData(prev => ({ ...prev, downloadSpeed: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="uploadSpeed">Yükleme Hızı (Mbps)</Label>
              <div className="relative">
                <Upload className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="uploadSpeed"
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="20"
                  value={formData.uploadSpeed}
                  onChange={(e) => setFormData(prev => ({ ...prev, uploadSpeed: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pingMs">Ping (ms)</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="pingMs"
                  type="number"
                  step="1"
                  min="0"
                  placeholder="15"
                  value={formData.pingMs}
                  onChange={(e) => setFormData(prev => ({ ...prev, pingMs: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                id="isStable"
                checked={formData.isStable}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isStable: checked }))}
              />
              <Label htmlFor="isStable" className="flex items-center gap-2 cursor-pointer">
                <Activity className="h-4 w-4 text-muted-foreground" />
                Bağlantı stabil miydi?
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notlar (Opsiyonel)</Label>
            <Textarea
              id="notes"
              placeholder="Örn: Öğleden sonra daha yavaşlıyor, güzel oturma alanları var..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={2}
            />
          </div>

          <Button type="submit" className="w-full gradient-primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Gönderiliyor...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Hız Testi Paylaş
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
