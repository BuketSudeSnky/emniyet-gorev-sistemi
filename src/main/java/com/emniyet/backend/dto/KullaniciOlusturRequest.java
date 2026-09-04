package com.emniyet.backend.dto;

import com.emniyet.backend.enums.Rol;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class KullaniciOlusturRequest {

    @NotBlank(message = "Sicil numarası boş bırakılamaz")
    @Size(
            min = 3,
            max = 50,
            message = "Sicil numarası 3 ile 50 karakter arasında olmalıdır"
    )
    private String sicilNo;

    @NotBlank(message = "Şifre boş bırakılamaz")
    @Size(
            min = 8,
            max = 100,
            message = "Şifre en az 8 karakter olmalıdır"
    )
    private String sifre;

    @NotNull(message = "Rol seçilmelidir")
    private Rol rol;

    private Long birimId;

    public String getSicilNo() {
        return sicilNo;
    }

    public void setSicilNo(String sicilNo) {
        this.sicilNo = sicilNo;
    }

    public String getSifre() {
        return sifre;
    }

    public void setSifre(String sifre) {
        this.sifre = sifre;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

    public Long getBirimId() {
        return birimId;
    }

    public void setBirimId(Long birimId) {
        this.birimId = birimId;
    }
}