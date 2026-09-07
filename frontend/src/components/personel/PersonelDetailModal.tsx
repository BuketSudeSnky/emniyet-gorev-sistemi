import type { Personel } from "../../types/personel";
import Button from "../ui/Button";

interface PersonelDetailModalProps {
  personel: Personel;
  onClose: () => void;
}

const PersonelDetailModal = ({
  personel,
  onClose,
}: PersonelDetailModalProps) => {
  const kanGrubuLabel: Record<string, string> = {
    A_POZITIF: "A+",
    A_NEGATIF: "A-",
    B_POZITIF: "B+",
    B_NEGATIF: "B-",
    AB_POZITIF: "AB+",
    AB_NEGATIF: "AB-",
    SIFIR_POZITIF: "0+",
    SIFIR_NEGATIF: "0-",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">

        {/* Başlık */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Personel Detayı
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {personel.ad} {personel.soyad}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            ✕
          </button>
        </div>

        {/* Bilgiler */}
        <div className="grid gap-x-8 gap-y-5 p-6 sm:grid-cols-2">

          <DetailItem
            label="Sicil Numarası"
            value={personel.sicilNo}
          />

          <DetailItem
            label="Birim"
            value={personel.birim.ad}
          />

          <DetailItem
            label="Ad"
            value={personel.ad}
          />

          <DetailItem
            label="Soyad"
            value={personel.soyad}
          />

          <DetailItem
            label="Cinsiyet"
            value={
              personel.cinsiyet === "ERKEK"
                ? "Erkek"
                : "Kadın"
            }
          />

          <DetailItem
            label="Telefon"
            value={personel.telefon}
          />

          <DetailItem
            label="Kan Grubu"
            value={
              kanGrubuLabel[personel.kanGrubu] ??
              personel.kanGrubu
            }
          />

          <DetailItem
            label="Durum"
            value={personel.aktif ? "Aktif" : "Pasif"}
          />

          {/* IBAN */}
          <div className="sm:col-span-2">
            <DetailItem
              label="IBAN"
              value={personel.iban}
            />
          </div>

        </div>

        {/* Alt bölüm */}
        <div className="flex justify-end border-t border-slate-200 px-6 py-4">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Kapat
          </Button>
        </div>

      </div>
    </div>
  );
};

interface DetailItemProps {
  label: string;
  value: string;
}

const DetailItem = ({
  label,
  value,
}: DetailItemProps) => {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1.5 text-sm font-medium text-slate-800">
        {value}
      </p>
    </div>
  );
};

export default PersonelDetailModal;