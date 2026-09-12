import { useState, type FormEvent } from "react";
import {
  sifreGuncelle,
  type Kullanici,
} from "../../api/kullanici";

interface KullaniciSifreModalProps {
  kullanici: Kullanici;
  onClose: () => void;
}

export default function KullaniciSifreModal({
  kullanici,
  onClose,
}: KullaniciSifreModalProps) {
  const [yeniSifre, setYeniSifre] = useState("");
  const [sifreTekrar, setSifreTekrar] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (yeniSifre.length < 8) {
      setError("Şifre en az 8 karakter olmalıdır.");
      return;
    }

    if (yeniSifre !== sifreTekrar) {
      setError("Girilen şifreler birbiriyle eşleşmiyor.");
      return;
    }

    try {
      setLoading(true);

      await sifreGuncelle(kullanici.id, yeniSifre);

      setSuccess("Kullanıcının şifresi başarıyla güncellendi.");
      setYeniSifre("");
      setSifreTekrar("");
    } catch {
      setError("Şifre güncellenirken bir hata oluştu.");
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
              Şifre Sıfırla
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {kullanici.sicilNo} sicil numaralı kullanıcının
              giriş şifresini değiştirin.
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

          {success && (
            <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
              {success}
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
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Yeni Şifre
            </label>

            <input
              type="password"
              value={yeniSifre}
              onChange={(e) => setYeniSifre(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              placeholder="En az 8 karakter"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Yeni Şifre Tekrar
            </label>

            <input
              type="password"
              value={sifreTekrar}
              onChange={(e) => setSifreTekrar(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              placeholder="Yeni şifreyi tekrar girin"
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Kapat
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}