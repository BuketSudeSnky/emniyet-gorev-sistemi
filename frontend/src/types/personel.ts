export type Cinsiyet =
  | "KADIN"
  | "ERKEK";

export type KanGrubu =
  | "A_POZITIF"
  | "A_NEGATIF"
  | "B_POZITIF"
  | "B_NEGATIF"
  | "AB_POZITIF"
  | "AB_NEGATIF"
  | "SIFIR_POZITIF"
  | "SIFIR_NEGATIF";

export interface BirimSummary {
  id: number;
  ad: string;
  aktif: boolean;
}

export interface Personel {
  id: number;
  ad: string;
  soyad: string;
  cinsiyet: Cinsiyet;
  sicilNo: string;
  telefon: string;
  kanGrubu: KanGrubu;
  iban: string;
  aktif: boolean;
  birim: BirimSummary;
}

export interface PersonelRequest {
  ad: string;
  soyad: string;
  cinsiyet: Cinsiyet;
  sicilNo: string;
  telefon: string;
  kanGrubu: KanGrubu;
  iban: string;
}