import { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, X, ArrowRight, FileText, Table2, ListChecks, HelpCircle, Link2, Brain, Image, MessageCircle, Zap, Loader2, LinkIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface ImageSuggestion {
  position: string;
  prompt: string;
  altText: string;
  caption?: string;
  purpose: string;
}

interface GeneratedImage {
  position: string;
  imageUrl: string;
  altText: string;
  caption?: string;
}

interface LLMOptimizations {
  entityMarkup: Array<{ entity: string; type: string; description: string }>;
  semanticSections: Array<{ id: string; purpose: string; keyTopics: string[] }>;
  conversationalQueries: string[];
  featuredSnippetTargets: Array<{ query: string; answer: string }>;
  speakableContent: string[];
}

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
  llmOptimizations?: LLMOptimizations;
  imageSuggestions?: ImageSuggestion[];
  generatedImages?: GeneratedImage[];
}

interface SEOComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (result: SEOImproveResult, generateImages: boolean) => void;
  currentData: {
    title: string;
    excerpt: string;
    content: string;
  };
  improvedData: SEOImproveResult | null;
  isGeneratingImages?: boolean;
}

export function SEOComparisonModal({
  isOpen,
  onClose,
  onApply,
  currentData,
  improvedData,
  isGeneratingImages = false,
}: SEOComparisonModalProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [shouldGenerateImages, setShouldGenerateImages] = useState(true);
  const [shouldInsertLinks, setShouldInsertLinks] = useState(true);
  const [selectedLinks, setSelectedLinks] = useState<number[]>([]);
  const [linksInserted, setLinksInserted] = useState(false);

  // Initialize selected links when modal opens
  const initializeSelectedLinks = useCallback(() => {
    if (improvedData?.internalLinkSuggestions) {
      setSelectedLinks(improvedData.internalLinkSuggestions.map((_, i) => i));
    }
  }, [improvedData]);

  // Reset when modal opens
  if (improvedData && selectedLinks.length === 0 && improvedData.internalLinkSuggestions?.length > 0) {
    initializeSelectedLinks();
  }

  if (!improvedData) return null;

  const toggleLinkSelection = (index: number) => {
    setSelectedLinks(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const selectAllLinks = () => {
    if (improvedData.internalLinkSuggestions) {
      if (selectedLinks.length === improvedData.internalLinkSuggestions.length) {
        setSelectedLinks([]);
      } else {
        setSelectedLinks(improvedData.internalLinkSuggestions.map((_, i) => i));
      }
    }
  };

  // Function to insert internal links into content
  const insertInternalLinks = (content: string, links: Array<{ anchor: string; href: string }>) => {
    let updatedContent = content;
    let insertedCount = 0;

    for (const link of links) {
      // Escape special regex characters in anchor text
      const escapedAnchor = link.anchor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Find the anchor text that's not already a link
      // Negative lookbehind for [ and negative lookahead for ](
      const regex = new RegExp(`(?<!\\[)\\b(${escapedAnchor})\\b(?!\\]\\()`, 'gi');
      
      // Only replace the first occurrence
      let replaced = false;
      updatedContent = updatedContent.replace(regex, (match) => {
        if (!replaced) {
          replaced = true;
          insertedCount++;
          return `[${match}](${link.href})`;
        }
        return match;
      });
    }

    return { content: updatedContent, insertedCount };
  };

  // Modified apply function to include link insertion
  const handleApply = () => {
    let modifiedResult = { ...improvedData };

    // Insert internal links if enabled
    if (shouldInsertLinks && selectedLinks.length > 0 && improvedData.internalLinkSuggestions) {
      const linksToInsert = selectedLinks.map(i => improvedData.internalLinkSuggestions![i]);
      const { content: updatedContent, insertedCount } = insertInternalLinks(modifiedResult.content, linksToInsert);
      modifiedResult.content = updatedContent;
      
      if (insertedCount > 0) {
        toast({
          title: 'İç Linkler Eklendi',
          description: `${insertedCount} iç link içeriğe eklendi.`,
        });
      }
    }

    onApply(modifiedResult, shouldGenerateImages);
  };

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

  const hasLLMOptimizations = improvedData.llmOptimizations && (
    improvedData.llmOptimizations.entityMarkup?.length > 0 ||
    improvedData.llmOptimizations.conversationalQueries?.length > 0 ||
    improvedData.llmOptimizations.featuredSnippetTargets?.length > 0
  );

  const hasImageSuggestions = improvedData.imageSuggestions && improvedData.imageSuggestions.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            SEO & LLM Görünürlük İyileştirme
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Özet</TabsTrigger>
            <TabsTrigger value="content">İçerik</TabsTrigger>
            <TabsTrigger value="structure">Yapı</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="links">Linkler</TabsTrigger>
            <TabsTrigger value="llm" className="flex items-center gap-1">
              <Brain className="h-3 w-3" />
              LLM
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center gap-1">
              <Image className="h-3 w-3" />
              Görseller
            </TabsTrigger>
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
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary">{improvedData.tables?.length || 0}</div>
                  <div className="text-xs text-muted-foreground">Tablo</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary">{improvedData.checklists?.length || 0}</div>
                  <div className="text-xs text-muted-foreground">Checklist</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary">{improvedData.faqs?.length || 0}</div>
                  <div className="text-xs text-muted-foreground">FAQ</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary">{improvedData.internalLinkSuggestions?.length || 0}</div>
                  <div className="text-xs text-muted-foreground">İç Link</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary">{improvedData.imageSuggestions?.length || 0}</div>
                  <div className="text-xs text-muted-foreground">Görsel</div>
                </div>
              </div>

              {/* LLM Stats */}
              {hasLLMOptimizations && (
                <div className="p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
                  <h4 className="font-semibold flex items-center gap-2 mb-3">
                    <Brain className="h-4 w-4 text-purple-500" />
                    LLM Görünürlük Optimizasyonları
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-600">{improvedData.llmOptimizations?.entityMarkup?.length || 0}</div>
                      <div className="text-xs text-muted-foreground">Entity</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-600">{improvedData.llmOptimizations?.conversationalQueries?.length || 0}</div>
                      <div className="text-xs text-muted-foreground">AI Sorgusu</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-600">{improvedData.llmOptimizations?.featuredSnippetTargets?.length || 0}</div>
                      <div className="text-xs text-muted-foreground">Snippet</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-600">{improvedData.llmOptimizations?.speakableContent?.length || 0}</div>
                      <div className="text-xs text-muted-foreground">Speakable</div>
                    </div>
                  </div>
                </div>
              )}
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
                  {improvedData.toc?.map((item, i) => (
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
              {improvedData.tables && improvedData.tables.length > 0 && (
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
              {improvedData.checklists && improvedData.checklists.length > 0 && (
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
                <h3 className="font-semibold">Sıkça Sorulan Sorular ({improvedData.faqs?.length || 0})</h3>
              </div>
              {improvedData.faqs?.map((faq, i) => (
                <div key={i} className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <h4 className="font-medium text-primary">{faq.q}</h4>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="links" className="space-y-4 mt-0">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Link2 className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">İç Link Önerileri ({improvedData.internalLinkSuggestions?.length || 0})</h3>
                </div>
                {improvedData.internalLinkSuggestions && improvedData.internalLinkSuggestions.length > 0 && (
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={selectAllLinks}>
                      {selectedLinks.length === improvedData.internalLinkSuggestions.length ? 'Seçimi Kaldır' : 'Tümünü Seç'}
                    </Button>
                    <Badge variant={selectedLinks.length > 0 ? 'default' : 'outline'}>
                      {selectedLinks.length} seçili
                    </Badge>
                  </div>
                )}
              </div>
              {!improvedData.internalLinkSuggestions || improvedData.internalLinkSuggestions.length === 0 ? (
                <p className="text-sm text-muted-foreground">İçerikte ilgili şehir veya rota bulunamadı.</p>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 flex items-center gap-3">
                    <LinkIcon className="h-4 w-4 text-primary" />
                    <p className="text-sm">
                      Seçili linkleri içeriğe otomatik olarak eklemek için "Değişiklikleri Uygula" butonuna tıklayın.
                    </p>
                  </div>
                  {improvedData.internalLinkSuggestions.map((link, i) => (
                    <div 
                      key={i} 
                      className={`p-4 rounded-lg space-y-2 cursor-pointer transition-colors ${
                        selectedLinks.includes(i) 
                          ? 'bg-primary/10 border-2 border-primary/30' 
                          : 'bg-muted/50 border-2 border-transparent hover:border-muted'
                      }`}
                      onClick={() => toggleLinkSelection(i)}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedLinks.includes(i)}
                          onCheckedChange={() => toggleLinkSelection(i)}
                        />
                        <Badge variant="outline">{link.anchor}</Badge>
                        <ArrowRight className="h-4 w-4" />
                        <code className="text-xs bg-primary/10 px-2 py-1 rounded">{link.href}</code>
                      </div>
                      <p className="text-sm text-muted-foreground ml-7">{link.reason}</p>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="llm" className="space-y-6 mt-0">
              {!hasLLMOptimizations ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>LLM optimizasyonları bulunamadı.</p>
                </div>
              ) : (
                <>
                  {/* Entity Markup */}
                  {improvedData.llmOptimizations?.entityMarkup && improvedData.llmOptimizations.entityMarkup.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        Entity Markup ({improvedData.llmOptimizations.entityMarkup.length})
                      </h3>
                      <div className="grid gap-2">
                        {improvedData.llmOptimizations.entityMarkup.map((entity, i) => (
                          <div key={i} className="p-3 bg-muted/50 rounded-lg flex items-start gap-3">
                            <Badge variant="secondary" className="shrink-0">{entity.type}</Badge>
                            <div>
                              <span className="font-medium">{entity.entity}</span>
                              <p className="text-sm text-muted-foreground">{entity.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Conversational Queries */}
                  {improvedData.llmOptimizations?.conversationalQueries && improvedData.llmOptimizations.conversationalQueries.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-blue-500" />
                        AI Asistan Sorguları ({improvedData.llmOptimizations.conversationalQueries.length})
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Bu içerik, aşağıdaki doğal dil sorularına cevap verebilir:
                      </p>
                      <div className="grid gap-2">
                        {improvedData.llmOptimizations.conversationalQueries.map((query, i) => (
                          <div key={i} className="p-3 bg-blue-500/10 rounded-lg text-sm border-l-4 border-blue-500">
                            "{query}"
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Featured Snippet Targets */}
                  {improvedData.llmOptimizations?.featuredSnippetTargets && improvedData.llmOptimizations.featuredSnippetTargets.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Zap className="h-4 w-4 text-orange-500" />
                        Featured Snippet Hedefleri ({improvedData.llmOptimizations.featuredSnippetTargets.length})
                      </h3>
                      <div className="grid gap-3">
                        {improvedData.llmOptimizations.featuredSnippetTargets.map((snippet, i) => (
                          <div key={i} className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                            <div className="font-medium text-orange-700 dark:text-orange-300 mb-2">
                              Q: {snippet.query}
                            </div>
                            <div className="text-sm">
                              A: {snippet.answer}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Speakable Content */}
                  {improvedData.llmOptimizations?.speakableContent && improvedData.llmOptimizations.speakableContent.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        🎙️ Sesli İçerik (Speakable) ({improvedData.llmOptimizations.speakableContent.length})
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Bu paragraflar sesli asistanlar ve TTS için optimize edildi:
                      </p>
                      <div className="grid gap-2">
                        {improvedData.llmOptimizations.speakableContent.map((content, i) => (
                          <div key={i} className="p-3 bg-green-500/10 rounded-lg text-sm border-l-4 border-green-500">
                            {content}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Semantic Sections */}
                  {improvedData.llmOptimizations?.semanticSections && improvedData.llmOptimizations.semanticSections.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        📊 Semantik Bölümler ({improvedData.llmOptimizations.semanticSections.length})
                      </h3>
                      <div className="grid gap-2">
                        {improvedData.llmOptimizations.semanticSections.map((section, i) => (
                          <div key={i} className="p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <code className="text-xs bg-primary/10 px-2 py-0.5 rounded">#{section.id}</code>
                              <Badge variant="outline">{section.purpose}</Badge>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {section.keyTopics.map((topic, j) => (
                                <Badge key={j} variant="secondary" className="text-xs">{topic}</Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="images" className="space-y-6 mt-0">
              {!hasImageSuggestions ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Görsel önerisi bulunamadı.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <Image className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">AI Görsel Önerileri ({improvedData.imageSuggestions?.length || 0})</h3>
                  </div>

                  {/* Generated Images (if any) */}
                  {improvedData.generatedImages && improvedData.generatedImages.length > 0 && (
                    <div className="space-y-3 mb-6">
                      <h4 className="font-medium text-green-600 flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        Oluşturulan Görseller
                      </h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {improvedData.generatedImages.map((img, i) => (
                          <div key={i} className="border rounded-lg overflow-hidden">
                            <img 
                              src={img.imageUrl} 
                              alt={img.altText}
                              className="w-full h-48 object-cover"
                            />
                            <div className="p-3">
                              <p className="text-sm font-medium">{img.altText}</p>
                              {img.caption && (
                                <p className="text-xs text-muted-foreground mt-1">{img.caption}</p>
                              )}
                              <code className="text-xs bg-muted px-2 py-0.5 rounded mt-2 inline-block">
                                {img.position}
                              </code>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Image Suggestions */}
                  <div className="grid gap-4">
                    {improvedData.imageSuggestions?.map((suggestion, i) => (
                      <div key={i} className="p-4 bg-muted/50 rounded-lg space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{suggestion.purpose}</Badge>
                            <code className="text-xs bg-primary/10 px-2 py-0.5 rounded">{suggestion.position}</code>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <span className="text-xs font-medium text-muted-foreground">AI Prompt:</span>
                            <p className="text-sm italic bg-background/50 p-2 rounded mt-1">{suggestion.prompt}</p>
                          </div>
                          <div>
                            <span className="text-xs font-medium text-muted-foreground">Alt Text:</span>
                            <p className="text-sm">{suggestion.altText}</p>
                          </div>
                          {suggestion.caption && (
                            <div>
                              <span className="text-xs font-medium text-muted-foreground">Başlık:</span>
                              <p className="text-sm">{suggestion.caption}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter className="mt-4 flex-col sm:flex-row gap-4">
          <div className="flex flex-wrap items-center gap-4 mr-auto">
            {hasImageSuggestions && (
              <div className="flex items-center gap-2">
                <Switch
                  id="generate-images"
                  checked={shouldGenerateImages}
                  onCheckedChange={setShouldGenerateImages}
                />
                <Label htmlFor="generate-images" className="text-sm cursor-pointer">
                  Görselleri AI ile oluştur
                </Label>
              </div>
            )}
            {improvedData.internalLinkSuggestions && improvedData.internalLinkSuggestions.length > 0 && (
              <div className="flex items-center gap-2">
                <Switch
                  id="insert-links"
                  checked={shouldInsertLinks}
                  onCheckedChange={setShouldInsertLinks}
                />
                <Label htmlFor="insert-links" className="text-sm cursor-pointer">
                  İç linkleri ekle ({selectedLinks.length})
                </Label>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isGeneratingImages}>
              <X className="h-4 w-4 mr-2" />
              İptal
            </Button>
            <Button 
              onClick={handleApply} 
              className="gradient-primary"
              disabled={isGeneratingImages}
            >
              {isGeneratingImages ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Görseller Oluşturuluyor...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Değişiklikleri Uygula
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
