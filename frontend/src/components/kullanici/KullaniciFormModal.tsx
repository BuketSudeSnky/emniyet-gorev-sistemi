import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  createKullanici,
  getKullanicilar,
  type Rol,
} from "../../api/kullanici";
import { getBirimler, type Birim } from "../../api/birim";
import { getPersoneller } from "../../api/personel";
import type { Personel } from "../../types/personel";

interface KullaniciFormModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function KullaniciFormModal({
  onClose,
  onSuccess,
}: KullaniciFormModalProps) {
  const [rol, setRol] = useState<Rol>("BIRIM_YETKILISI");
  const [birimId, setBirimId] = useState("");
  const [personelId, setPersonelId] = useState("");
  const [sifre, setSifre] = useState("");

  const [birimler, setBirimler] = useState<Birim[]>([]);
  const [personeller, setPersoneller] = useState<Personel[]>([]);
  const [kullaniciSicilleri, setKullaniciSicilleri] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [verilerYukleniyor, setVerilerYukleniyor] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    Promise.all([
      getBirimler(),
      getPersoneller(),
      getKullanicilar(),
    ])
      .then(([birimData, personelData, kullaniciData]) => {
        if (!active) {
          return;
        }

        setBirimler(
          birimData.filter((birim) => birim.aktif)
        );

        setPersoneller(
          personelData.filter((personel) => personel.aktif)
        );

        setKullaniciSicilleri(
          kullaniciData.map((kullanici) => kullanici.sicilNo)
        );
      })
      .catch(() => {
        if (active) {
          setError("Kullanıcı oluşturma bilgileri yüklenemedi.");
        }
      })
      .finally(() => {
        if (active) {
          setVerilerYukleniyor(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const uygunPersoneller = useMemo(() => {
    return personeller.filter((personel) => {
      // Bu personele daha önce kullanıcı hesabı açılmışsa gösterme
      if (kullaniciSicilleri.includes(personel.sicilNo)) {
        return false;
      }

      // Birim yetkilisi yalnızca seçilen birimdeki personellerden olabilir
      if (rol === "BIRIM_YETKILISI") {
        if (!birimId) {
          return false;
        }

        return personel.birim.id === Number(birimId);
      }

      // Admin için tüm uygun aktif personeller
      return true;
    });
  }, [
    personeller,
    kullaniciSicilleri,
    rol,
    birimId,
  ]);

  const secilenPersonel = personeller.find(
    (personel) => personel.id === Number(personelId)
  );

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");

    if (rol === "BIRIM_YETKILISI" && !birimId) {
      setError("Birim yetkilisi için birim seçmelisiniz.");
      return;
    }

    if (!secilenPersonel) {
      setError("Kullanıcı hesabı açılacak personeli seçmelisiniz.");
      return;
    }

    try {
      setLoading(true);

      await createKullanici({
        sicilNo: secilenPersonel.sicilNo,
        sifre,
        rol,
        birimId:
          rol === "BIRIM_YETKILISI"
            ? Number(birimId)
            : null,
      });

      await onSuccess();
      onClose();
    } catch {
      setError("Kullanıcı oluşturulurken bir hata oluştu.");
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
              Yeni Kullanıcı
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Mevcut bir personele sistem giriş yetkisi verin.
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
              Rol
            </label>

            <select
              value={rol}
              onChange={(e) => {
                const yeniRol = e.target.value as Rol;

                setRol(yeniRol);
                setPersonelId("");

                if (yeniRol === "ADMIN") {
                  setBirimId("");
                }
              }}
              disabled={verilerYukleniyor}
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
                  setPersonelId("");
                }}
                required
                disabled={verilerYukleniyor}
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

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Personel
            </label>

            <select
              value={personelId}
              onChange={(e) => setPersonelId(e.target.value)}
              required
              disabled={
                verilerYukleniyor ||
                (rol === "BIRIM_YETKILISI" && !birimId)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 disabled:bg-gray-100"
            >
              <option value="">
                {rol === "BIRIM_YETKILISI" && !birimId
                  ? "Önce birim seçiniz"
                  : "Personel seçiniz"}
              </option>

              {uygunPersoneller.map((personel) => (
                <option
                  key={personel.id}
                  value={personel.id}
                >
                  {personel.ad} {personel.soyad} — {personel.sicilNo}
                </option>
              ))}
            </select>

            {!verilerYukleniyor &&
              (rol === "ADMIN" || birimId) &&
              uygunPersoneller.length === 0 && (
                <p className="mt-1 text-xs text-gray-500">
                  Kullanıcı hesabı olmayan uygun personel bulunamadı.
                </p>
              )}
          </div>

          {secilenPersonel && (
            <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
              <div>
                <span className="font-medium">
                  Sicil No:
                </span>{" "}
                {secilenPersonel.sicilNo}
              </div>

              <div>
                <span className="font-medium">
                  Personel:
                </span>{" "}
                {secilenPersonel.ad} {secilenPersonel.soyad}
              </div>

              <div>
                <span className="font-medium">
                  Birim:
                </span>{" "}
                {secilenPersonel.birim.ad}
              </div>
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              İlk Şifre
            </label>

            <input
              type="password"
              value={sifre}
              onChange={(e) => setSifre(e.target.value)}
              required
              minLength={8}
              disabled={verilerYukleniyor}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
              placeholder="En az 8 karakter"
            />
          </div>

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
              disabled={
                loading ||
                verilerYukleniyor ||
                !secilenPersonel
              }
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Kaydediliyor..."
                : "Kullanıcı Hesabı Oluştur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}