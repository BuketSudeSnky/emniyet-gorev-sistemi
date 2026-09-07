import { useState } from "react";
import axios from "axios";

import {
  updateBirim,
  type Birim,
} from "../../api/birim";

import Button from "../ui/Button";
import Input from "../ui/Input";

interface BirimEditModalProps {
  birim: Birim;
  onClose: () => void;
  onSuccess: () => void;
}

const BirimEditModal = ({
  birim,
  onClose,
  onSuccess,
}: BirimEditModalProps) => {
  const [ad, setAd] = useState(birim.ad);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!ad.trim()) {
      setError("Birim adı zorunludur.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await updateBirim(birim.id, {
        ad: ad.trim(),
      });

      await onSuccess();
      onClose();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Birim güncellenirken bir hata oluştu."
        );
      } else {
        setError("Beklenmeyen bir hata oluştu.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Birim Düzenle
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Birim adını güncelleyebilirsiniz.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6"
        >
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <Input
            label="Birim Adı"
            value={ad}
            onChange={(e) => setAd(e.target.value)}
            disabled={loading}
          />

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
              Değişiklikleri Kaydet
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BirimEditModal;