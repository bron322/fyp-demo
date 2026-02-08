import React from 'react';
import { Star, MapPin, Phone, Calendar, Navigation, ChevronDown, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export interface EvidenceItem {
  business_id: string;
  name_meta: string;
  categories: string;
  city: string;
  state: string;
  rating: number;
  review_count: number;
  score: number;
}

export interface RecommendedRestaurant {
  business_id: string;
  name: string;
  reason: string;
}

interface RestaurantDetailsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurant: RecommendedRestaurant | null;
  evidence: EvidenceItem[];
}

const RatingStars: React.FC<{ rating: number }> = ({ rating }) => {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.25;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < full
              ? 'fill-[hsl(var(--orange))] text-[hsl(var(--orange))]'
              : i === full && hasHalf
              ? 'fill-[hsl(var(--orange))]/50 text-[hsl(var(--orange))]'
              : 'text-muted-foreground/30'
          }`}
        />
      ))}
      <span className="ml-1.5 text-sm font-semibold text-foreground">{rating.toFixed(1)}</span>
    </div>
  );
};

const RestaurantDetailsSheet: React.FC<RestaurantDetailsSheetProps> = ({
  open,
  onOpenChange,
  restaurant,
  evidence,
}) => {
  if (!restaurant) return null;

  // Find matching evidence item
  const matchedEvidence = evidence.find(
    (e) => e.business_id === restaurant.business_id
  );
  const details = matchedEvidence || evidence[0];

  const categories = details?.categories
    ? details.categories.split(',').map((c) => c.trim()).filter(Boolean)
    : [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[400px] p-0 overflow-y-auto rounded-l-2xl"
        style={{ boxShadow: '0 0 60px hsl(270 30% 30% / 0.2)' }}
      >
        {/* Purple gradient header */}
        <div
          className="px-6 pt-6 pb-5"
          style={{
            background: 'linear-gradient(135deg, hsl(270 70% 55%), hsl(290 65% 60%))',
          }}
        >
          <SheetHeader className="space-y-2">
            <SheetTitle className="text-xl font-bold text-white">
              {restaurant.name}
            </SheetTitle>
            <SheetDescription className="sr-only">
              Restaurant details for {restaurant.name}
            </SheetDescription>
            {details && <RatingStars rating={details.rating} />}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {categories.slice(0, 4).map((cat) => (
                  <Badge
                    key={cat}
                    variant="secondary"
                    className="bg-white/20 text-white border-white/20 text-xs hover:bg-white/30"
                  >
                    {cat}
                  </Badge>
                ))}
                {categories.length > 4 && (
                  <Badge
                    variant="secondary"
                    className="bg-white/20 text-white border-white/20 text-xs"
                  >
                    +{categories.length - 4}
                  </Badge>
                )}
              </div>
            )}
          </SheetHeader>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Location + stats */}
          {details && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span>
                  {details.city}, {details.state}
                </span>
              </div>
              <div className="flex gap-6">
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {details.rating.toFixed(1)}
                  </p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {details.review_count.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Reviews</p>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Action buttons */}
          <div className="grid grid-cols-3 gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="flex-col h-auto py-3 gap-1.5 rounded-xl"
                    style={{
                      background:
                        'linear-gradient(135deg, hsl(270 70% 55%), hsl(290 65% 60%))',
                    }}
                  >
                    <Calendar className="w-5 h-5" />
                    <span className="text-xs">Book</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Coming soon</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-col h-auto py-3 gap-1.5 rounded-xl border-border"
                    disabled
                  >
                    <Phone className="w-5 h-5" />
                    <span className="text-xs">Call</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Coming soon</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex-col h-auto py-3 gap-1.5 rounded-xl border-border"
                    disabled
                  >
                    <Navigation className="w-5 h-5" />
                    <span className="text-xs">Directions</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Coming soon</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <Separator />

          {/* Why recommended + Evidence tabs */}
          <Tabs defaultValue="why" className="w-full">
            <TabsList className="w-full grid grid-cols-2 rounded-xl bg-secondary">
              <TabsTrigger value="why" className="rounded-lg text-xs">
                Why Recommended?
              </TabsTrigger>
              <TabsTrigger value="evidence" className="rounded-lg text-xs">
                Evidence ({evidence.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="why" className="mt-3">
              <Collapsible defaultOpen>
                <CollapsibleTrigger className="flex items-center gap-2 text-sm font-semibold text-foreground w-full">
                  <ChevronDown className="w-4 h-4 text-primary transition-transform" />
                  AI Reasoning
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed pl-6">
                    {restaurant.reason}
                  </p>
                </CollapsibleContent>
              </Collapsible>
            </TabsContent>

            <TabsContent value="evidence" className="mt-3 space-y-2">
              {evidence.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">
                  No evidence data available.
                </p>
              ) : (
                evidence.map((item) => {
                  const isSelected =
                    item.business_id === restaurant.business_id;
                  return (
                    <div
                      key={item.business_id}
                      className={`p-3 rounded-xl border text-sm transition-colors ${
                        isSelected
                          ? 'border-primary/40 bg-primary/5'
                          : 'border-border bg-card'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            {isSelected && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                            )}
                            <p className="font-semibold text-foreground truncate">
                              {item.name_meta}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">
                            {item.categories}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.city}, {item.state}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-[hsl(var(--orange))] text-[hsl(var(--orange))]" />
                            <span className="text-xs font-semibold">
                              {item.rating.toFixed(1)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {item.review_count} reviews
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default RestaurantDetailsSheet;
