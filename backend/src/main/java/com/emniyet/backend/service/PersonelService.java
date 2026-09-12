package com.emniyet.backend.service;

import com.emniyet.backend.entity.Birim;
import com.emniyet.backend.entity.Personel;
import com.emniyet.backend.enums.Cinsiyet;
import com.emniyet.backend.enums.KanGrubu;
import com.emniyet.backend.exception.ResourceNotFoundException;
import com.emniyet.backend.repository.BirimRepository;
import com.emniyet.backend.repository.PersonelRepository;
import com.emniyet.backend.specification.PersonelSpecification;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class PersonelService {

    private final PersonelRepository personelRepository;
    private final BirimRepository birimRepository;

    public PersonelService(
            PersonelRepository personelRepository,
            BirimRepository birimRepository) {

        this.personelRepository = personelRepository;
        this.birimRepository = birimRepository;
    }

    // Aktif personelleri getir
    public List<Personel> tumPersonelleriGetir() {
        return personelRepository.findByAktifTrue();
    }

    // Personel ekle
    public Personel personelEkle(
            Personel personel,
            Long birimId) {

        Birim birim = birimRepository.findById(birimId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Birim bulunamadı"
                        ));

        if (!Boolean.TRUE.equals(birim.getAktif())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Pasif birime personel eklenemez"
            );
        }

        personel.setBirim(birim);
        personel.setAktif(true);

        return personelRepository.save(personel);
    }

    // Personel güncelle
    public Personel personelGuncelle(
            Long id,
            Personel yeniPersonel,
            Long birimId) {

        Personel mevcutPersonel =
                personelRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Personel bulunamadı"
                                ));

        Birim birim = birimRepository.findById(birimId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Birim bulunamadı"
                        ));

        if (!Boolean.TRUE.equals(birim.getAktif())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Personel pasif birime atanamaz"
            );
        }

        mevcutPersonel.setAd(yeniPersonel.getAd());
        mevcutPersonel.setSoyad(yeniPersonel.getSoyad());
        mevcutPersonel.setCinsiyet(yeniPersonel.getCinsiyet());
        mevcutPersonel.setTelefon(yeniPersonel.getTelefon());
        mevcutPersonel.setSicilNo(yeniPersonel.getSicilNo());
        mevcutPersonel.setKanGrubu(yeniPersonel.getKanGrubu());
        mevcutPersonel.setIban(yeniPersonel.getIban());
        mevcutPersonel.setBirim(birim);

        return personelRepository.save(mevcutPersonel);
    }

    // Personeli pasife al
    public Personel personelPasifeAl(Long id) {

        Personel mevcutPersonel =
                personelRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Personel bulunamadı"
                                ));

        mevcutPersonel.setAktif(false);

        return personelRepository.save(mevcutPersonel);
    }

    // Birime göre aktif personelleri getir
    public List<Personel> birimeGorePersonelleriGetir(
            Long birimId) {

        return personelRepository
                .findByBirimIdAndAktifTrue(birimId);
    }

    // Ada göre aktif personel ara
    public List<Personel> adaGorePersonelAra(
            String ad) {

        return personelRepository
                .findByAdContainingIgnoreCaseAndAktifTrue(ad);
    }

    // Soyada göre aktif personel ara
    public List<Personel> soyadaGorePersonelAra(
            String soyad) {

        return personelRepository
                .findBySoyadContainingIgnoreCaseAndAktifTrue(soyad);
    }

    // Cinsiyete göre aktif personelleri getir
    public List<Personel> cinsiyeteGorePersonelleriGetir(
            Cinsiyet cinsiyet) {

        return personelRepository
                .findByCinsiyetAndAktifTrue(cinsiyet);
    }

    // Sicil numarasına göre aktif personel ara
    public List<Personel> sicilNoIlePersonelAra(
            String sicilNo) {

        return personelRepository
                .findBySicilNoAndAktifTrue(sicilNo);
    }

    // Gelişmiş personel filtreleme
    public List<Personel> personelFiltrele(
            String ad,
            String soyad,
            String sicilNo,
            String telefon,
            Cinsiyet cinsiyet,
            KanGrubu kanGrubu,
            Long birimId,
            Boolean aktif) {

        return personelRepository.findAll(
                PersonelSpecification.filtrele(
                        ad,
                        soyad,
                        sicilNo,
                        telefon,
                        cinsiyet,
                        kanGrubu,
                        birimId,
                        aktif
                )
        );
    }

    // ID ile personel getir
    public Personel idIlePersonelGetir(
            Long id) {

        return personelRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Personel bulunamadı"
                        ));
    }
}