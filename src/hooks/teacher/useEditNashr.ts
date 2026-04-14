import { publicationService } from "@/features/publication/publication.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export enum PublicationType {
  ARTICLE = 'ARTICLE',
  BOOK = 'BOOK',
  PROCEEDING = 'PROCEEDING',
  OTHERS = 'OTHERS'
}

export enum AuthorRole {
  COAUTHOR = 'COAUTHOR',
  FIRST_AUTHOR = 'FIRST_AUTHOR',
  BOTH_AUTHOR = 'BOTH_AUTHOR'
}

export enum DegreeLevel {
  INTERNATIONAL = 'INTERNATIONAL',
  NATIONAL = 'NATIONAL'
}

export interface EditPublicationInput {
  id: number;
  userId: number;
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  type: PublicationType;
  author: AuthorRole;
  degree: DegreeLevel;
  volume: string;
  institution: string;
  popular: boolean;
}

export function useEditNashr() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: EditPublicationInput) => {
      const { id, ...data } = input;
      return publicationService.edit(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Nashr"] });
      toast.success("Nashr muvaffaqiyatli tahrirlandi");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Nashrni tahrirlashda xatolik yuz berdi"
      );
    },
  });
}