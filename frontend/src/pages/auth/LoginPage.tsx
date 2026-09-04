import { useState } from "react";
import axios from "axios";

import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { login } from "../../api/auth";
import { saveAuth } from "../../utils/authStorage";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [sicilNo, setSicilNo] = useState("");
  const [sifre, setSifre] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await login({
  sicilNo,
  sifre,
});

saveAuth(response);

navigate("/", { replace: true });

    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Sicil numarası veya şifre hatalı."
        );
      } else {
        setError("Beklenmeyen bir hata oluştu.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md">

        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-xl font-bold text-white shadow-md">
            EGS
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Emniyet Görev Sistemi
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            İlçe Emniyet Müdürlüğü
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Yetkili Personel Girişi
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Sisteme erişmek için sicil numaranız ve şifrenizle giriş yapınız.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <Input
              id="sicilNo"
              name="sicilNo"
              label="Sicil Numarası"
              type="text"
              placeholder="Sicil numaranızı giriniz"
              value={sicilNo}
              onChange={(event) =>
                setSicilNo(event.target.value)
              }
              autoComplete="username"
              required
            />

            <Input
              id="sifre"
              name="sifre"
              label="Şifre"
              type="password"
              placeholder="Şifrenizi giriniz"
              value={sifre}
              onChange={(event) =>
                setSifre(event.target.value)
              }
              autoComplete="current-password"
              required
            />

            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              loading={loading}
            >
              Giriş Yap
            </Button>

          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Bu sistem yalnızca yetkili personelin kullanımına açıktır.
        </p>

      </div>
    </div>
  );
};

export default LoginPage;