import api from "./axios";

export interface Birim {
  id: number;
  ad: string;
  aktif: boolean;
}

export interface BirimRequest {
  ad: string;
}

// Tüm birimleri getir
export const getBirimler = async (): Promise<Birim[]> => {
  const response = await api.get<Birim[]>("/birimler");

  return response.data;
};

// Yeni birim ekle
export const createBirim = async (
  data: BirimRequest
): Promise<Birim> => {
  const response = await api.post<Birim>(
    "/birimler",
    data
  );

  return response.data;
};

// Birim güncelle
export const updateBirim = async (
  id: number,
  data: BirimRequest
): Promise<Birim> => {
  const response = await api.put<Birim>(
    `/birimler/${id}`,
    data
  );

  return response.data;
};

// Birimi pasife al
export const pasifeAlBirim = async (
  id: number
): Promise<Birim> => {
  const response = await api.delete<Birim>(
    `/birimler/${id}`
  );

  return response.data;
};