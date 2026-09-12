import { useState } from "react";
import toast from "react-hot-toast";

import {
  createGorev,
  type GorevRequest,
} from "../../api/gorev";

import { getErrorMessage } from "../../utils/getErrorMessage";

import Button from "../ui/Button";

interface Secenek {
  id: number;
  ad: string;
}

interface GorevFormModalProps {
  birimler: Secenek[];
  gorevTurleri: Secenek[];
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

const GorevFormModal = ({
  birimler,
  gorevTurleri,
  onClose,
  onSuccess,
}: GorevFormModalProps) => {
  const bugun =
    new Date().toLocaleDateString("en-CA");

  const [tarih, setTarih] =
    useState("");

  const [
    baslangicSaati,
    setBaslangicSaati,
  ] = useState("");

  const [bitisSaati, setBitisSaati] =
    useState("");

  const [aciklama, setAciklama] =
    useState("");

  const [birimId, setBirimId] =
    useState("");

  const [gorevTuruId, setGorevTuruId] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // Sadece form doğrulama hataları için
  const [error, setError] =
    useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    if (!tarih) {
      setError(
        "Görev tarihi seçilmelidir."
      );
      return;
    }

    if (tarih < bugun) {
      setError(
        "Geçmiş tarihli görev oluşturulamaz."
      );
      return;
    }

    if (!birimId) {
      setError(
        "Birim seçilmelidir."
      );
      return;
    }

    if (!gorevTuruId) {
      setError(
        "Görev türü seçilmelidir."
      );
      return;
    }

    if (
      baslangicSaati &&
      bitisSaati &&
      bitisSaati <= baslangicSaati
    ) {
      setError(
        "Bitiş saati başlangıç saatinden sonra olmalıdır."
      );
      return;
    }

    try {
      setLoading(true);

      const data: GorevRequest = {
        tarih,
        baslangicSaati:
          baslangicSaati || null,
        bitisSaati:
          bitisSaati || null,
        aciklama:
          aciklama.trim(),
      };

      await createGorev(
        data,
        Number(birimId),
        Number(gorevTuruId)
      );

      await onSuccess();

      toast.success(
        "Görev başarıyla oluşturuldu."
      );

      onClose();
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Görev eklenirken bir hata oluştu."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-900">
            Yeni Görev
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Yeni görev bilgilerini giriniz.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Birim
            </label>

            <select
              value={birimId}
              onChange={(e) => {
                setBirimId(
                  e.target.value
                );
                setError("");
              }}
              disabled={loading}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="">
                Birim seçiniz
              </option>

              {birimler.map(
                (birim) => (
                  <option
                    key={birim.id}
                    value={birim.id}
                  >
                    {birim.ad}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Görev Türü
            </label>

            <select
              value={gorevTuruId}
              onChange={(e) => {
                setGorevTuruId(
                  e.target.value
                );
                setError("");
              }}
              disabled={loading}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="">
                Görev türü seçiniz
              </option>

              {gorevTurleri.map(
                (gorevTuru) => (
                  <option
                    key={
                      gorevTuru.id
                    }
                    value={
                      gorevTuru.id
                    }
                  >
                    {
                      gorevTuru.ad
                    }
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Tarih
            </label>

            <input
              type="date"
              min={bugun}
              value={tarih}
              onChange={(e) => {
                setTarih(
                  e.target.value
                );
                setError("");
              }}
              disabled={loading}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Başlangıç Saati
              </label>

              <input
                type="time"
                value={
                  baslangicSaati
                }
                onChange={(e) => {
                  setBaslangicSaati(
                    e.target.value
                  );
                  setError("");
                }}
                disabled={loading}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Bitiş Saati
              </label>

              <input
                type="time"
                value={
                  bitisSaati
                }
                onChange={(e) => {
                  setBitisSaati(
                    e.target.value
                  );
                  setError("");
                }}
                disabled={loading}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Açıklama
            </label>

            <textarea
              value={aciklama}
              onChange={(e) =>
                setAciklama(
                  e.target.value
                )
              }
              rows={4}
              maxLength={500}
              disabled={loading}
              placeholder="Görev açıklaması..."
              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />

            <p className="mt-1 text-right text-xs text-slate-400">
              {aciklama.length}
              /500
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
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
              Görev Ekle
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GorevFormModal;