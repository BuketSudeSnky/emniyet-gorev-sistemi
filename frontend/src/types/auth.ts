export type Role = "ADMIN" | "BIRIM_YETKILISI";

export interface LoginRequest {
  sicilNo: string;
  sifre: string;
}

export interface LoginResponse {
  id: number;
  sicilNo: string;
  rol: Role;
  birimId: number | null;
  birimAdi: string | null;
  token: string;
}