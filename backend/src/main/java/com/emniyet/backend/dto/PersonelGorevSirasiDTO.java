package com.emniyet.backend.dto;

public class PersonelGorevSirasiDTO {

    private Long personelId;
    private String ad;
    private String soyad;
    private String sicilNo;
    private long gorevSayisi;

    public PersonelGorevSirasiDTO(
            Long personelId,
            String ad,
            String soyad,
            String sicilNo,
            long gorevSayisi) {

        this.personelId = personelId;
        this.ad = ad;
        this.soyad = soyad;
        this.sicilNo = sicilNo;
        this.gorevSayisi = gorevSayisi;
    }

    public Long getPersonelId() {
        return personelId;
    }

    public String getAd() {
        return ad;
    }

    public String getSoyad() {
        return soyad;
    }

    public String getSicilNo() {
        return sicilNo;
    }

    public long getGorevSayisi() {
        return gorevSayisi;
    }
}