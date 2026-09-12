import { useState } from "react";
import toast from "react-hot-toast";

import { createBirim } from "../../api/birim";
import { getErrorMessage } from "../../utils/getErrorMessage";

import Button from "../ui/Button";
import Input from "../ui/Input";

interface BirimFormModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const BirimFormModal = ({
  onClose,
  onSuccess,
}: BirimFormModalProps) => {
  const [ad, setAd] = useState("");
  const [loading, setLoading] = useState(false);

  // Sadece form doğrulama hataları için
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    if (!ad.trim()) {
      setError("Birim adı zorunludur.");
      return;
    }

    try {
      setLoading(true);

      await createBirim({
        ad: ad.trim(),
      });

      await onSuccess();

      toast.success(
        `${ad.trim()} birimi başarıyla eklendi.`
      );

      onClose();
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Birim eklenirken bir hata oluştu."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        {/* Başlık */}
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Yeni Birim Ekle
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Sisteme yeni bir emniyet birimi ekleyin.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6"
        >
          <Input
            label="Birim Adı"
            value={ad}
            onChange={(e) => {
              setAd(e.target.value);
              setError("");
            }}
            placeholder="Örn. Asayiş Büro"
            disabled={loading}
          />

          {/* Form doğrulama hatası */}
          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
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
              Birim Ekle
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BirimFormModal;