import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Search, RotateCcw } from "lucide-react";

interface PitchingStats {
  IP: number;
  H: number;
  R: number;
  ER: number;
  BB: number;
  K: number;
  HBP: number;
  WP: number;
  BK: number;
  W: number;
  L: number;
  SV: number;
  date?: Date;
}

interface PitchingStatsFormProps {
  stats: PitchingStats;
  onStatsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateChange: (date: Date | undefined) => void;
  language: "en" | "es";
  translations: {
    es: Record<string, any>;
    en: Record<string, any>;
  };
  onAddStats: () => void;
  onSearchDay: () => void;
  onResetStats: () => void;
  dataModified: boolean;
  dayStats?: PitchingStats;
  isShowingDayStats: boolean;
}

export default function PitchingStatsForm({
  stats,
  onStatsChange,
  onDateChange,
  language,
  translations,
  onAddStats,
  onSearchDay,
  onResetStats,
  dataModified,
  dayStats,
  isShowingDayStats
}: PitchingStatsFormProps) {
  const t = translations[language];
  const [calendarOpen, setCalendarOpen] = React.useState(false);

  const handleCalendarSelect = (date: Date | undefined) => {
    onDateChange(date);
    setCalendarOpen(false); // Close the calendar after selection
  };

  return (
    <Card className="mb-6 bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{t.pitchingStats || "Pitching Statistics"}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <div className="space-y-6">
          <div className="mb-4">
            <Label htmlFor="date" className="text-lg font-medium">{t.date}</Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !stats.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {stats.date ? (
                    format(stats.date, "PPP", { locale: language === "es" ? es : undefined })
                  ) : (
                    <span>{t.selectDate}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  selected={stats.date}
                  onSelect={handleCalendarSelect}
                  initialFocus
                  className="calendar-selected"
                  locale={language === "es" ? es : undefined}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="IP" className="text-sm font-medium">{t.pitchingStatLabels?.IP || "Innings Pitched"}</Label>
              <Input
                id="IP"
                name="IP"
                type="number"
                value={isShowingDayStats && dayStats ? dayStats.IP : stats.IP}
                onChange={onStatsChange}
                className="mt-1"
                disabled={isShowingDayStats}
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <Label htmlFor="H" className="text-sm font-medium">{t.pitchingStatLabels?.H || "Hits Allowed"}</Label>
              <Input
                id="H"
                name="H"
                type="number"
                value={isShowingDayStats && dayStats ? dayStats.H : stats.H}
                onChange={onStatsChange}
                className="mt-1"
                disabled={isShowingDayStats}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="R" className="text-sm font-medium">{t.pitchingStatLabels?.R || "Runs Allowed"}</Label>
              <Input
                id="R"
                name="R"
                type="number"
                value={isShowingDayStats && dayStats ? dayStats.R : stats.R}
                onChange={onStatsChange}
                className="mt-1"
                disabled={isShowingDayStats}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="ER" className="text-sm font-medium">{t.pitchingStatLabels?.ER || "Earned Runs"}</Label>
              <Input
                id="ER"
                name="ER"
                type="number"
                value={isShowingDayStats && dayStats ? dayStats.ER : stats.ER}
                onChange={onStatsChange}
                className="mt-1"
                disabled={isShowingDayStats}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="BB" className="text-sm font-medium">{t.pitchingStatLabels?.BB || "Walks"}</Label>
              <Input
                id="BB"
                name="BB"
                type="number"
                value={isShowingDayStats && dayStats ? dayStats.BB : stats.BB}
                onChange={onStatsChange}
                className="mt-1"
                disabled={isShowingDayStats}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="K" className="text-sm font-medium">{t.pitchingStatLabels?.K || "Strikeouts"}</Label>
              <Input
                id="K"
                name="K"
                type="number"
                value={isShowingDayStats && dayStats ? dayStats.K : stats.K}
                onChange={onStatsChange}
                className="mt-1"
                disabled={isShowingDayStats}
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="HBP" className="text-sm font-medium">{t.pitchingStatLabels?.HBP || "Hit By Pitch"}</Label>
              <Input
                id="HBP"
                name="HBP"
                type="number"
                value={isShowingDayStats && dayStats ? dayStats.HBP : stats.HBP}
                onChange={onStatsChange}
                className="mt-1"
                disabled={isShowingDayStats}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="WP" className="text-sm font-medium">{t.pitchingStatLabels?.WP || "Wild Pitches"}</Label>
              <Input
                id="WP"
                name="WP"
                type="number"
                value={isShowingDayStats && dayStats ? dayStats.WP : stats.WP}
                onChange={onStatsChange}
                className="mt-1"
                disabled={isShowingDayStats}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="BK" className="text-sm font-medium">{t.pitchingStatLabels?.BK || "Balks"}</Label>
              <Input
                id="BK"
                name="BK"
                type="number"
                value={isShowingDayStats && dayStats ? dayStats.BK : stats.BK}
                onChange={onStatsChange}
                className="mt-1"
                disabled={isShowingDayStats}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="W" className="text-sm font-medium">{t.pitchingStatLabels?.W || "Wins"}</Label>
              <Input
                id="W"
                name="W"
                type="number"
                value={isShowingDayStats && dayStats ? dayStats.W : stats.W}
                onChange={onStatsChange}
                className="mt-1"
                disabled={isShowingDayStats}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="L" className="text-sm font-medium">{t.pitchingStatLabels?.L || "Losses"}</Label>
              <Input
                id="L"
                name="L"
                type="number"
                value={isShowingDayStats && dayStats ? dayStats.L : stats.L}
                onChange={onStatsChange}
                className="mt-1"
                disabled={isShowingDayStats}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="SV" className="text-sm font-medium">{t.pitchingStatLabels?.SV || "Saves"}</Label>
              <Input
                id="SV"
                name="SV"
                type="number"
                value={isShowingDayStats && dayStats ? dayStats.SV : stats.SV}
                onChange={onStatsChange}
                className="mt-1"
                disabled={isShowingDayStats}
                min="0"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-3 mt-6">
            <Button 
              onClick={onAddStats} 
              className="w-full" 
              disabled={isShowingDayStats || !dataModified}
            >
              {t.addStats}
            </Button>
            <Button 
              variant="outline" 
              onClick={onSearchDay} 
              className="w-full"
            >
              <Search className="mr-2 h-4 w-4" />
              {t.searchByDay}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  {t.reset}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t.resetConfirm}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t.resetWarning}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                  <AlertDialogAction onClick={onResetStats}>{t.confirmDelete}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
