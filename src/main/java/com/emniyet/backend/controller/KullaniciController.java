package com.emniyet.backend.controller;

import com.emniyet.backend.dto.KullaniciOlusturRequest;
import com.emniyet.backend.dto.KullaniciResponse;
import com.emniyet.backend.entity.Kullanici;
import com.emniyet.backend.service.KullaniciService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/kullanicilar")
public class KullaniciController {

    private final KullaniciService kullaniciService;

    public KullaniciController(KullaniciService kullaniciService) {
        this.kullaniciService = kullaniciService;
    }

    @PostMapping
    public KullaniciResponse kullaniciOlustur(
            @RequestBody KullaniciOlusturRequest request) {

        Kullanici kullanici = new Kullanici();

        kullanici.setKullaniciAdi(request.getKullaniciAdi());
        kullanici.setSifre(request.getSifre());
        kullanici.setRol(request.getRol());
        kullanici.setAktif(true);

        Kullanici kaydedilen = kullaniciService.kullaniciOlustur(
                kullanici,
                request.getBirimId()
        );

        Long birimId = null;
        String birimAdi = null;

        if (kaydedilen.getBirim() != null) {
            birimId = kaydedilen.getBirim().getId();
            birimAdi = kaydedilen.getBirim().getAd();
        }

        return new KullaniciResponse(
                kaydedilen.getId(),
                kaydedilen.getKullaniciAdi(),
                kaydedilen.getRol(),
                kaydedilen.getAktif(),
                birimId,
                birimAdi
        );
    }
}