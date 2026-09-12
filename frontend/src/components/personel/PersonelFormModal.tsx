import { useState } from "react";
import toast from "react-hot-toast";

import { createPersonel } from "../../api/personel";

import type {
  Cinsiyet,
  KanGrubu,
  PersonelRequest,
} from "../../types/personel";

import type { Birim } from "../../api/birim";

import { getAuth } from "../../utils/authStorage";
import { getErrorMessage } from "../../utils/getErrorMessage";

import Button from "../ui/Button";
import Input from "../ui/Input";

interface PersonelFormModalProps {
  birimler: Birim[];
  onClose: () => void;
  onSuccess: () => void;
}

const PersonelFormModal = ({
  birimler,
  onClose,
  onSuccess,
}: PersonelFormModalProps) => {
  const auth = getAuth();

  const [ad, setAd] = useState("");
  const [soyad, setSoyad] = useState("");
  const [sicilNo, setSicilNo] = useState("");
  const [telefon, setTelefon] = useState("");
  const [iban, setIban] = useState("");

  const [cinsiyet, setCinsiyet] =
    useState<Cinsiyet | "">("");

  const [kanGrubu, setKanGrubu] =
    useState<KanGrubu | "">("");

  const [birimId, setBirimId] = useState(
    auth?.rol === "BIRIM_YETKILISI" && auth.birimId
      ? String(auth.birimId)
      : ""
  );

  const [loading, setLoading] = useState(false);

  // Sadece form doğrulama hataları için
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    if (
      !ad.trim() ||
      !soyad.trim() ||
      !sicilNo.trim() ||
      !telefon.trim() ||
      !iban.trim() ||
      !cinsiyet ||
      !kanGrubu ||
      !birimId
    ) {
      setError("Lütfen tüm zorunlu alanları doldurun.");
      return;
    }

    if (!/^05[0-9]{9}$/.test(telefon.trim())) {
      setError(
        "Telefon numarası 05 ile başlamalı ve 11 haneli olmalıdır."
      );
      return;
    }

    const formattedIban = iban
      .replace(/\s/g, "")
      .toUpperCase();

    if (!/^TR[0-9]{24}$/.test(formattedIban)) {
      setError(
        "IBAN TR ile başlamalı ve toplam 26 karakter olmalıdır."
      );
      return;
    }

    const data: PersonelRequest = {
      ad: ad.trim(),
      soyad: soyad.trim(),
      sicilNo: sicilNo.trim(),
      telefon: telefon.trim(),
      cinsiyet,
      kanGrubu,
      iban: formattedIban,
    };

    try {
      setLoading(true);

      await createPersonel(
        data,
        Number(birimId)
      );

      await onSuccess();

      toast.success(
        `${ad.trim()} ${soyad.trim()} personeli başarıyla eklendi.`
      );

      onClose();
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Personel eklenirken bir hata oluştu."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl">
        {/* Başlık */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Yeni Personel Ekle
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Personelin bilgilerini eksiksiz girin.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg px-3 py-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 p-6 sm:grid-cols-2">
            <Input
              label="Ad"
              value={ad}
              onChange={(e) => {
                setAd(e.target.value);
                setError("");
              }}
              placeholder="Personelin adı"
            />

            <Input
              label="Soyad"
              value={soyad}
              onChange={(e) => {
                setSoyad(e.target.value);
                setError("");
              }}
              placeholder="Personelin soyadı"
            />

            <Input
              label="Sicil No"
              value={sicilNo}
              onChange={(e) => {
                setSicilNo(e.target.value);
                setError("");
              }}
              placeholder="Sicil numarası"
            />

            <Input
              label="Telefon"
              value={telefon}
              onChange={(e) => {
                setTelefon(e.target.value);
                setError("");
              }}
              placeholder="05XXXXXXXXX"
              maxLength={11}
            />

            {/* Cinsiyet */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Cinsiyet
              </label>

              <select
                value={cinsiyet}
                onChange={(e) => {
                  setCinsiyet(
                    e.target.value as Cinsiyet | ""
                  );
                  setError("");
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-100"
              >
                <option value="">Seçiniz</option>
                <option value="ERKEK">Erkek</option>
                <option value="KADIN">Kadın</option>
              </select>
            </div>

            {/* Kan grubu */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Kan Grubu
              </label>

              <select
                value={kanGrubu}
                onChange={(e) => {
                  setKanGrubu(
                    e.target.value as KanGrubu | ""
                  );
                  setError("");
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-100"
              >
                <option value="">Seçiniz</option>
                <option value="A_POZITIF">A+</option>
                <option value="A_NEGATIF">A-</option>
                <option value="B_POZITIF">B+</option>
                <option value="B_NEGATIF">B-</option>
                <option value="AB_POZITIF">AB+</option>
                <option value="AB_NEGATIF">AB-</option>
                <option value="SIFIR_POZITIF">0+</option>
                <option value="SIFIR_NEGATIF">0-</option>
              </select>
            </div>

            {/* Birim */}
            {auth?.rol === "ADMIN" ? (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Birim
                </label>

                <select
                  value={birimId}
                  onChange={(e) => {
                    setBirimId(e.target.value);
                    setError("");
                  }}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-100"
                >
                  <option value="">
                    Birim seçiniz
                  </option>

                  {birimler.map((birim) => (
                    <option
                      key={birim.id}
                      value={birim.id}
                    >
                      {birim.ad}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Birim
                </label>

                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700">
                  {auth?.birimAdi || "-"}
                </div>
              </div>
            )}

            {/* IBAN */}
            <div className="sm:col-span-2">
              <Input
                label="IBAN"
                value={iban}
                onChange={(e) => {
                  setIban(e.target.value.toUpperCase());
                  setError("");
                }}
                placeholder="TRXXXXXXXXXXXXXXXXXXXXXXXX"
                maxLength={31}
              />

              <p className="mt-1.5 text-xs text-slate-500">
                Boşluk kullanabilirsiniz. Kaydedilirken boşluklar
                otomatik kaldırılır.
              </p>
            </div>
          </div>

          {/* Form doğrulama hatası */}
          {error && (
            <div className="mx-6 mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Butonlar */}
          <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              İptal
            </Button>

            <Button
              type="submit"
              loading={loading}
            >
              Personeli Kaydet
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonelFormModal;