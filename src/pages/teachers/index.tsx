import { FilePenLine, Search, UserPlus, UserX, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query"; // Yangilanish uchun kerak

import { ConfirmPopover } from "@/components/confirm-popover/confirm-popover";
import type { ColumnDef } from "@/components/data-table/data-table";
import { DataTable } from "@/components/data-table/data-table";
import { useTeacher } from "@/hooks/teacher/useTeacher";
import { useTeacherSheetActions } from "@/store/teacherSheet";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import type { Teacher } from "./teacher.type";
import { TeacherSheet } from "./teacher-sheet";
import { useDeleteTeacher } from "@/hooks/teacher/useDeleteTeacher";
import { useDepartment } from "@/hooks/department/useDepartment";
import { usePosition } from "@/hooks/position/usePosition";

function createColumns(
  onEdit: (row: Teacher) => void,
  onDelete: (row: Teacher) => void
): ColumnDef<Teacher>[] {
  return [
    {
      accessorKey: "id",
      header: "#",
      cell: ({ row }) => <span className="text-muted-foreground text-[12px]">{row.index + 1}</span>,
    },
    {
      accessorKey: "fullName",
      header: "F.I.Sh.",
      cell: ({ row }) => {
        const teacher = row.original;
        return (
          <div className="flex items-center gap-2">
            {teacher.imgUrl ? (
              <img
                src={teacher.imgUrl}
                alt={teacher.fullName}
                className="w-7 h-7 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-blue-700 font-bold text-[12px] shrink-0">
                {teacher.fullName.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="font-medium text-[12px] truncate">{teacher.fullName}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "phoneNumber",
      header: "Telefon",
      cell: ({ row }) => <span className="text-muted-foreground text-[12px]">{row.getValue("phoneNumber")}</span>,
    },
    {
      accessorKey: "lavozim",
      header: "Lavozim",
      cell: ({ row }) => (
        <span className="inline-flex items-center bg-green-50 text-blue-700 text-[11px] font-medium px-2 py-0.5 rounded-full truncate">
          {row.getValue("lavozim")}
        </span>
      ),
    },
    {
      accessorKey: "departmentName",
      header: "Kafedra",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-[12px] truncate">{row.getValue("departmentName")}</span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-center text-[12px]">Amallar</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation(); 
              onEdit(row.original);
            }}
            className="inline-flex items-center gap-1 bg-green-50 text-blue-700 hover:bg-green-100 text-[11px] font-semibold px-2 py-0.5 rounded-md transition-colors cursor-pointer"
          >
            <FilePenLine className="size-3" />
            Tahrirlash
          </button>
          <div onClick={(e) => e.stopPropagation()}> {/* Popover ochilganda ham navigate bo'lmasligi uchun */}
            <ConfirmPopover onConfirm={() => onDelete(row.original)}>
              <button
                type="button"
                className="inline-flex items-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 text-[11px] font-semibold px-2 py-0.5 rounded-md transition-colors cursor-pointer"
              >
                <UserX className="size-3" />
                O'chirish
              </button>
            </ConfirmPopover>
          </div>
        </div>
      ),
    },
  ];
}

export default function Teachers() {
  const queryClient = useQueryClient();
  const { open } = useTeacherSheetActions();
  const navigate = useNavigate();
  const { data: response, isLoading } = useTeacher();
  const { data: departmentData } = useDepartment();
  const { data: positionData } = usePosition();
  const { mutate: deleteTeacher } = useDeleteTeacher();

  const [searchName, setSearchName] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedPosition, setSelectedPosition] = useState<string>("all");

  const teachers: Teacher[] = response?.data?.body ?? [];

  const departments = useMemo(() => {
    const depts = [{ value: "all", label: "Barcha kafedralar" }];
    if (departmentData?.data && Array.isArray(departmentData.data)) {
      departmentData.data.forEach((d: any) => {
        depts.push({ value: String(d.id), label: d.name });
      });
    }
    return depts;
  }, [departmentData]);

  const positions = useMemo(() => {
    const pos = [{ value: "all", label: "Barcha lavozimlar" }];
    if (positionData?.data && Array.isArray(positionData.data)) {
      positionData.data.forEach((p: any) => {
        pos.push({ value: String(p.id), label: p.name });
      });
    }
    return pos;
  }, [positionData]);

  const filteredData = useMemo(() => {
    if (!teachers.length) return [];
    return teachers.filter((t) => {
      const matchesName = t.fullName?.toLowerCase().includes(searchName.toLowerCase()) ?? false;
      const matchesDept = selectedDepartment === "all" || String(t.departmentId) === selectedDepartment;
      const matchesPos = selectedPosition === "all" || String(t.lavozmId) === selectedPosition;
      return matchesName && matchesDept && matchesPos;
    });
  }, [teachers, searchName, selectedDepartment, selectedPosition]);

  const columns = useMemo(
    () =>
      createColumns(
        (row) => open(row), // Tahrirlash
        (row) => {
          deleteTeacher(row.id, {
            onSuccess: () => {
              // MUHIM: useTeacher hook'ingizdagi key bilan bir xil bo'lishi kerak!
              queryClient.invalidateQueries({ queryKey: ["teachers"] }); 
            },
          });
        }
      ),
    [open, deleteTeacher, queryClient]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] font-semibold text-foreground">O'qituvchilar soni:</span>
          <span className="bg-green-100 text-blue-700 text-[12px] font-bold px-2 py-0.5 rounded-full">
            {filteredData.length}
          </span>
          {(searchName || selectedDepartment !== "all" || selectedPosition !== "all") && (
            <button
              onClick={() => { setSearchName(""); setSelectedDepartment("all"); setSelectedPosition("all"); }}
              className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground ml-2"
            >
              <X className="size-3" /> Filtrlarni tozalash
            </button>
          )}
        </div>
        <Button
          size="sm"
          className="h-8 gap-1 text-[12px] bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => open()} // Yangi qo'shish
        >
          <UserPlus className="size-3.5" />
          O'qituvchi qo'shish
        </Button>
      </div>

      <div className="flex flex-wrap items-end gap-3 p-4 bg-muted/30 rounded-lg border">
        <div className="flex-1 min-w-[200px]">
          <Label className="text-[11px] font-medium text-muted-foreground mb-1 block">Ism bo'yicha qidirish</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Ism yoki familiya..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="pl-9 h-9 text-[13px]"
            />
          </div>
        </div>

        <div className="w-[200px]">
          <Label className="text-[11px] font-medium text-muted-foreground mb-1 block">Kafedra</Label>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="h-9 text-[13px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {departments.map((d) => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="w-[200px]">
          <Label className="text-[11px] font-medium text-muted-foreground mb-1 block">Lavozim</Label>
          <Select value={selectedPosition} onValueChange={setSelectedPosition}>
            <SelectTrigger className="h-9 text-[13px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {positions.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        onRowClick={(row) => navigate(`/teacher/${row.id}`, { state: { teacher: row } })}
      />

      <TeacherSheet />
    </div>
  );
}