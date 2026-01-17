import { useMemo } from 'react';
import { CheckCircle2, XCircle, AlertCircle, TrendingUp, FileText, Hash, Link2, Image, List } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SEOScoreWidgetProps {
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  imageUrl?: string;
  category?: string;
}

interface SEOCheck {
  name: string;
  passed: boolean;
  score: number;
  maxScore: number;
  message: string;
  icon: React.ReactNode;
}

export function SEOScoreWidget({ title, excerpt, content, slug, imageUrl, category }: SEOScoreWidgetProps) {
  const checks = useMemo((): SEOCheck[] => {
    const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
    const headingCount = (content.match(/^#{1,3}\s/gm) || []).length;
    const h2Count = (content.match(/^##\s/gm) || []).length;
    const h3Count = (content.match(/^###\s/gm) || []).length;
    const listCount = (content.match(/^[-*]\s|^\d+\.\s/gm) || []).length;
    const linkCount = (content.match(/\[.*?\]\(.*?\)/g) || []).length;
    const boldCount = (content.match(/\*\*.*?\*\*/g) || []).length;
    const tableCount = (content.match(/\|.*\|/g) || []).length;
    const faqCount = (content.match(/###\s.*\?/g) || []).length;
    
    return [
      // Title check (55-60 chars ideal)
      {
        name: 'Başlık Uzunluğu',
        passed: title.length >= 30 && title.length <= 65,
        score: title.length >= 30 && title.length <= 65 ? 15 : title.length >= 20 && title.length <= 75 ? 10 : 5,
        maxScore: 15,
        message: `${title.length} karakter (ideal: 55-60)`,
        icon: <FileText className="h-4 w-4" />
      },
      // Meta description (150-160 chars)
      {
        name: 'Meta Açıklama',
        passed: excerpt.length >= 120 && excerpt.length <= 165,
        score: excerpt.length >= 120 && excerpt.length <= 165 ? 15 : excerpt.length >= 80 && excerpt.length <= 200 ? 10 : 5,
        maxScore: 15,
        message: `${excerpt.length} karakter (ideal: 150-160)`,
        icon: <FileText className="h-4 w-4" />
      },
      // Word count (900-2500 ideal)
      {
        name: 'Kelime Sayısı',
        passed: wordCount >= 900,
        score: wordCount >= 1500 ? 15 : wordCount >= 900 ? 12 : wordCount >= 500 ? 8 : 4,
        maxScore: 15,
        message: `${wordCount} kelime (ideal: 900+)`,
        icon: <Hash className="h-4 w-4" />
      },
      // Headings structure
      {
        name: 'Başlık Yapısı (H2/H3)',
        passed: h2Count >= 3 && h3Count >= 2,
        score: h2Count >= 3 && h3Count >= 2 ? 10 : headingCount >= 3 ? 7 : headingCount >= 1 ? 4 : 0,
        maxScore: 10,
        message: `${h2Count} H2, ${h3Count} H3 (ideal: 3+ H2, 2+ H3)`,
        icon: <List className="h-4 w-4" />
      },
      // Lists
      {
        name: 'Liste Kullanımı',
        passed: listCount >= 5,
        score: listCount >= 10 ? 10 : listCount >= 5 ? 8 : listCount >= 2 ? 5 : 2,
        maxScore: 10,
        message: `${listCount} liste öğesi (ideal: 5+)`,
        icon: <List className="h-4 w-4" />
      },
      // Internal links
      {
        name: 'İç Linkler',
        passed: linkCount >= 3,
        score: linkCount >= 5 ? 10 : linkCount >= 3 ? 8 : linkCount >= 1 ? 5 : 0,
        maxScore: 10,
        message: `${linkCount} link (ideal: 3+)`,
        icon: <Link2 className="h-4 w-4" />
      },
      // Cover image
      {
        name: 'Kapak Görseli',
        passed: !!imageUrl && imageUrl.length > 0,
        score: imageUrl && imageUrl.length > 0 ? 10 : 0,
        maxScore: 10,
        message: imageUrl ? 'Görsel mevcut ✓' : 'Görsel eksik',
        icon: <Image className="h-4 w-4" />
      },
      // Tables/Frameworks
      {
        name: 'Tablo/Çerçeve',
        passed: tableCount >= 2,
        score: tableCount >= 2 ? 10 : tableCount >= 1 ? 5 : 0,
        maxScore: 10,
        message: `${tableCount} tablo (ideal: 2+)`,
        icon: <List className="h-4 w-4" />
      },
      // FAQ questions
      {
        name: 'SSS (FAQ)',
        passed: faqCount >= 5,
        score: faqCount >= 6 ? 5 : faqCount >= 3 ? 3 : faqCount >= 1 ? 2 : 0,
        maxScore: 5,
        message: `${faqCount} soru (ideal: 6+)`,
        icon: <FileText className="h-4 w-4" />
      }
    ];
  }, [title, excerpt, content, imageUrl]);

  const totalScore = checks.reduce((sum, check) => sum + check.score, 0);
  const maxScore = checks.reduce((sum, check) => sum + check.maxScore, 0);
  const percentage = Math.round((totalScore / maxScore) * 100);

  const getScoreColor = (pct: number) => {
    if (pct >= 80) return 'text-green-500';
    if (pct >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (pct: number) => {
    if (pct >= 80) return 'bg-green-500';
    if (pct >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreLabel = (pct: number) => {
    if (pct >= 90) return 'Mükemmel';
    if (pct >= 80) return 'İyi';
    if (pct >= 60) return 'Orta';
    if (pct >= 40) return 'Zayıf';
    return 'Kritik';
  };

  return (
    <div className="border border-border rounded-xl p-4 bg-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">SEO Skoru</h3>
        </div>
        <div className={cn("text-2xl font-bold", getScoreColor(percentage))}>
          {percentage}%
        </div>
      </div>
      
      {/* Score bar */}
      <div className="w-full h-3 bg-muted rounded-full mb-2 overflow-hidden">
        <div 
          className={cn("h-full transition-all duration-500", getScoreBg(percentage))}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className={cn("text-sm font-medium mb-4", getScoreColor(percentage))}>
        {getScoreLabel(percentage)}
      </p>

      {/* Checklist */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {checks.map((check, index) => (
          <div 
            key={index}
            className={cn(
              "flex items-center justify-between p-2 rounded-lg text-sm",
              check.passed ? "bg-green-500/10" : "bg-muted"
            )}
          >
            <div className="flex items-center gap-2">
              {check.passed ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : check.score > 0 ? (
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="font-medium">{check.name}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-xs">{check.message}</span>
              <span className={cn(
                "text-xs font-semibold px-1.5 py-0.5 rounded",
                check.passed ? "bg-green-500/20 text-green-600" : "bg-muted-foreground/20"
              )}>
                {check.score}/{check.maxScore}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick tips */}
      {percentage < 80 && (
        <div className="mt-4 p-3 bg-primary/10 rounded-lg">
          <p className="text-xs font-medium text-primary mb-1">💡 İyileştirme Önerileri:</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            {checks.filter(c => !c.passed).slice(0, 3).map((check, i) => (
              <li key={i}>• {check.name}: {check.message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
