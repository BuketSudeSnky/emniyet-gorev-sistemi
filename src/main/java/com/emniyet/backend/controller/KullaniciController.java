package com.emniyet.backend.controller;

import com.emniyet.backend.dto.KullaniciOlusturRequest;
import com.emniyet.backend.dto.KullaniciGuncelleRequest;
import com.emniyet.backend.dto.KullaniciSifreGuncelleRequest;
import org.springframework.security.core.Authentication;
import com.emniyet.backend.dto.KullaniciResponse;
import com.emniyet.backend.entity.Kullanici;
import com.emniyet.backend.service.KullaniciService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/kullanicilar")
public class KullaniciController {

    private final KullaniciService kullaniciService;

    public KullaniciController(KullaniciService kullaniciService) {
        this.kullaniciService = kullaniciService;
    }

    @PostMapping
    public KullaniciResponse kullaniciOlustur(
            @Valid @RequestBody KullaniciOlusturRequest request) {

        Kullanici kullanici = new Kullanici();

        kullanici.setSicilNo(request.getSicilNo());
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
                kaydedilen.getSicilNo(),
                kaydedilen.getRol(),
                kaydedilen.getAktif(),
                birimId,
                birimAdi
        );
    }
    @GetMapping
    public List<KullaniciResponse> tumKullanicilariGetir() {

        return kullaniciService
                .tumKullanicilariGetir()
                .stream()
                .map(kullanici -> {

                    Long birimId = null;
                    String birimAdi = null;

                    if (kullanici.getBirim() != null) {
                        birimId = kullanici.getBirim().getId();
                        birimAdi = kullanici.getBirim().getAd();
                    }

                    return new KullaniciResponse(
                            kullanici.getId(),
                            kullanici.getSicilNo(),
                            kullanici.getRol(),
                            kullanici.getAktif(),
                            birimId,
                            birimAdi
                    );
                })
                .toList();
    }
    @PutMapping("/{id}")
    public KullaniciResponse kullaniciGuncelle(
            @PathVariable Long id,
            @Valid @RequestBody KullaniciGuncelleRequest request) {

        Kullanici guncellenen = kullaniciService.kullaniciGuncelle(
                id,
                request.getSicilNo(),
                request.getRol(),
                request.getBirimId()
        );

        Long birimId = null;
        String birimAdi = null;

        if (guncellenen.getBirim() != null) {
            birimId = guncellenen.getBirim().getId();
            birimAdi = guncellenen.getBirim().getAd();
        }

        return new KullaniciResponse(
                guncellenen.getId(),
                guncellenen.getSicilNo(),
                guncellenen.getRol(),
                guncellenen.getAktif(),
                birimId,
                birimAdi
        );
    }
    @PatchMapping("/{id}/pasife-al")
    public KullaniciResponse kullaniciPasifeAl(
            @PathVariable Long id,
            Authentication authentication) {

        Kullanici kullanici = kullaniciService.kullaniciPasifeAl(
                id,
                authentication.getName()
        );

        Long birimId = null;
        String birimAdi = null;

        if (kullanici.getBirim() != null) {
            birimId = kullanici.getBirim().getId();
            birimAdi = kullanici.getBirim().getAd();
        }

        return new KullaniciResponse(
                kullanici.getId(),
                kullanici.getSicilNo(),
                kullanici.getRol(),
                kullanici.getAktif(),
                birimId,
                birimAdi
        );
    }
    @PatchMapping("/{id}/aktife-al")
    public KullaniciResponse kullaniciAktifeAl(@PathVariable Long id) {

        Kullanici kullanici = kullaniciService.kullaniciAktifeAl(id);

        Long birimId = null;
        String birimAdi = null;

        if (kullanici.getBirim() != null) {
            birimId = kullanici.getBirim().getId();
            birimAdi = kullanici.getBirim().getAd();
        }

        return new KullaniciResponse(
                kullanici.getId(),
                kullanici.getSicilNo(),
                kullanici.getRol(),
                kullanici.getAktif(),
                birimId,
                birimAdi
        );
    }
    @PatchMapping("/{id}/sifre")
    public void kullaniciSifreGuncelle(
            @PathVariable Long id,
            @Valid @RequestBody KullaniciSifreGuncelleRequest request) {

        kullaniciService.kullaniciSifreGuncelle(
                id,
                request.getYeniSifre()
        );
    }
}