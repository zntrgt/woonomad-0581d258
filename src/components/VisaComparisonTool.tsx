import { useState, useMemo } from 'react';
import { 
  Globe, 
  DollarSign, 
  Clock, 
  Shield, 
  Heart, 
  Laptop, 
  ChevronDown, 
  ChevronUp,
  ExternalLink,
  Filter,
  Star,
  TrendingDown,
  Calendar,
  Check,
  X
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  visaPrograms, 
  VisaProgram,
  getAffordableVisas,
  getLongestStayVisas,
  getTaxFreeVisas
} from '@/lib/visaData';
import { getCountryFlag } from '@/lib/destinations';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'affordable' | 'longest' | 'tax-free';
type SortType = 'recommended' | 'cost-low' | 'cost-high' | 'duration' | 'income-low';

export function VisaComparisonTool() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [sort, setSort] = useState<SortType>('recommended');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const regions = [
    { id: 'all', name: 'Tüm Bölgeler' },
    { id: 'europe', name: 'Avrupa', codes: ['PT', 'ES', 'DE', 'EE', 'HR', 'GR'] },
    { id: 'asia', name: 'Asya', codes: ['TH', 'ID', 'MY', 'JP', 'AE'] },
    { id: 'americas', name: 'Amerika', codes: ['MX', 'CR', 'CO'] },
    { id: 'other', name: 'Diğer', codes: ['GE', 'MU', 'ZA'] },
  ];

  const filteredPrograms = useMemo(() => {
    let programs: VisaProgram[] = [];
    
    // Apply filter
    switch (filter) {
      case 'affordable':
        programs = getAffordableVisas(2000);
        break;
      case 'longest':
        programs = getLongestStayVisas();
        break;
      case 'tax-free':
        programs = getTaxFreeVisas();
        break;
      default:
        programs = [...visaPrograms];
    }

    // Apply region filter
    if (selectedRegion !== 'all') {
      const region = regions.find(r => r.id === selectedRegion);
      if (region && region.codes) {
        programs = programs.filter(p => region.codes.includes(p.countryCode));
      }
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      programs = programs.filter(p => 
        p.country.toLowerCase().includes(query) ||
        p.programName.toLowerCase().includes(query)
      );
    }

    // Apply sort
    switch (sort) {
      case 'cost-low':
        programs.sort((a, b) => a.cost - b.cost);
        break;
      case 'cost-high':
        programs.sort((a, b) => b.cost - a.cost);
        break;
      case 'income-low':
        programs.sort((a, b) => a.incomeRequirement - b.incomeRequirement);
        break;
      case 'duration':
        programs.sort((a, b) => {
          const getDuration = (d: string) => {
            if (d.includes('10')) return 10;
            if (d.includes('5')) return 5;
            if (d.includes('4')) return 4;
            if (d.includes('3')) return 3;
            if (d.includes('2')) return 2;
            if (d.includes('1')) return 1;
            return 0.5;
          };
          return getDuration(b.maxStay) - getDuration(a.maxStay);
        });
        break;
      default:
        // Recommended - mix of factors
        break;
    }

    return programs;
  }, [filter, sort, searchQuery, selectedRegion]);

  const getTypeLabel = (type: VisaProgram['type']) => {
    switch (type) {
      case 'nomad-visa': return 'Dijital Göçebe';
      case 'freelancer-visa': return 'Freelancer';
      case 'residence-permit': return 'Oturum İzni';
      case 'visa-free': return 'Vizesiz';
      case 'eVisa': return 'e-Vize';
      default: return type;
    }
  };

  const getTypeColor = (type: VisaProgram['type']) => {
    switch (type) {
      case 'nomad-visa': return 'bg-primary/10 text-primary';
      case 'freelancer-visa': return 'bg-blue-500/10 text-blue-600';
      case 'residence-permit': return 'bg-green-500/10 text-green-600';
      case 'visa-free': return 'bg-emerald-500/10 text-emerald-600';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
          Dijital Göçebe Vize Karşılaştırma
        </h2>
        <p className="text-muted-foreground">
          {visaPrograms.length} ülkenin vize programlarını karşılaştırın
        </p>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button 
          variant={filter === 'all' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('all')}
        >
          Tümü
        </Button>
        <Button 
          variant={filter === 'affordable' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('affordable')}
        >
          <TrendingDown className="w-4 h-4 mr-1" />
          Düşük Gelir Şartı
        </Button>
        <Button 
          variant={filter === 'longest' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('longest')}
        >
          <Calendar className="w-4 h-4 mr-1" />
          Uzun Süreli
        </Button>
        <Button 
          variant={filter === 'tax-free' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => setFilter('tax-free')}
        >
          <Star className="w-4 h-4 mr-1" />
          Vergisiz
        </Button>
      </div>

      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Ülke veya program ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <Globe className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {regions.map(region => (
              <SelectItem key={region.id} value={region.id}>
                {region.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => setSort(v as SortType)}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Sırala" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recommended">Önerilen</SelectItem>
            <SelectItem value="cost-low">Maliyet (Düşük)</SelectItem>
            <SelectItem value="cost-high">Maliyet (Yüksek)</SelectItem>
            <SelectItem value="income-low">Gelir Şartı (Düşük)</SelectItem>
            <SelectItem value="duration">Süre (Uzun)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        {filteredPrograms.length} vize programı bulundu
      </p>

      {/* Visa Cards */}
      <div className="grid gap-4">
        {filteredPrograms.map((program) => {
          const isExpanded = expandedId === program.id;
          const flag = getCountryFlag(program.countryCode);

          return (
            <Card 
              key={program.id} 
              className={cn(
                "transition-all duration-300",
                isExpanded && "ring-2 ring-primary/20"
              )}
            >
              <CardContent className="p-4 md:p-6">
                {/* Header Row */}
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-3xl">{flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-display font-bold text-lg">
                        {program.country}
                      </h3>
                      <Badge className={getTypeColor(program.type)}>
                        {getTypeLabel(program.type)}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {program.programName}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setExpandedId(isExpanded ? null : program.id)}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </Button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Süre</p>
                      <p className="font-medium text-sm">{program.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Başvuru Ücreti</p>
                      <p className="font-medium text-sm">
                        {program.cost === 0 ? 'Ücretsiz' : `${program.costCurrency} ${program.cost}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Gelir Şartı</p>
                      <p className="font-medium text-sm">
                        {program.incomeRequirement === 0 
                          ? 'Yok' 
                          : `${program.incomeRequirementCurrency} ${program.incomeRequirement.toLocaleString()}/ay`
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">İşlem Süresi</p>
                      <p className="font-medium text-sm">{program.processingTime}</p>
                    </div>
                  </div>
                </div>

                {/* Highlights */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {program.highlights.map((highlight, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {highlight}
                    </Badge>
                  ))}
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="mt-6 pt-6 border-t border-border space-y-6 animate-fade-in">
                    {/* Tax Benefits */}
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-primary" />
                        Vergi Avantajları
                      </h4>
                      <p className="text-muted-foreground text-sm">{program.taxBenefits}</p>
                    </div>

                    {/* Requirements */}
                    <div>
                      <h4 className="font-semibold mb-2">Gereksinimler</h4>
                      <ul className="space-y-1">
                        {program.requirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Additional Info */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Heart className={cn(
                          "w-4 h-4",
                          program.healthInsurance ? "text-primary" : "text-muted-foreground"
                        )} />
                        <span className="text-sm">
                          Sağlık Sigortası: {program.healthInsurance ? 'Gerekli' : 'Gerekli Değil'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Laptop className={cn(
                          "w-4 h-4",
                          program.remoteWorkProof ? "text-primary" : "text-muted-foreground"
                        )} />
                        <span className="text-sm">
                          Uzaktan Çalışma Kanıtı: {program.remoteWorkProof ? 'Gerekli' : 'Gerekli Değil'}
                        </span>
                      </div>
                    </div>

                    {/* Pros and Cons */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2 text-green-600">Avantajlar</h4>
                        <ul className="space-y-1">
                          {program.pros.map((pro, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2 text-red-600">Dezavantajlar</h4>
                        <ul className="space-y-1">
                          {program.cons.map((con, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Application Link */}
                    {program.applicationUrl && (
                      <a 
                        href={program.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:underline"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Resmi Başvuru Sayfası
                      </a>
                    )}

                    <p className="text-xs text-muted-foreground">
                      Son güncelleme: {program.lastUpdated}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredPrograms.length === 0 && (
        <div className="text-center py-12">
          <Globe className="w-12 h-12 mx-auto mb-4 text-muted-foreground/30" />
          <h3 className="font-semibold mb-2">Vize programı bulunamadı</h3>
          <p className="text-muted-foreground text-sm">
            Farklı filtreler deneyebilirsiniz
          </p>
        </div>
      )}
    </div>
  );
}
