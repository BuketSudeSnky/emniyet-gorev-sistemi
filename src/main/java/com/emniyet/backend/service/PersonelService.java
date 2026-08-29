package com.emniyet.backend.service;

import com.emniyet.backend.entity.Birim;
import com.emniyet.backend.entity.Personel;
import com.emniyet.backend.repository.BirimRepository;
import com.emniyet.backend.repository.PersonelRepository;
import org.springframework.stereotype.Service;
import com.emniyet.backend.enums.Cinsiyet;
import com.emniyet.backend.specification.PersonelSpecification;

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

    public List<Personel> tumPersonelleriGetir() {
        return personelRepository.findByAktifTrue();
    }

    public Personel personelEkle(Personel personel, Long birimId) {

        Birim birim = birimRepository.findById(birimId)
                .orElseThrow(() -> new RuntimeException("Birim bulunamadı"));

        personel.setBirim(birim);

        return personelRepository.save(personel);
    }

    public Personel personelGuncelle(
            Long id,
            Personel yeniPersonel,
            Long birimId) {

        Personel mevcutPersonel = personelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Personel bulunamadı"));

        Birim birim = birimRepository.findById(birimId)
                .orElseThrow(() -> new RuntimeException("Birim bulunamadı"));

        mevcutPersonel.setAd(yeniPersonel.getAd());
        mevcutPersonel.setSoyad(yeniPersonel.getSoyad());
        mevcutPersonel.setCinsiyet(yeniPersonel.getCinsiyet());
        mevcutPersonel.setTelefon(yeniPersonel.getTelefon());
        mevcutPersonel.setSicilNo(yeniPersonel.getSicilNo());
        mevcutPersonel.setAktif(yeniPersonel.getAktif());
        mevcutPersonel.setBirim(birim);

        return personelRepository.save(mevcutPersonel);
    }

    public Personel personelPasifeAl(Long id) {

        Personel mevcutPersonel = personelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Personel bulunamadı"));

        mevcutPersonel.setAktif(false);

        return personelRepository.save(mevcutPersonel);
    }

    public List<Personel> birimeGorePersonelleriGetir(Long birimId) {
        return personelRepository.findByBirimIdAndAktifTrue(birimId);
    }

    public List<Personel> adaGorePersonelAra(String ad) {
        return personelRepository
                .findByAdContainingIgnoreCaseAndAktifTrue(ad);
    }

    public List<Personel> soyadaGorePersonelAra(String soyad) {
        return personelRepository
                .findBySoyadContainingIgnoreCaseAndAktifTrue(soyad);
    }

    public List<Personel> cinsiyeteGorePersonelleriGetir(Cinsiyet cinsiyet) {
        return personelRepository.findByCinsiyetAndAktifTrue(cinsiyet);
    }

    public List<Personel> sicilNoIlePersonelAra(String sicilNo) {
        return personelRepository.findBySicilNoAndAktifTrue(sicilNo);
    }

    public List<Personel> personelFiltrele(
            String ad,
            String soyad,
            String sicilNo,
            Cinsiyet cinsiyet,
            Long birimId) {

        return personelRepository.findAll(
                PersonelSpecification.filtrele(
                        ad,
                        soyad,
                        sicilNo,
                        cinsiyet,
                        birimId
                )
        );
    }

}