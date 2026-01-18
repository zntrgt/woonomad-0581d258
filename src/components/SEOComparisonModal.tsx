import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, X, ArrowRight, FileText, Table2, ListChecks, HelpCircle, Link2 } from 'lucide-react';

interface SEOImproveResult {
  title: string;
  metaDescription: string;
  content: string;
  toc: Array<{ id: string; text: string; level: number }>;
  tables: Array<{ title: string; markdown: string }>;
  checklists: Array<{ title: string; items: string[] }>;
  faqs: Array<{ q: string; a: string }>;
  internalLinkSuggestions: Array<{ anchor: string; href: string; reason: string }>;
  schemaJsonLd: object;
  changeSummary: string[];
}

interface SEOComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (result: SEOImproveResult) => void;
  currentData: {
    title: string;
    excerpt: string;
    content: string;
  };
  improvedData: SEOImproveResult | null;
}

export function SEOComparisonModal({
  isOpen,
  onClose,
  onApply,
  currentData,
  improvedData,
}: SEOComparisonModalProps) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!improvedData) return null;

  const renderDiff = (current: string, improved: string, label: string) => (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <span>Mevcut {label}</span>
          <Badge variant="outline" className="text-xs">{current.length} karakter</Badge>
        </div>
        <div className="p-3 bg-muted/50 rounded-lg text-sm border-l-4 border-muted-foreground/30">
          {current || <span className="text-muted-foreground italic">Boş</span>}
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <span>AI Önerisi {label}</span>
          <Badge variant="default" className="text-xs">{improved.length} karakter</Badge>
        </div>
        <div className="p-3 bg-primary/5 rounded-lg text-sm border-l-4 border-primary">
          {improved}
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            SEO İyileştirme Önizleme
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Özet</TabsTrigger>
            <TabsTrigger value="content">İçerik</TabsTrigger>
            <TabsTrigger value="structure">Yapı</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="links">Linkler</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 mt-4">
            <TabsContent value="overview" className="space-y-6 mt-0">
              {/* Change Summary */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  Yapılan Değişiklikler
                </h3>
                <ul className="space-y-2">
                  {improvedData.changeSummary.map((change, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Title Comparison */}
              <div className="space-y-3">
                <h3 className="font-semibold">Başlık</h3>
                {renderDiff(currentData.title, improvedData.title, '')}
              </div>

              {/* Meta Description Comparison */}
              <div className="space-y-3">
                <h3 className="font-semibold">Meta Açıklama</h3>
                {renderDiff(currentData.excerpt, improvedData.metaDescription, '')}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary">{improvedData.tables.length}</div>
                  <div className="text-xs text-muted-foreground">Tablo</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary">{improvedData.checklists.length}</div>
                  <div className="text-xs text-muted-foreground">Checklist</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary">{improvedData.faqs.length}</div>
                  <div className="text-xs text-muted-foreground">FAQ</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary">{improvedData.internalLinkSuggestions.length}</div>
                  <div className="text-xs text-muted-foreground">İç Link</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="content" className="mt-0">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Mevcut İçerik</span>
                    <Badge variant="outline" className="text-xs">
                      {currentData.content.split(/\s+/).filter(w => w).length} kelime
                    </Badge>
                  </div>
                  <ScrollArea className="h-[400px] border rounded-lg p-3">
                    <pre className="text-xs whitespace-pre-wrap font-mono">{currentData.content}</pre>
                  </ScrollArea>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-primary">AI Önerisi</span>
                    <Badge variant="default" className="text-xs">
                      {improvedData.content.split(/\s+/).filter(w => w).length} kelime
                    </Badge>
                  </div>
                  <ScrollArea className="h-[400px] border border-primary/30 rounded-lg p-3 bg-primary/5">
                    <pre className="text-xs whitespace-pre-wrap font-mono">{improvedData.content}</pre>
                  </ScrollArea>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="structure" className="space-y-6 mt-0">
              {/* TOC */}
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  İçindekiler (TOC)
                </h3>
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  {improvedData.toc.map((item, i) => (
                    <div 
                      key={i} 
                      className="text-sm"
                      style={{ paddingLeft: `${(item.level - 2) * 16}px` }}
                    >
                      <span className="text-muted-foreground">#{item.id}</span> {item.text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tables */}
              {improvedData.tables.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Table2 className="h-4 w-4" />
                    Tablolar ({improvedData.tables.length})
                  </h3>
                  {improvedData.tables.map((table, i) => (
                    <div key={i} className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">{table.title}</h4>
                      <pre className="text-xs overflow-x-auto">{table.markdown}</pre>
                    </div>
                  ))}
                </div>
              )}

              {/* Checklists */}
              {improvedData.checklists.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <ListChecks className="h-4 w-4" />
                    Checklistler ({improvedData.checklists.length})
                  </h3>
                  {improvedData.checklists.map((checklist, i) => (
                    <div key={i} className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">{checklist.title}</h4>
                      <ul className="text-sm space-y-1">
                        {checklist.items.map((item, j) => (
                          <li key={j} className="flex items-center gap-2">
                            <div className="w-4 h-4 border rounded flex items-center justify-center">
                              <Check className="h-3 w-3 text-primary" />
                            </div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="faq" className="space-y-4 mt-0">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Sıkça Sorulan Sorular ({improvedData.faqs.length})</h3>
              </div>
              {improvedData.faqs.map((faq, i) => (
                <div key={i} className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <h4 className="font-medium text-primary">{faq.q}</h4>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="links" className="space-y-4 mt-0">
              <div className="flex items-center gap-2 mb-4">
                <Link2 className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">İç Link Önerileri ({improvedData.internalLinkSuggestions.length})</h3>
              </div>
              {improvedData.internalLinkSuggestions.length === 0 ? (
                <p className="text-sm text-muted-foreground">İçerikte ilgili şehir veya rota bulunamadı.</p>
              ) : (
                improvedData.internalLinkSuggestions.map((link, i) => (
                  <div key={i} className="p-4 bg-muted/50 rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{link.anchor}</Badge>
                      <ArrowRight className="h-4 w-4" />
                      <code className="text-xs bg-primary/10 px-2 py-1 rounded">{link.href}</code>
                    </div>
                    <p className="text-sm text-muted-foreground">{link.reason}</p>
                  </div>
                ))
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            İptal
          </Button>
          <Button onClick={() => onApply(improvedData)} className="gradient-primary">
            <Check className="h-4 w-4 mr-2" />
            Değişiklikleri Uygula
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
