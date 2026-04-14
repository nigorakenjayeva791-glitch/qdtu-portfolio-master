import { TableToolbar } from "@/components/table-toolbar/table-toolbar";
import { Card, CardContent } from "@/ui/card";
import { Pencil, Trash2, Users, Briefcase } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useModalActions, useModalIsOpen, useModalEditData } from "@/store/modalStore";
import { Modal } from "@/components/modal/modal";
import { Button } from "@/ui/button";
import { useForm } from "react-hook-form";
import { Label } from "@/ui/label";
import { Input } from "@/ui/input";
import { ConfirmPopover } from "@/components/confirm-popover/confirm-popover";
import { usePosition } from "@/hooks/position/usePosition";
import { useCreatePosition } from "@/hooks/position/useCreatePosition";
import { useUpdatePosition } from "@/hooks/position/useEditPosition";
import { useDeletePosition } from "@/hooks/position/useDeletePosition";
import { useStatsPosition } from "@/hooks/position/useStatsPosition";
import type { Position } from "@/features/positiion/position.type";

type PositionFormValues = {
  name: string;
};

export default function Positions() {
  const [search, setSearch] = useState("");
  const isOpen = useModalIsOpen();
  const { close, open } = useModalActions();
  const editData = useModalEditData() as Position | null;
  const isEdit = editData !== null;

  const { data: positionResponse, refetch } = usePosition();
  const { data: statsResponse } = useStatsPosition();

  const { mutate: createPosition, isPending: isCreating } = useCreatePosition();
  const { mutate: updatePosition, isPending: isUpdating } = useUpdatePosition();
  const { mutate: deletePosition } = useDeletePosition();
  const isPending = isCreating || isUpdating;

  const positions: Position[] = positionResponse?.data ?? [];

  const stats = statsResponse?.data;
  const totalEmployees =
    stats?.data?.reduce(
      (sum: number, item: { totalEmployees: number }) => sum + item.totalEmployees,
      0
    ) ?? 0;

  const filtered = useMemo(
    () => positions.filter((f) => f.name.toLowerCase().includes(search.toLowerCase())),
    [positions, search]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PositionFormValues>({
    defaultValues: { name: "" },
  });

  function handleClose() {
    reset();
    close();
  }

  useEffect(() => {
    if (editData) {
      reset({ name: editData.name });
    } else {
      reset({ name: "" });
    }
  }, [editData, reset]);

  const onSubmit = (values: PositionFormValues) => {
    if (isEdit && editData) {
      updatePosition(
        { id: editData.id, data: { name: values.name } },
        {
          onSuccess: () => {
            handleClose();
            refetch();
          },
        }
      );
      return;
    }

    createPosition(values.name, {
      onSuccess: () => {
        handleClose();
        refetch();
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card className="py-0">
            <CardContent className="flex items-center gap-4 px-5 py-4">
              <div className="flex items-center justify-center size-10 rounded-full bg-blue-50">
                <Briefcase className="size-5 text-blue-600" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[12px] text-muted-foreground">Jami lavozimlar</span>
                <span className="text-[20px] font-bold leading-tight">{stats.total}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="py-0">
            <CardContent className="flex items-center gap-4 px-5 py-4">
              <div className="flex items-center justify-center size-10 rounded-full bg-green-50">
                <Users className="size-5 text-blue-600" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[12px] text-muted-foreground">Jami xodimlar</span>
                <span className="text-[20px] font-bold leading-tight">{totalEmployees}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <TableToolbar
        countLabel="Lavozimlar soni"
        count={filtered.length}
        searchValue={search}
        onSearchChange={setSearch}
        onAdd={() => open()}
        addLabel="Lavozim qo'shish"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.length ? (
          filtered.map((position) => (
            <Card key={position.id} className="py-0">
              <CardContent className="flex flex-col gap-4 px-5 py-5">
                <div>
                  <span className="text-[15px] font-semibold">{position.name}</span>
                  <span className="text-[12px] text-muted-foreground block">
                    {position.totalEmployees || 0} ta xodim
                  </span>
                </div>

                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => open(position)}
                    className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-2 py-1 rounded-md text-[12px]"
                  >
                    <Pencil className="size-3 inline" /> Tahrirlash
                  </button>

                  <ConfirmPopover onConfirm={() => deletePosition(position.id)}>
                    <button className="bg-red-50 text-red-700 hover:bg-red-100 px-2 py-1 rounded-md text-[12px]">
                      <Trash2 className="size-3 inline" /> O'chirish
                    </button>
                  </ConfirmPopover>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground py-10">
            Ma'lumot topilmadi.
          </p>
        )}
      </div>

      <Modal open={isOpen} onClose={handleClose} title={isEdit ? "Tahrirlash" : "Qo'shish"}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div>
            <Label>Lavozim nomi</Label>
            <Input {...register("name", { required: "Majburiy" })} />
            {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Bekor qilish
            </Button>

            <Button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isPending ? "Yuklanmoqda..." : isEdit ? "Saqlash" : "Qo'shish"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}