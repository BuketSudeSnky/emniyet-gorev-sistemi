import api from "./axios";

export interface GorevTuru {
  id: number;
  ad: string;
  aciklama: string;
  aktif: boolean;
}

export interface GorevTuruRequest {
  ad: string;
  aciklama: string;
}

// Görev türlerini getir
export const getGorevTurleri = async (): Promise<GorevTuru[]> => {
  const response = await api.get<GorevTuru[]>(
    "/gorev-turleri"
  );

  return response.data;
};

// Yeni görev türü ekle
export const createGorevTuru = async (
  data: GorevTuruRequest
): Promise<GorevTuru> => {
  const response = await api.post<GorevTuru>(
    "/gorev-turleri",
    data
  );

  return response.data;
};

// Görev türünü güncelle
export const updateGorevTuru = async (
  id: number,
  data: GorevTuruRequest
): Promise<GorevTuru> => {
  const response = await api.put<GorevTuru>(
    `/gorev-turleri/${id}`,
    data
  );

  return response.data;
};

// Görev türünü pasife al
export const pasifeAlGorevTuru = async (
  id: number
): Promise<GorevTuru> => {
  const response = await api.delete<GorevTuru>(
    `/gorev-turleri/${id}`
  );

  return response.data;
};