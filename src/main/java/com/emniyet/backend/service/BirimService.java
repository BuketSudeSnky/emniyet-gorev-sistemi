package com.emniyet.backend.service;

import com.emniyet.backend.entity.Birim;
import com.emniyet.backend.exception.ResourceNotFoundException;
import com.emniyet.backend.repository.BirimRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BirimService {

    private final BirimRepository birimRepository;

    public BirimService(BirimRepository birimRepository) {
        this.birimRepository = birimRepository;
    }

    public List<Birim> tumBirimleriGetir() {
        return birimRepository.findByAktifTrue();
    }

    public Birim birimEkle(Birim birim) {
        return birimRepository.save(birim);
    }

    public Birim birimGuncelle(Long id, Birim yeniBirim) {

        Birim mevcutBirim = birimRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Birim bulunamadı"
                        ));

        mevcutBirim.setAd(yeniBirim.getAd());
        mevcutBirim.setAktif(yeniBirim.getAktif());

        return birimRepository.save(mevcutBirim);
    }

    public Birim birimPasifeAl(Long id) {

        Birim mevcutBirim = birimRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Birim bulunamadı"
                        ));

        mevcutBirim.setAktif(false);

        return birimRepository.save(mevcutBirim);
    }
}