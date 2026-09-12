import { useState } from "react";
import toast from "react-hot-toast";

import { createGorevTuru } from "../../api/gorevTuru";
import { getErrorMessage } from "../../utils/getErrorMessage";

import Button from "../ui/Button";
import Input from "../ui/Input";

interface GorevTuruFormModalProps {
  onClose: () => void;
  onSuccess: () => Promise<void>;
}

const GorevTuruFormModal = ({
  onClose,
  onSuccess,
}: GorevTuruFormModalProps) => {
  const [ad, setAd] = useState("");
  const [aciklama, setAciklama] = useState("");

  const [loading, setLoading] = useState(false);

  // Sadece form doğrulama hataları için
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    if (!ad.trim()) {
      setError("Görev türü adı boş bırakılamaz.");
      return;
    }

    try {
      setLoading(true);

      await createGorevTuru({
        ad: ad.trim(),
        aciklama: aciklama.trim(),
      });

      await onSuccess();

      toast.success(
        `${ad.trim()} görev türü başarıyla eklendi.`
      );

      onClose();
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Görev türü eklenirken bir hata oluştu."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-slate-900">
            Yeni Görev Türü
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Sisteme yeni bir görev türü ekleyin.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <Input
            label="Görev Türü Adı"
            value={ad}
            onChange={(e) => {
              setAd(e.target.value);
              setError("");
            }}
            placeholder="Örn. Nöbet"
            disabled={loading}
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Açıklama
            </label>

            <textarea
              value={aciklama}
              onChange={(e) =>
                setAciklama(e.target.value)
              }
              placeholder="Görev türü hakkında açıklama..."
              rows={4}
              disabled={loading}
              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-100"
            />
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
              Görev Türü Ekle
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GorevTuruFormModal;