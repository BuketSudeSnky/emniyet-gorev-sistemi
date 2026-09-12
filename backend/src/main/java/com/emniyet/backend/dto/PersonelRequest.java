package com.emniyet.backend.dto;

import com.emniyet.backend.enums.Cinsiyet;
import com.emniyet.backend.enums.KanGrubu;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class PersonelRequest {

    @NotBlank(message = "Ad boş bırakılamaz")
    @Size(max = 50, message = "Ad en fazla 50 karakter olabilir")
    private String ad;

    @NotBlank(message = "Soyad boş bırakılamaz")
    @Size(max = 50, message = "Soyad en fazla 50 karakter olabilir")
    private String soyad;

    @NotNull(message = "Cinsiyet seçilmelidir")
    private Cinsiyet cinsiyet;

    @NotBlank(message = "Sicil numarası boş bırakılamaz")
    @Size(max = 50, message = "Sicil numarası en fazla 50 karakter olabilir")
    private String sicilNo;

    @NotBlank(message = "Telefon numarası boş bırakılamaz")
    @Pattern(
            regexp = "^05[0-9]{9}$",
            message = "Telefon numarası 05 ile başlamalı ve 11 haneli olmalıdır"
    )
    private String telefon;

    @NotNull(message = "Kan grubu seçilmelidir")
    private KanGrubu kanGrubu;

    @NotBlank(message = "IBAN boş bırakılamaz")
    @Pattern(
            regexp = "^TR[0-9]{24}$",
            message = "IBAN TR ile başlamalı ve toplam 26 karakter olmalıdır"
    )
    private String iban;

    public String getAd() {
        return ad;
    }

    public void setAd(String ad) {
        this.ad = ad;
    }

    public String getSoyad() {
        return soyad;
    }

    public void setSoyad(String soyad) {
        this.soyad = soyad;
    }

    public Cinsiyet getCinsiyet() {
        return cinsiyet;
    }

    public void setCinsiyet(Cinsiyet cinsiyet) {
        this.cinsiyet = cinsiyet;
    }

    public String getSicilNo() {
        return sicilNo;
    }

    public void setSicilNo(String sicilNo) {
        this.sicilNo = sicilNo;
    }

    public String getTelefon() {
        return telefon;
    }

    public void setTelefon(String telefon) {
        this.telefon = telefon;
    }

    public KanGrubu getKanGrubu() {
        return kanGrubu;
    }

    public void setKanGrubu(KanGrubu kanGrubu) {
        this.kanGrubu = kanGrubu;
    }

    public String getIban() {
        return iban;
    }

    public void setIban(String iban) {
        this.iban = iban;
    }
}