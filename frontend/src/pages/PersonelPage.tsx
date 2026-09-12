import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  filterPersoneller,
  getPersoneller,
  pasifeAlPersonel,
  type PersonelFilterParams,
} from "../api/personel";

import { getBirimler, type Birim } from "../api/birim";

import type {
  Cinsiyet,
  KanGrubu,
  Personel,
} from "../types/personel";

import { getAuth } from "../utils/authStorage";
import { getErrorMessage } from "../utils/getErrorMessage";

import PersonelDetailModal from "../components/personel/PersonelDetailModal";
import PersonelFormModal from "../components/personel/PersonelFormModal";
import PersonelEditModal from "../components/personel/PersonelEditModal";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import ConfirmModal from "../components/ui/ConfirmModal";

const PersonelPage = () => {
  const auth = getAuth();

  const [personeller, setPersoneller] = useState<Personel[]>([]);
  const [birimler, setBirimler] = useState<Birim[]>([]);

  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);

  const [selectedPersonel, setSelectedPersonel] =
    useState<Personel | null>(null);

  const [showPersonelForm, setShowPersonelForm] =
    useState(false);

  const [editingPersonel, setEditingPersonel] =
    useState<Personel | null>(null);

  const [pasifeAlinacakPersonel, setPasifeAlinacakPersonel] =
    useState<Personel | null>(null);

  const [pasifeAlLoading, setPasifeAlLoading] =
    useState(false);

  const [ad, setAd] = useState("");
  const [soyad, setSoyad] = useState("");
  const [sicilNo, setSicilNo] = useState("");
  const [telefon, setTelefon] = useState("");

  const [cinsiyet, setCinsiyet] =
    useState<Cinsiyet | "">("");

  const [kanGrubu, setKanGrubu] =
    useState<KanGrubu | "">("");

  const [birimId, setBirimId] = useState("");
  const [aktif, setAktif] = useState("");

  useEffect(() => {
    const loadPage = async () => {
      try {
        setLoading(true);

        const personelData = await getPersoneller();
        setPersoneller(personelData);

        if (auth?.rol === "ADMIN") {
          const birimData = await getBirimler();

          setBirimler(
            birimData.filter((birim) => birim.aktif)
          );
        }
      } catch (error) {
        toast.error(
          getErrorMessage(
            error,
            "Veriler alınırken bir hata oluştu."
          ),
          {
            id: "personel-sayfa-yukleme-hatasi",
          }
        );
      } finally {
        setLoading(false);
      }
    };

    loadPage();
  }, [auth?.rol]);

  const refreshPersoneller = async () => {
    try {
      const data = await getPersoneller();
      setPersoneller(data);
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Personeller yenilenirken bir hata oluştu."
        ),
        {
          id: "personel-yenileme-hatasi",
        }
      );
    }
  };

  const handleFilter = async () => {
    try {
      setFilterLoading(true);

      const filters: PersonelFilterParams = {};

      if (ad.trim()) {
        filters.ad = ad.trim();
      }

      if (soyad.trim()) {
        filters.soyad = soyad.trim();
      }

      if (sicilNo.trim()) {
        filters.sicilNo = sicilNo.trim();
      }

      if (telefon.trim()) {
        filters.telefon = telefon.trim();
      }

      if (cinsiyet) {
        filters.cinsiyet = cinsiyet;
      }

      if (kanGrubu) {
        filters.kanGrubu = kanGrubu;
      }

      if (auth?.rol === "ADMIN" && birimId) {
        filters.birimId = Number(birimId);
      }

      if (aktif === "true") {
        filters.aktif = true;
      }

      if (aktif === "false") {
        filters.aktif = false;
      }

      const data = await filterPersoneller(filters);

      setPersoneller(data);
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Personeller filtrelenirken bir hata oluştu."
        )
      );
    } finally {
      setFilterLoading(false);
    }
  };

  const handleClearFilters = async () => {
    try {
      setFilterLoading(true);

      setAd("");
      setSoyad("");
      setSicilNo("");
      setTelefon("");
      setCinsiyet("");
      setKanGrubu("");
      setBirimId("");
      setAktif("");

      const data = await getPersoneller();

      setPersoneller(data);
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Personeller alınırken bir hata oluştu."
        )
      );
    } finally {
      setFilterLoading(false);
    }
  };

  const handleShowAll = async () => {
    try {
      setFilterLoading(true);

      setAd("");
      setSoyad("");
      setSicilNo("");
      setTelefon("");
      setCinsiyet("");
      setKanGrubu("");
      setBirimId("");
      setAktif("");

      const data = await filterPersoneller({});

      setPersoneller(data);
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Tüm personeller alınırken bir hata oluştu."
        )
      );
    } finally {
      setFilterLoading(false);
    }
  };

  const handlePasifeAl = async () => {
    if (!pasifeAlinacakPersonel) {
      return;
    }

    try {
      setPasifeAlLoading(true);

      await pasifeAlPersonel(
        pasifeAlinacakPersonel.id
      );

      toast.success(
        `${pasifeAlinacakPersonel.ad} ${pasifeAlinacakPersonel.soyad} pasife alındı.`
      );

      setPasifeAlinacakPersonel(null);

      await refreshPersoneller();
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          "Personel pasife alınırken bir hata oluştu."
        )
      );
    } finally {
      setPasifeAlLoading(false);
    }
  };

  const kanGrubuLabel: Record<KanGrubu, string> = {
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
    <div className="p-6">
      {/* Sayfa başlığı */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Personeller
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Sistemde kayıtlı personelleri görüntüleyebilir,
            filtreleyebilir ve yönetebilirsiniz.
          </p>
        </div>

        <Button
          onClick={() => setShowPersonelForm(true)}
        >
          + Yeni Personel Ekle
        </Button>
      </div>

      {/* Filtre paneli */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-slate-900">
            Personel Filtreleri
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Aradığınız personelleri kriterlere göre
            filtreleyebilirsiniz.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Input
            label="Sicil No"
            value={sicilNo}
            onChange={(e) =>
              setSicilNo(e.target.value)
            }
            placeholder="Örn. TEST001"
          />

          <Input
            label="Ad"
            value={ad}
            onChange={(e) =>
              setAd(e.target.value)
            }
            placeholder="Ad"
          />

          <Input
            label="Soyad"
            value={soyad}
            onChange={(e) =>
              setSoyad(e.target.value)
            }
            placeholder="Soyad"
          />

          <Input
            label="Telefon"
            value={telefon}
            onChange={(e) =>
              setTelefon(e.target.value)
            }
            placeholder="05..."
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Cinsiyet
            </label>

            <select
              value={cinsiyet}
              onChange={(e) =>
                setCinsiyet(
                  e.target.value as
                    | Cinsiyet
                    | ""
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-slate-700 focus:ring-2 focus:ring-slate-100"
            >
              <option value="">Tümü</option>
              <option value="ERKEK">
                Erkek
              </option>
              <option value="KADIN">
                Kadın
              </option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Kan Grubu
            </label>

            <select
              value={kanGrubu}
              onChange={(e) =>
                setKanGrubu(
                  e.target.value as
                    | KanGrubu
                    | ""
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-slate-700 focus:ring-2 focus:ring-slate-100"
            >
              <option value="">Tümü</option>
              <option value="A_POZITIF">
                A+
              </option>
              <option value="A_NEGATIF">
                A-
              </option>
              <option value="B_POZITIF">
                B+
              </option>
              <option value="B_NEGATIF">
                B-
              </option>
              <option value="AB_POZITIF">
                AB+
              </option>
              <option value="AB_NEGATIF">
                AB-
              </option>
              <option value="SIFIR_POZITIF">
                0+
              </option>
              <option value="SIFIR_NEGATIF">
                0-
              </option>
            </select>
          </div>

          {auth?.rol === "ADMIN" && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Birim
              </label>

              <select
                value={birimId}
                onChange={(e) =>
                  setBirimId(
                    e.target.value
                  )
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-slate-700 focus:ring-2 focus:ring-slate-100"
              >
                <option value="">
                  Tüm Birimler
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
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Durum
            </label>

            <select
              value={aktif}
              onChange={(e) =>
                setAktif(e.target.value)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-all focus:border-slate-700 focus:ring-2 focus:ring-slate-100"
            >
              <option value="">Tümü</option>
              <option value="true">
                Aktif
              </option>
              <option value="false">
                Pasif
              </option>
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap justify-end gap-3">
          <Button
            variant="secondary"
            onClick={handleShowAll}
            disabled={filterLoading}
          >
            Tümünü Göster
          </Button>

          <Button
            variant="secondary"
            onClick={handleClearFilters}
            disabled={filterLoading}
          >
            Temizle
          </Button>

          <Button
            onClick={handleFilter}
            loading={filterLoading}
          >
            Filtrele
          </Button>
        </div>
      </div>

      {/* Tablo */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-6 text-sm text-slate-500">
            Personeller yükleniyor...
          </div>
        ) : personeller.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">
            Arama kriterlerine uygun personel bulunamadı.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-5 py-3 font-semibold text-slate-600">
                    Sicil No
                  </th>

                  <th className="px-5 py-3 font-semibold text-slate-600">
                    Ad Soyad
                  </th>

                  <th className="px-5 py-3 font-semibold text-slate-600">
                    Birim
                  </th>

                  <th className="px-5 py-3 font-semibold text-slate-600">
                    Cinsiyet
                  </th>

                  <th className="px-5 py-3 font-semibold text-slate-600">
                    Telefon
                  </th>

                  <th className="px-5 py-3 font-semibold text-slate-600">
                    Kan Grubu
                  </th>

                  <th className="px-5 py-3 font-semibold text-slate-600">
                    Durum
                  </th>

                  <th className="px-5 py-3 font-semibold text-slate-600">
                    İşlemler
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {personeller.map(
                  (personel) => (
                    <tr
                      key={personel.id}
                      className="transition-colors hover:bg-slate-50"
                    >
                      <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-900">
                        {personel.sicilNo}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-slate-700">
                        {personel.ad}{" "}
                        {personel.soyad}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-slate-700">
                        {personel.birim.ad}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-slate-700">
                        {personel.cinsiyet ===
                        "ERKEK"
                          ? "Erkek"
                          : "Kadın"}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-slate-700">
                        {personel.telefon}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-slate-700">
                        {
                          kanGrubuLabel[
                            personel
                              .kanGrubu
                          ]
                        }
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            personel.aktif
                              ? "bg-green-50 text-green-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {personel.aktif
                            ? "Aktif"
                            : "Pasif"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedPersonel(
                                personel
                              )
                            }
                            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                          >
                            Detay
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setEditingPersonel(
                                personel
                              )
                            }
                            className="rounded-lg border border-blue-300 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
                          >
                            Düzenle
                          </button>

                          {personel.aktif && (
                            <button
                              type="button"
                              onClick={() =>
                                setPasifeAlinacakPersonel(
                                  personel
                                )
                              }
                              className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
                            >
                              Pasife Al
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Personel detay modalı */}
      {selectedPersonel && (
        <PersonelDetailModal
          personel={selectedPersonel}
          onClose={() =>
            setSelectedPersonel(null)
          }
        />
      )}

      {/* Personel ekleme modalı */}
      {showPersonelForm && (
        <PersonelFormModal
          birimler={birimler}
          onClose={() =>
            setShowPersonelForm(false)
          }
          onSuccess={
            refreshPersoneller
          }
        />
      )}

      {/* Personel düzenleme modalı */}
      {editingPersonel && (
        <PersonelEditModal
          personel={editingPersonel}
          birimler={birimler}
          onClose={() =>
            setEditingPersonel(null)
          }
          onSuccess={
            refreshPersoneller
          }
        />
      )}

      {/* Personel pasife alma onay modalı */}
      {pasifeAlinacakPersonel && (
        <ConfirmModal
          title="Personeli Pasife Al"
          message={`${pasifeAlinacakPersonel.ad} ${pasifeAlinacakPersonel.soyad} isimli personeli pasife almak istediğinize emin misiniz?`}
          confirmText="Pasife Al"
          cancelText="İptal"
          loading={pasifeAlLoading}
          onConfirm={
            handlePasifeAl
          }
          onCancel={() =>
            setPasifeAlinacakPersonel(
              null
            )
          }
        />
      )}
    </div>
  );
};

export default PersonelPage;