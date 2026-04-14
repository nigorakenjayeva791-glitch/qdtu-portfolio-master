import { useState } from "react";
import { TableToolbar } from "@/components/table-toolbar/table-toolbar";
import { useModalActions } from "@/store/modalStore";
import { PublicationModal } from "@/pages/teachers/detail/detail-modals/publication-modal";
import { NashrModal } from "@/pages/teachers/detail/detail-modals/nashr-modal";
import { NazoratTab } from "@/pages/teachers/detail/detail-tabs/nazorat-tab";
import { NashrlarTab } from "@/pages/teachers/detail/detail-tabs/nashrlar-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { cn } from "@/utils";
import { BookText, FileText, Plus, Loader2 } from "lucide-react";
import { useNazorat } from "@/hooks/teacher/useNazorat";
import { useUser } from "@/hooks/user/useUser";
import { useNashr } from "@/hooks/teacher/useNashr";
import { Button } from "@/ui/button";

export default function TeacherPublications() {
  const { open } = useModalActions();
  const [activeTab, setActiveTab] = useState("nazoratlar");
  const { data: teacher, isLoading: userLoading } = useUser();
  const { data: nazoratData, isLoading: nazoratLoading } = useNazorat(teacher?.id);
  const { data: nashrData, isLoading: nashrLoading } = useNashr(teacher?.id);

  const isLoading = userLoading || nazoratLoading || nashrLoading;

  const counts: Record<string, number> = {
    nazoratlar: nazoratData?.data.totalElements ?? 0,
    nashrlar: nashrData?.data.totalElements ?? 0,
  };

  const config: Record<string, { label: string; modal: string; icon: any }> = {
    nazoratlar: { 
      label: "Nazoratlar", 
      modal: "nazorat", 
      icon: BookText 
    },
    nashrlar: { 
      label: "Nashrlar", 
      modal: "nashr", 
      icon: FileText 
    },
  };

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-3 animate-in fade-in duration-500">
        <Loader2 className="size-10 text-primary animate-spin" />
        <p className="text-muted-foreground animate-pulse text-sm font-medium">
          Ma'lumotlar yuklanmoqda...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-1 sm:p-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Yuqori Sarlavha va Action qismi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background/50 backdrop-blur-md p-4 rounded-2xl border border-border/50 shadow-sm">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Ilmiy faoliyat
          </h1>
          <p className="text-sm text-muted-foreground">
            O'qituvchining barcha nashrlari va nazorat ishlari hisobi
          </p>
        </div>
        
        <Button 
          onClick={() => open({ _type: config[activeTab].modal })}
          className="group shadow-md hover:shadow-primary/20 transition-all duration-300"
        >
          <Plus className="mr-2 size-4 group-hover:rotate-90 transition-transform duration-300" />
          {activeTab === "nazoratlar" ? "Nazorat qo'shish" : "Nashr qo'shish"}
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full space-y-6"
      >
        {/* Tab List Dizayni */}
        <div className="flex items-center justify-between border-b border-border/60 pb-px overflow-x-auto no-scrollbar">
          <TabsList className="bg-transparent h-auto p-0 gap-8">
            {Object.entries(config).map(([key, item]) => (
              <TabsTrigger
                key={key}
                value={key}
                className={cn(
                  "relative rounded-none border-0 bg-transparent px-1 py-3 text-sm font-medium transition-all duration-200",
                  "text-muted-foreground hover:text-foreground",
                  "data-[state=active]:text-primary data-[state=active]:shadow-none",
                  "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:scale-x-0 after:bg-primary after:transition-transform after:duration-300",
                  "data-[state=active]:after:scale-x-100"
                )}
              >
                <div className="flex items-center gap-2">
                  <item.icon className="size-4" />
                  <span>{item.label}</span>
                  <span className={cn(
                    "ml-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold",
                    activeTab === key 
                      ? "bg-primary/10 text-primary" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    {counts[key]}
                  </span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Kontent qismi */}
        <div className="mt-2 ring-offset-background focus-visible:outline-none">
          <TabsContent value="nazoratlar" className="m-0 focus-visible:outline-none">
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm transition-all">
               <NazoratTab data={nazoratData?.data.body} userId={teacher?.id}/>
            </div>
          </TabsContent>
          
          <TabsContent value="nashrlar" className="m-0 focus-visible:outline-none">
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm transition-all">
              <NashrlarTab data={nashrData?.data.body} userId={teacher?.id}/>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Modallar */}
      <PublicationModal userId={teacher?.id} />
      <NashrModal userId={teacher?.id} />
    </div>
  );
}