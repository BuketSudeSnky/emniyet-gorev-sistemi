import api from "./axios";

import type { Personel } from "../types/personel";
import type { Gorev } from "./gorev";

export interface GorevPersonel {
  id: number;
  gorev: Gorev;
  personel: Personel;
}

export const personelleriGoreveAta = async (
  gorevId: number,
  personelIdleri: number[]
): Promise<GorevPersonel[]> => {
  const response = await api.post<GorevPersonel[]>(
    `/gorev-personel/ata/${gorevId}`,
    personelIdleri
  );

  return response.data;
};

export const getGoreveAtananPersoneller = async (
  gorevId: number
): Promise<GorevPersonel[]> => {
  const response = await api.get<GorevPersonel[]>(
    `/gorev-personel/gorev/${gorevId}`
  );

  return response.data;
};

export const getPersonelGorevGecmisi = async (
  personelId: number
): Promise<GorevPersonel[]> => {
  const response = await api.get<GorevPersonel[]>(
    `/gorev-personel/personel/${personelId}`
  );

  return response.data;
};

export const personeliGorevdenCikar = async (
  gorevId: number,
  personelId: number
): Promise<void> => {
  await api.delete(
    `/gorev-personel/gorev/${gorevId}/personel/${personelId}`
  );
};

export interface GorevDagitimSirasi {
  personelId: number;
  ad: string;
  soyad: string;
  sicilNo: string;
  gorevSayisi: number;
}

export const getGorevDagitimSirasi = async (
  birimId: number,
  gorevTuruId: number
): Promise<GorevDagitimSirasi[]> => {
  const response = await api.get<GorevDagitimSirasi[]>(
    "/gorev-personel/dagitim-sirasi",
    {
      params: {
        birimId,
        gorevTuruId,
      },
    }
  );

  return response.data;
};