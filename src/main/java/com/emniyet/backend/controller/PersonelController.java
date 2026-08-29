package com.emniyet.backend.controller;

import com.emniyet.backend.entity.Personel;
import com.emniyet.backend.service.PersonelService;
import org.springframework.web.bind.annotation.*;
import com.emniyet.backend.enums.Cinsiyet;

import java.util.List;

@RestController
@RequestMapping("/api/personeller")
public class PersonelController {

    private final PersonelService personelService;

    public PersonelController(PersonelService personelService) {
        this.personelService = personelService;
    }

    @GetMapping
    public List<Personel> tumPersonelleriGetir() {
        return personelService.tumPersonelleriGetir();
    }

    @PostMapping
    public Personel personelEkle(
            @RequestBody Personel personel,
            @RequestParam Long birimId) {

        return personelService.personelEkle(personel, birimId);
    }

    @PutMapping("/{id}")
    public Personel personelGuncelle(
            @PathVariable Long id,
            @RequestBody Personel personel,
            @RequestParam Long birimId) {

        return personelService.personelGuncelle(id, personel, birimId);
    }

    @DeleteMapping("/{id}")
    public Personel personelPasifeAl(@PathVariable Long id) {
        return personelService.personelPasifeAl(id);
    }

    @GetMapping("/birim/{birimId}")
    public List<Personel> birimeGorePersonelleriGetir(
            @PathVariable Long birimId) {

        return personelService.birimeGorePersonelleriGetir(birimId);
    }

    @GetMapping("/ara/ad")
    public List<Personel> adaGorePersonelAra(
            @RequestParam String ad) {

        return personelService.adaGorePersonelAra(ad);
    }

    @GetMapping("/ara/soyad")
    public List<Personel> soyadaGorePersonelAra(
            @RequestParam String soyad) {

        return personelService.soyadaGorePersonelAra(soyad);
    }

    @GetMapping("/ara/cinsiyet")
    public List<Personel> cinsiyeteGorePersonelleriGetir(
            @RequestParam Cinsiyet cinsiyet) {

        return personelService.cinsiyeteGorePersonelleriGetir(cinsiyet);
    }

    @GetMapping("/ara/sicil")
    public List<Personel> sicilNoIlePersonelAra(
            @RequestParam String sicilNo) {

        return personelService.sicilNoIlePersonelAra(sicilNo);
    }

    @GetMapping("/filtrele")
    public List<Personel> personelFiltrele(
            @RequestParam(required = false) String ad,
            @RequestParam(required = false) String soyad,
            @RequestParam(required = false) String sicilNo,
            @RequestParam(required = false) Cinsiyet cinsiyet,
            @RequestParam(required = false) Long birimId) {

        return personelService.personelFiltrele(
                ad,
                soyad,
                sicilNo,
                cinsiyet,
                birimId
        );
    }
}