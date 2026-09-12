import api from "./axios";

export interface GorevBirim {
  id: number;
  ad: string;
  aktif: boolean;
}

export interface GorevTuru {
  id: number;
  ad: string;
  aciklama: string;
  aktif: boolean;
}

export interface Gorev {
  id: number;
  gorevTuru: GorevTuru;
  birim: GorevBirim;
  tarih: string;
  baslangicSaati: string | null;
  bitisSaati: string | null;
  aciklama: string | null;
  aktif: boolean;
}

export interface GorevRequest {
  tarih: string;
  baslangicSaati: string | null;
  bitisSaati: string | null;
  aciklama: string;
}

export const getGorevler = async (): Promise<Gorev[]> => {
  const response = await api.get<Gorev[]>("/gorevler");

  return response.data;
};

export const createGorev = async (
  data: GorevRequest,
  birimId: number,
  gorevTuruId: number
): Promise<Gorev> => {
  const response = await api.post<Gorev>(
    "/gorevler",
    data,
    {
      params: {
        birimId,
        gorevTuruId,
      },
    }
  );

  return response.data;
};

export const updateGorev = async (
  id: number,
  data: GorevRequest,
  birimId: number,
  gorevTuruId: number
): Promise<Gorev> => {
  const response = await api.put<Gorev>(
    `/gorevler/${id}`,
    data,
    {
      params: {
        birimId,
        gorevTuruId,
      },
    }
  );

  return response.data;
};

export const pasifeAlGorev = async (
  id: number
): Promise<Gorev> => {
  const response = await api.delete<Gorev>(
    `/gorevler/${id}`
  );

  return response.data;
};

export const getGorevlerByBirim = async (
  birimId: number
): Promise<Gorev[]> => {
  const response = await api.get<Gorev[]>(
    `/gorevler/birim/${birimId}`
  );

  return response.data;
};

export const getGorevlerByTarih = async (
  tarih: string
): Promise<Gorev[]> => {
  const response = await api.get<Gorev[]>(
    "/gorevler/tarih",
    {
      params: {
        tarih,
      },
    }
  );

  return response.data;
};

export const getGorevlerByTur = async (
  gorevTuruId: number
): Promise<Gorev[]> => {
  const response = await api.get<Gorev[]>(
    `/gorevler/tur/${gorevTuruId}`
  );

  return response.data;
};