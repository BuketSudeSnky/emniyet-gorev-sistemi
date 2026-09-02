package com.emniyet.backend.controller;

import com.emniyet.backend.entity.Kullanici;
import com.emniyet.backend.entity.Personel;
import com.emniyet.backend.enums.Cinsiyet;
import com.emniyet.backend.enums.Rol;
import com.emniyet.backend.service.KullaniciService;
import com.emniyet.backend.service.PersonelService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/personeller")
public class PersonelController {

    private final PersonelService personelService;
    private final KullaniciService kullaniciService;

    public PersonelController(
            PersonelService personelService,
            KullaniciService kullaniciService) {

        this.personelService = personelService;
        this.kullaniciService = kullaniciService;
    }

    @GetMapping
    public List<Personel> tumPersonelleriGetir(
            Authentication authentication) {

        Kullanici kullanici =
                kullaniciService.aktifKullaniciyiGetir(
                        authentication.getName()
                );

        if (kullanici.getRol() == Rol.ADMIN) {
            return personelService.tumPersonelleriGetir();
        }

        Long birimId = kullanici.getBirim().getId();

        return personelService
                .birimeGorePersonelleriGetir(birimId);
    }

    @PostMapping
    public Personel personelEkle(
            @RequestBody Personel personel,
            @RequestParam Long birimId,
            Authentication authentication) {

        Kullanici kullanici = aktifKullanici(authentication);

        birimYetkisiniKontrolEt(kullanici, birimId);

        return personelService.personelEkle(
                personel,
                birimId
        );
    }
    @PutMapping("/{id}")
    public Personel personelGuncelle(
            @PathVariable Long id,
            @RequestBody Personel personel,
            @RequestParam Long birimId,
            Authentication authentication) {

        Kullanici kullanici = aktifKullanici(authentication);

        Personel mevcutPersonel =
                personelService.idIlePersonelGetir(id);

        birimYetkisiniKontrolEt(
                kullanici,
                mevcutPersonel.getBirim().getId()
        );

        birimYetkisiniKontrolEt(
                kullanici,
                birimId
        );

        return personelService.personelGuncelle(
                id,
                personel,
                birimId
        );
    }

    @DeleteMapping("/{id}")
    public Personel personelPasifeAl(
            @PathVariable Long id,
            Authentication authentication) {

        Kullanici kullanici = aktifKullanici(authentication);

        Personel mevcutPersonel =
                personelService.idIlePersonelGetir(id);

        birimYetkisiniKontrolEt(
                kullanici,
                mevcutPersonel.getBirim().getId()
        );

        return personelService.personelPasifeAl(id);
    }

    @GetMapping("/birim/{birimId}")
    public List<Personel> birimeGorePersonelleriGetir(
            @PathVariable Long birimId,
            Authentication authentication) {

        Kullanici kullanici = aktifKullanici(authentication);

        birimYetkisiniKontrolEt(kullanici, birimId);

        return personelService
                .birimeGorePersonelleriGetir(birimId);
    }


    @GetMapping("/filtrele")
    public List<Personel> personelFiltrele(
            @RequestParam(required = false) String ad,
            @RequestParam(required = false) String soyad,
            @RequestParam(required = false) String sicilNo,
            @RequestParam(required = false) Cinsiyet cinsiyet,
            @RequestParam(required = false) Long birimId,
            Authentication authentication) {

        Kullanici kullanici = aktifKullanici(authentication);

        Long kullanilacakBirimId;

        if (kullanici.getRol() == Rol.ADMIN) {

            kullanilacakBirimId = birimId;

        } else {

            kullanilacakBirimId =
                    kullanici.getBirim().getId();
        }

        return personelService.personelFiltrele(
                ad,
                soyad,
                sicilNo,
                cinsiyet,
                kullanilacakBirimId
        );
    }

    private Kullanici aktifKullanici(Authentication authentication) {
        return kullaniciService.aktifKullaniciyiGetir(
                authentication.getName()
        );
    }

    private void birimYetkisiniKontrolEt(
            Kullanici kullanici,
            Long birimId) {

        if (kullanici.getRol() == Rol.ADMIN) {
            return;
        }

        if (kullanici.getBirim() == null ||
                !kullanici.getBirim().getId().equals(birimId)) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Bu birim üzerinde işlem yapma yetkiniz yok"
            );
        }
    }
}