import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, PlusCircle, Search, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface StatsData {
  AB: number;
  H: number;
  doubles: number;
  triples: number;
  HR: number;
  RBI: number;
  R: number;
  BB: number;
  K: number;
  SB: number;
  date?: Date;
}

interface StatsFormProps {
  stats: StatsData;
  onStatsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateChange: (date: Date | undefined) => void;
  language: "en" | "es";
  translations: {
    es: {
      stats: string;
      statLabels: Record<string, string>;
      date: string;
      selectDate: string;
      addStats: string;
      searchByDay: string;
      reset: string;
      resetConfirm: string;
      resetSuccess: string;
      resetWarning: string;
      confirmDelete: string;
      cancel: string;
    };
    en: {
      stats: string;
      statLabels: Record<string, string>;
      date: string;
      selectDate: string;
      addStats: string;
      searchByDay: string;
      reset: string;
      resetConfirm: string;
      resetSuccess: string;
      resetWarning: string;
      confirmDelete: string;
      cancel: string;
    };
  };
  onAddStats: () => void;
  onSearchDay: () => void;
  onResetStats: () => void;
  dataModified: boolean;
  dayStats?: StatsData;
  isShowingDayStats: boolean;
}

export default function StatsForm({ 
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
}: StatsFormProps) {
  const t = translations[language];
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  
  // Abbreviated stat labels for display
  const statAbbreviations: Record<string, string> = {
    AB: "AB",
    H: "H",
    doubles: "2B",
    triples: "3B",
    HR: "HR",
    RBI: "RBI",
    R: "R",
    BB: "BB",
    K: "K",
    SB: "SB"
  };

  const handleDateSelect = (date: Date | undefined) => {
    onDateChange(date);
    setDatePickerOpen(false); // Close the date picker after selection
  };
  
  // Helper text to explain MLB stats
  const hitExplanation = language === 'es' 
    ? "Los dobles, triples y jonrones también cuentan como hits. Estadísticas calculadas según estándares MLB."
    : "Doubles, triples, and HRs also count as hits. Statistics calculated according to MLB standards.";

  return (
    <Card className="mb-6 bg-white dark:bg-gray-900 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-0">
        <CardTitle className="text-xl font-bold text-center">{t.stats}</CardTitle>
        <p className="text-center text-sm text-muted-foreground mt-1">{hitExplanation}</p>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="add" className="w-full mb-6">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="add" className="flex items-center gap-2">
              <PlusCircle size={16} />
              {t.addStats}
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search size={16} />
              {t.searchByDay}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="add" className="space-y-4">
            <div className="flex flex-col md:flex-row items-center mb-6 justify-between gap-4">
              <div className="grid grid-cols-1 gap-2 w-full md:w-auto">
                <Label htmlFor="date" className="font-medium text-primary block">
                  {t.date}
                </Label>
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full md:w-[240px] pl-3 text-left font-normal",
                        !stats.date && "text-muted-foreground"
                      )}
                    >
                      {stats.date ? (
                        format(stats.date, "PPP", { locale: language === "es" ? es : undefined })
                      ) : (
                        <span>{t.selectDate}</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={stats.date}
                      onSelect={handleDateSelect}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {Object.entries(stats)
                .filter(([key]) => key !== 'date')
                .map(([key, value]) => (
                  <div key={key} className="stat-card bg-white dark:bg-gray-800 p-3 rounded-lg border shadow-sm">
                    <Label htmlFor={key} className="font-medium text-primary block text-center">
                      {statAbbreviations[key]}
                    </Label>
                    <Input
                      id={key}
                      name={key}
                      type="number"
                      min="0"
                      value={value}
                      onChange={onStatsChange}
                      className="mt-1 text-center"
                    />
                    <p className="text-xs text-muted-foreground mt-1 text-center">{t.statLabels[key]}</p>
                  </div>
                ))}
            </div>

            <div className="mt-6 flex justify-center">
              <Button 
                onClick={onAddStats}
                disabled={!dataModified}
                size="lg"
                className="px-8"
              >
                <PlusCircle className="mr-2" />
                {t.addStats}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="search" className="space-y-4">
            <div className="flex flex-col md:flex-row items-center mb-6 justify-between gap-4">
              <div className="grid grid-cols-1 gap-2 w-full md:w-auto">
                <Label htmlFor="searchDate" className="font-medium text-primary block">
                  {t.date}
                </Label>
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full md:w-[240px] pl-3 text-left font-normal",
                        !stats.date && "text-muted-foreground"
                      )}
                    >
                      {stats.date ? (
                        format(stats.date, "PPP", { locale: language === "es" ? es : undefined })
                      ) : (
                        <span>{t.selectDate}</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={stats.date}
                      onSelect={handleDateSelect}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            {isShowingDayStats && dayStats && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="text-lg font-medium mb-3 text-center">
                  {format(stats.date || new Date(), "PPP", { locale: language === "es" ? es : undefined })}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {Object.entries(dayStats)
                    .filter(([key]) => key !== 'date')
                    .map(([key, value]) => (
                      <div key={key} className="bg-white dark:bg-gray-700 p-3 rounded-lg border shadow-sm">
                        <p className="font-medium text-center">{statAbbreviations[key]}</p>
                        <p className="text-xl font-bold text-center">{value}</p>
                        <p className="text-xs text-muted-foreground text-center">{t.statLabels[key]}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}
            
            <div className="mt-6 flex justify-center">
              <Button 
                onClick={onSearchDay}
                size="lg"
                className="px-8 bg-primary"
              >
                <Search className="mr-2" />
                {t.searchByDay}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 border-t pt-6 flex justify-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <RotateCw className="w-4 h-4" />
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
                <AlertDialogAction onClick={onResetStats} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  {t.confirmDelete}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
