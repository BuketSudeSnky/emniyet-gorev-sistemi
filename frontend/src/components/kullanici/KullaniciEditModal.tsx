import { useEffect, useState, type FormEvent } from "react";
import toast from "react-hot-toast";

import {
  updateKullanici,
  type Kullanici,
  type Rol,
} from "../../api/kullanici";

import { getBirimler, type Birim } from "../../api/birim";
import { getErrorMessage } from "../../utils/getErrorMessage";

interface KullaniciEditModalProps {
  kullanici: Kullanici;
  onClose: () => void;
  onSuccess: () => void;
}

export default function KullaniciEditModal({
  kullanici,
  onClose,
  onSuccess,
}: KullaniciEditModalProps) {
  const [rol, setRol] = useState<Rol>(kullanici.rol);

  const [birimId, setBirimId] = useState(
    kullanici.birimId?.toString() ?? ""
  );

  const [birimler, setBirimler] = useState<Birim[]>([]);
  const [loading, setLoading] = useState(false);

  // Sadece form doğrulama hataları için
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getBirimler()
      .then((data) => {
        if (active) {
          setBirimler(
            data.filter((birim) => birim.aktif)
          );
        }
      })
      .catch((error) => {
        if (active) {
          toast.error(
            getErrorMessage(
              error,
              "Birimler yüklenirken bir hata oluştu."
            )
          );
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");

    if (rol === "BIRIM_YETKILISI" && !birimId) {
      setError(
        "Birim yetkilisi için birim seçmelisiniz."
      );
      return;
    }

    try {
      setLoading(true);

      await updateKullanici(kullanici.id, {
        sicilNo: kullanici.sicilNo,
        rol,
        birimId:
          rol === "BIRIM_YETKILISI"
            ? Number(birimId)
            : null,
      });

      await onSuccess();

      toast.success(
        `${kullanici.sicilNo} kullanıcısı güncellendi.`
      );

      onClose();
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Kullanıcı güncellenirken bir hata oluştu."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Kullanıcı Düzenle
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Kullanıcının rol ve birim yetkisini düzenleyin.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 p-6"
        >
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Sicil No
            </label>

            <input
              type="text"
              value={kullanici.sicilNo}
              disabled
              className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-gray-600"
            />

            <p className="mt-1 text-xs text-gray-500">
              Sicil numarası personel kaydından gelir ve buradan değiştirilemez.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Rol
            </label>

            <select
              value={rol}
              onChange={(e) => {
                const yeniRol = e.target.value as Rol;

                setRol(yeniRol);
                setError("");

                if (yeniRol === "ADMIN") {
                  setBirimId("");
                }
              }}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            >
              <option value="BIRIM_YETKILISI">
                Birim Yetkilisi
              </option>

              <option value="ADMIN">
                Admin
              </option>
            </select>
          </div>

          {rol === "BIRIM_YETKILISI" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Birim
              </label>

              <select
                value={birimId}
                onChange={(e) => {
                  setBirimId(e.target.value);
                  setError("");
                }}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
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
          )}

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              İptal
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Kaydediliyor..."
                : "Değişiklikleri Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}