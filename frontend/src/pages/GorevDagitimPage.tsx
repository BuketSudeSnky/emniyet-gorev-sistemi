import { useEffect, useState } from "react";
import axios from "axios";

import {
  getGorevDagitimSirasi,
  getGoreveAtananPersoneller,
  personelleriGoreveAta,
  type GorevDagitimSirasi,
} from "../api/gorevPersonel";

import {
  getBirimler,
  type Birim,
} from "../api/birim";

import {
  getGorevTurleri,
  type GorevTuru,
} from "../api/gorevTuru";

import {
  getGorevlerByBirim,
  type Gorev,
} from "../api/gorev";

import { getAuth } from "../utils/authStorage";
import Button from "../components/ui/Button";

const GorevDagitimPage = () => {
  const [birimler, setBirimler] =
    useState<Birim[]>([]);

  const [gorevTurleri, setGorevTurleri] =
    useState<GorevTuru[]>([]);

  const [gorevler, setGorevler] =
    useState<Gorev[]>([]);

  const [birimId, setBirimId] =
    useState("");

  const [gorevTuruId, setGorevTuruId] =
    useState("");

  const [gorevId, setGorevId] =
    useState("");

  const [dagitimSirasi, setDagitimSirasi] =
    useState<GorevDagitimSirasi[]>([]);

  const [
    secilenPersonelIdleri,
    setSecilenPersonelIdleri,
  ] = useState<number[]>([]);

  const [
    atananPersonelIdleri,
    setAtananPersonelIdleri,
  ] = useState<number[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [
    gorevlerLoading,
    setGorevlerLoading,
  ] = useState(false);

  const [
    siralamayiGetiriyor,
    setSiralamayiGetiriyor,
  ] = useState(false);

  const [
    atamaYapiliyor,
    setAtamaYapiliyor,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const auth = getAuth();

  const authRol = auth?.rol;
  const authBirimId = auth?.birimId;
  const authBirimAdi = auth?.birimAdi;

  /*
   * Sayfa ilk açıldığında görev türlerini
   * ve kullanıcının yetkisine göre birimleri getirir.
   */
  useEffect(() => {
    let aktif = true;

    const fetchData = async () => {
      try {
        const gorevTuruData =
          await getGorevTurleri();

        if (!aktif) {
          return;
        }

        setGorevTurleri(
          gorevTuruData.filter(
            (gorevTuru) =>
              gorevTuru.aktif
          )
        );

        /*
         * ADMIN bütün aktif birimleri görebilir.
         */
        if (authRol === "ADMIN") {
          const birimData =
            await getBirimler();

          if (!aktif) {
            return;
          }

          setBirimler(
            birimData.filter(
              (birim) =>
                birim.aktif
            )
          );
        }

        /*
         * BIRIM_YETKILISI sadece
         * kendi birimini kullanabilir.
         */
        if (
          authRol === "BIRIM_YETKILISI" &&
          authBirimId &&
          authBirimAdi
        ) {
          setBirimler([
            {
              id: authBirimId,
              ad: authBirimAdi,
              aktif: true,
            },
          ]);

          setBirimId(
            String(authBirimId)
          );
        }

        setError("");
      } catch (err) {
        if (!aktif) {
          return;
        }

        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              "Sayfa bilgileri yüklenirken bir hata oluştu."
          );
        } else {
          setError(
            "Sayfa bilgileri yüklenirken bir hata oluştu."
          );
        }
      } finally {
        if (aktif) {
          setLoading(false);
        }
      }
    };

    void fetchData();

    return () => {
      aktif = false;
    };
  }, [
    authRol,
    authBirimId,
    authBirimAdi,
  ]);

  /*
   * Birim seçildiğinde o birime ait
   * görevleri getiriyoruz.
   */
  useEffect(() => {
    let aktif = true;

    if (!birimId) {
      return () => {
        aktif = false;
      };
    }

    Promise.resolve()
      .then(() => {
        if (!aktif) {
          return undefined;
        }

        setGorevlerLoading(true);

        return getGorevlerByBirim(
          Number(birimId)
        );
      })
      .then((data) => {
        if (!aktif || !data) {
          return;
        }

        setGorevler(data);
        setGorevId("");
        setError("");
      })
      .catch((err) => {
        if (!aktif) {
          return;
        }

        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              "Görevler yüklenirken bir hata oluştu."
          );
        } else {
          setError(
            "Görevler yüklenirken bir hata oluştu."
          );
        }

        setGorevler([]);
      })
      .finally(() => {
        if (aktif) {
          setGorevlerLoading(false);
        }
      });

    return () => {
      aktif = false;
    };
  }, [birimId]);

  /*
   * Seçilen görev türüne ait aktif görevler.
   */
  const uygunGorevler =
    gorevler.filter(
      (gorev) =>
        gorev.aktif &&
        gorev.gorevTuru.id ===
          Number(gorevTuruId)
    );

  /*
   * Personel checkbox seçme / kaldırma.
   */
  const handlePersonelSec = (
    personelId: number
  ) => {
    /*
     * Zaten görevde olan personelin
     * tekrar seçilmesini engelliyoruz.
     */
    if (
      atananPersonelIdleri.includes(
        personelId
      )
    ) {
      return;
    }

    setSecilenPersonelIdleri(
      (onceki) =>
        onceki.includes(personelId)
          ? onceki.filter(
              (id) =>
                id !== personelId
            )
          : [
              ...onceki,
              personelId,
            ]
    );

    setSuccess("");
    setError("");
  };

  /*
   * Dağıtım sırasını ve seçilen göreve
   * daha önce atanmış personelleri getirir.
   */
  const handleSiralamayiGetir =
    async () => {
      if (!birimId) {
        setError(
          "Lütfen birim seçiniz."
        );
        return;
      }

      if (!gorevTuruId) {
        setError(
          "Lütfen görev türü seçiniz."
        );
        return;
      }

      if (!gorevId) {
        setError(
          "Lütfen görev seçiniz."
        );
        return;
      }

      try {
        setSiralamayiGetiriyor(true);
        setError("");
        setSuccess("");

        const [
          dagitimData,
          atamaData,
        ] = await Promise.all([
          getGorevDagitimSirasi(
            Number(birimId),
            Number(gorevTuruId)
          ),

          getGoreveAtananPersoneller(
            Number(gorevId)
          ),
        ]);

        setDagitimSirasi(
          dagitimData
        );

        setAtananPersonelIdleri(
          atamaData.map(
            (atama) =>
              atama.personel.id
          )
        );

        setSecilenPersonelIdleri(
          []
        );
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              "Görev dağıtım sırası alınırken bir hata oluştu."
          );
        } else {
          setError(
            "Görev dağıtım sırası alınırken bir hata oluştu."
          );
        }

        setDagitimSirasi([]);
        setAtananPersonelIdleri(
          []
        );
        setSecilenPersonelIdleri(
          []
        );
      } finally {
        setSiralamayiGetiriyor(
          false
        );
      }
    };

  /*
   * Seçilen personelleri gerçek göreve atar.
   */
  const handleGoreveAta =
    async () => {
      if (!gorevId) {
        setError(
          "Lütfen görev seçiniz."
        );
        return;
      }

      if (
        secilenPersonelIdleri.length ===
        0
      ) {
        setError(
          "Lütfen en az bir personel seçiniz."
        );
        return;
      }

      try {
        setAtamaYapiliyor(true);
        setError("");
        setSuccess("");

        await personelleriGoreveAta(
          Number(gorevId),
          secilenPersonelIdleri
        );

        setSuccess(
          `${secilenPersonelIdleri.length} personel göreve başarıyla atandı.`
        );

        /*
         * Atama tamamlandıktan sonra seçimleri temizle.
         */
        setSecilenPersonelIdleri(
          []
        );

        /*
         * Görev sayıları değiştiği için dağıtım
         * sırasını yeniden getiriyoruz.
         */
        const [
          dagitimData,
          atamaData,
        ] = await Promise.all([
          getGorevDagitimSirasi(
            Number(birimId),
            Number(gorevTuruId)
          ),

          getGoreveAtananPersoneller(
            Number(gorevId)
          ),
        ]);

        setDagitimSirasi(
          dagitimData
        );

        setAtananPersonelIdleri(
          atamaData.map(
            (atama) =>
              atama.personel.id
          )
        );
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              "Personeller göreve atanırken bir hata oluştu."
          );
        } else {
          setError(
            "Personeller göreve atanırken bir hata oluştu."
          );
        }
      } finally {
        setAtamaYapiliyor(false);
      }
    };

  /*
   * Form seçimlerini temizler.
   */
  const secimiTemizle = () => {
    if (authRol === "ADMIN") {
      setBirimId("");
      setGorevler([]);
    }

    setGorevTuruId("");
    setGorevId("");
    setDagitimSirasi([]);
    setSecilenPersonelIdleri(
      []
    );
    setAtananPersonelIdleri(
      []
    );
    setError("");
    setSuccess("");
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
        Görev dağıtım bilgileri yükleniyor...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* BAŞLIK */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Görev Dağıtımı
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Personelleri geçmiş görev
          sayılarına göre görüntüleyip
          seçilen göreve atayabilirsiniz.
        </p>
      </div>

      {/* HATA */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* BAŞARI */}
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* DAĞITIM KRİTERLERİ */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">
          Dağıtım Kriterleri
        </h2>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {/* BİRİM */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Birim
            </label>

            <select
              value={birimId}
              disabled={
                authRol ===
                "BIRIM_YETKILISI"
              }
              onChange={(e) => {
                setBirimId(
                  e.target.value
                );

                setGorevler([]);
                setGorevTuruId("");
                setGorevId("");
                setDagitimSirasi([]);
                setSecilenPersonelIdleri(
                  []
                );
                setAtananPersonelIdleri(
                  []
                );
                setError("");
                setSuccess("");
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none disabled:bg-slate-100"
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

          {/* GÖREV TÜRÜ */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Görev Türü
            </label>

            <select
              value={gorevTuruId}
              disabled={!birimId}
              onChange={(e) => {
                setGorevTuruId(
                  e.target.value
                );

                setGorevId("");
                setDagitimSirasi([]);
                setSecilenPersonelIdleri(
                  []
                );
                setAtananPersonelIdleri(
                  []
                );
                setError("");
                setSuccess("");
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none disabled:bg-slate-100"
            >
              <option value="">
                Görev türü seçiniz
              </option>

              {gorevTurleri.map(
                (gorevTuru) => (
                  <option
                    key={gorevTuru.id}
                    value={gorevTuru.id}
                  >
                    {gorevTuru.ad}
                  </option>
                )
              )}
            </select>
          </div>

          {/* AKTİF GÖREV */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Aktif Görev
            </label>

            <select
              value={gorevId}
              disabled={
                !birimId ||
                !gorevTuruId ||
                gorevlerLoading
              }
              onChange={(e) => {
                setGorevId(
                  e.target.value
                );

                setDagitimSirasi([]);
                setSecilenPersonelIdleri(
                  []
                );
                setAtananPersonelIdleri(
                  []
                );
                setError("");
                setSuccess("");
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none disabled:bg-slate-100"
            >
              <option value="">
                {gorevlerLoading
                  ? "Görevler yükleniyor..."
                  : "Görev seçiniz"}
              </option>

              {uygunGorevler.map(
                (gorev) => (
                  <option
                    key={gorev.id}
                    value={gorev.id}
                  >
                    {gorev.tarih}
                    {" - "}
                    {gorev.aciklama ||
                      gorev.gorevTuru.ad}
                  </option>
                )
              )}
            </select>

            {birimId &&
              gorevTuruId &&
              !gorevlerLoading &&
              uygunGorevler.length ===
                0 && (
                <p className="mt-1.5 text-xs text-slate-500">
                  Bu birim ve görev türü
                  için aktif görev
                  bulunamadı.
                </p>
              )}
          </div>

          {/* DAĞITIM SIRASI */}
          <div className="flex items-end">
            <Button
              type="button"
              fullWidth
              loading={
                siralamayiGetiriyor
              }
              onClick={() =>
                void handleSiralamayiGetir()
              }
            >
              Dağıtım Sırasını Getir
            </Button>
          </div>

          {/* TEMİZLE */}
          <div className="flex items-end">
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={secimiTemizle}
            >
              Temizle
            </Button>
          </div>
        </div>
      </div>

      {/* DAĞITIM SONUCU */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              Önerilen Personel Sırası
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Görev sayısı daha az olan
              personel öncelikli gösterilir.
            </p>
          </div>

          {dagitimSirasi.length > 0 && (
            <div className="text-sm text-slate-600">
              Seçilen:{" "}
              <span className="font-semibold text-slate-900">
                {
                  secilenPersonelIdleri.length
                }
              </span>
            </div>
          )}
        </div>

        {dagitimSirasi.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Dağıtım sırasını görmek için
            birim, görev türü ve görev
            seçiniz.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                      Seç
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                      Sıra
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                      Sicil No
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                      Ad Soyad
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                      Görev Sayısı
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                      Durum
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 bg-white">
                  {dagitimSirasi.map(
                    (
                      personel,
                      index
                    ) => {
                      const zatenAtanmis =
                        atananPersonelIdleri.includes(
                          personel.personelId
                        );

                      const secili =
                        secilenPersonelIdleri.includes(
                          personel.personelId
                        );

                      return (
                        <tr
                          key={
                            personel.personelId
                          }
                          className={
                            zatenAtanmis
                              ? "bg-slate-50"
                              : "hover:bg-slate-50"
                          }
                        >
                          {/* CHECKBOX */}
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={
                                secili
                              }
                              disabled={
                                zatenAtanmis
                              }
                              onChange={() =>
                                handlePersonelSec(
                                  personel.personelId
                                )
                              }
                              className="h-4 w-4 cursor-pointer rounded border-slate-300 disabled:cursor-not-allowed"
                            />
                          </td>

                          {/* SIRA */}
                          <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                            {index + 1}
                          </td>

                          {/* SİCİL */}
                          <td className="px-6 py-4 text-sm text-slate-700">
                            {
                              personel.sicilNo
                            }
                          </td>

                          {/* AD SOYAD */}
                          <td className="px-6 py-4 text-sm font-medium text-slate-900">
                            {
                              personel.ad
                            }{" "}
                            {
                              personel.soyad
                            }
                          </td>

                          {/* GÖREV SAYISI */}
                          <td className="px-6 py-4 text-sm text-slate-700">
                            {
                              personel.gorevSayisi
                            }
                          </td>

                          {/* DURUM */}
                          <td className="px-6 py-4 text-sm">
                            {zatenAtanmis ? (
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                Zaten atandı
                              </span>
                            ) : secili ? (
                              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                                Seçildi
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400">
                                Atanabilir
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>

            {/* ATAMA BUTONU */}
            <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Öneri sırasını dikkate
                alarak görevlendirilecek
                personelleri seçiniz.
              </p>

              <Button
                type="button"
                loading={atamaYapiliyor}
                disabled={
                  secilenPersonelIdleri.length ===
                    0 ||
                  atamaYapiliyor
                }
                onClick={() =>
                  void handleGoreveAta()
                }
              >
                Seçilenleri Göreve Ata
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GorevDagitimPage;