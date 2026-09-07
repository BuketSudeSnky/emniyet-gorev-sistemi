import api from "./axios";

export interface Birim {
  id: number;
  ad: string;
  aktif: boolean;
}

export const getBirimler = async (): Promise<Birim[]> => {
  const response = await api.get<Birim[]>("/birimler");

  return response.data;
};