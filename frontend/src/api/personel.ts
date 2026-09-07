import api from "./axios";

import type {
  Cinsiyet,
  KanGrubu,
  Personel,
  PersonelRequest,
} from "../types/personel";

export interface PersonelFilterParams {
  ad?: string;
  soyad?: string;
  sicilNo?: string;
  telefon?: string;
  cinsiyet?: Cinsiyet;
  kanGrubu?: KanGrubu;
  birimId?: number;
  aktif?: boolean;
}

export const getPersoneller = async (): Promise<Personel[]> => {
  const response = await api.get<Personel[]>("/personeller");

  return response.data;
};

export const filterPersoneller = async (
  filters: PersonelFilterParams
): Promise<Personel[]> => {
  const response = await api.get<Personel[]>(
    "/personeller/filtrele",
    {
      params: filters,
    }
  );

  return response.data;
};

export const createPersonel = async (
  data: PersonelRequest,
  birimId: number
): Promise<Personel> => {
  const response = await api.post<Personel>(
    "/personeller",
    data,
    {
      params: {
        birimId,
      },
    }
  );

  return response.data;
};

export const updatePersonel = async (
  id: number,
  data: PersonelRequest,
  birimId: number
): Promise<Personel> => {
  const response = await api.put<Personel>(
    `/personeller/${id}`,
    data,
    {
      params: { birimId },
    }
  );

  return response.data;
};

export const pasifeAlPersonel = async (
  id: number
): Promise<void> => {
  await api.delete(`/personeller/${id}`);
};