package com.emniyet.backend.controller;

import com.emniyet.backend.dto.PersonelGorevSirasiDTO;
import com.emniyet.backend.entity.Gorev;
import com.emniyet.backend.entity.GorevPersonel;
import com.emniyet.backend.entity.Kullanici;
import com.emniyet.backend.entity.Personel;
import com.emniyet.backend.enums.Rol;
import com.emniyet.backend.service.GorevPersonelService;
import com.emniyet.backend.service.GorevService;
import com.emniyet.backend.service.KullaniciService;
import com.emniyet.backend.service.PersonelService;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/gorev-personel")
public class GorevPersonelController {

    private final GorevPersonelService gorevPersonelService;
    private final GorevService gorevService;
    private final PersonelService personelService;
    private final KullaniciService kullaniciService;

    public GorevPersonelController(
            GorevPersonelService gorevPersonelService,
            GorevService gorevService,
            PersonelService personelService,
            KullaniciService kullaniciService) {

        this.gorevPersonelService = gorevPersonelService;
        this.gorevService = gorevService;
        this.personelService = personelService;
        this.kullaniciService = kullaniciService;
    }

    @PostMapping("/ata/{gorevId}")
    public List<GorevPersonel> personelleriGoreveAta(
            @PathVariable Long gorevId,
            @RequestBody List<Long> personelIdleri,
            Authentication authentication) {

        Kullanici kullanici = aktifKullanici(authentication);

        Gorev gorev =
                gorevService.idIleGorevGetir(gorevId);

        birimYetkisiniKontrolEt(
                kullanici,
                gorev.getBirim().getId()
        );

        return gorevPersonelService
                .personelleriGoreveAta(
                        gorevId,
                        personelIdleri
                );
    }

    @GetMapping("/gorev/{gorevId}")
    public List<GorevPersonel> goreveAtananPersonelleriGetir(
            @PathVariable Long gorevId,
            Authentication authentication) {

        Kullanici kullanici = aktifKullanici(authentication);

        Gorev gorev =
                gorevService.idIleGorevGetir(gorevId);

        birimYetkisiniKontrolEt(
                kullanici,
                gorev.getBirim().getId()
        );

        return gorevPersonelService
                .goreveAtananPersonelleriGetir(gorevId);
    }

    @GetMapping("/personel/{personelId}")
    public List<GorevPersonel> personelinGorevGecmisiniGetir(
            @PathVariable Long personelId,
            Authentication authentication) {

        Kullanici kullanici = aktifKullanici(authentication);

        Personel personel =
                personelService.idIlePersonelGetir(personelId);

        birimYetkisiniKontrolEt(
                kullanici,
                personel.getBirim().getId()
        );

        return gorevPersonelService
                .personelinGorevGecmisiniGetir(personelId);
    }

    @GetMapping("/dagitim-sirasi")
    public List<PersonelGorevSirasiDTO> gorevDagitimSirasiGetir(
            @RequestParam(required = false) Long birimId,
            @RequestParam Long gorevTuruId,
            Authentication authentication) {

        Kullanici kullanici = aktifKullanici(authentication);

        Long kullanilacakBirimId;

        if (kullanici.getRol() == Rol.ADMIN) {

            if (birimId == null) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Admin için birimId belirtilmelidir"
                );
            }

            kullanilacakBirimId = birimId;

        } else {

            kullanilacakBirimId =
                    kullanici.getBirim().getId();
        }

        return gorevPersonelService
                .gorevDagitimSirasiGetir(
                        kullanilacakBirimId,
                        gorevTuruId
                );
    }

    private Kullanici aktifKullanici(
            Authentication authentication) {

        return kullaniciService
                .aktifKullaniciyiGetir(
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
                !kullanici.getBirim()
                        .getId()
                        .equals(birimId)) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Bu birim üzerinde işlem yapma yetkiniz yok"
            );
        }
    }
}