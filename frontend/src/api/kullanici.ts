import api from "./axios";

export type Rol = "ADMIN" | "BIRIM_YETKILISI";

export interface Kullanici {
  id: number;
  sicilNo: string;
  rol: Rol;
  aktif: boolean;
  birimId: number | null;
  birimAdi: string | null;
}

export interface KullaniciOlusturRequest {
  sicilNo: string;
  sifre: string;
  rol: Rol;
  birimId: number | null;
}

export interface KullaniciGuncelleRequest {
  sicilNo: string;
  rol: Rol;
  birimId: number | null;
}

export const getKullanicilar = async (): Promise<Kullanici[]> => {
  const response = await api.get<Kullanici[]>("/kullanicilar");
  return response.data;
};

export const createKullanici = async (
  data: KullaniciOlusturRequest
): Promise<Kullanici> => {
  const response = await api.post<Kullanici>("/kullanicilar", data);
  return response.data;
};

export const updateKullanici = async (
  id: number,
  data: KullaniciGuncelleRequest
): Promise<Kullanici> => {
  const response = await api.put<Kullanici>(`/kullanicilar/${id}`, data);
  return response.data;
};

export const pasifeAlKullanici = async (
  id: number
): Promise<Kullanici> => {
  const response = await api.patch<Kullanici>(
    `/kullanicilar/${id}/pasife-al`
  );
  return response.data;
};

export const aktifeAlKullanici = async (
  id: number
): Promise<Kullanici> => {
  const response = await api.patch<Kullanici>(
    `/kullanicilar/${id}/aktife-al`
  );
  return response.data;
};

export const sifreGuncelle = async (
  id: number,
  yeniSifre: string
): Promise<void> => {
  await api.patch(`/kullanicilar/${id}/sifre`, {
    yeniSifre,
  });
};