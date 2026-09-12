package com.emniyet.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class KullaniciSifreGuncelleRequest {

    @NotBlank(message = "Yeni şifre boş bırakılamaz")
    @Size(
            min = 8,
            max = 100,
            message = "Şifre en az 8 karakter olmalıdır"
    )
    private String yeniSifre;

    public String getYeniSifre() {
        return yeniSifre;
    }

    public void setYeniSifre(String yeniSifre) {
        this.yeniSifre = yeniSifre;
    }
}