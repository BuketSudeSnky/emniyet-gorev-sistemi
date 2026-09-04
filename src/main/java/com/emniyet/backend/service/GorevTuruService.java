package com.emniyet.backend.service;

import com.emniyet.backend.entity.Birim;
import com.emniyet.backend.entity.GorevTuru;
import com.emniyet.backend.exception.ResourceNotFoundException;
import com.emniyet.backend.repository.BirimRepository;
import com.emniyet.backend.repository.GorevTuruRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GorevTuruService {

    private final GorevTuruRepository gorevTuruRepository;

    public GorevTuruService(
            GorevTuruRepository gorevTuruRepository) {

        this.gorevTuruRepository = gorevTuruRepository;
    }

    public List<GorevTuru> tumGorevTurleriniGetir() {

        return gorevTuruRepository.findByAktifTrue();
    }

    public GorevTuru gorevTuruEkle(
            GorevTuru gorevTuru) {

        // Yeni görev türü her zaman aktif oluşturulur
        gorevTuru.setAktif(true);

        return gorevTuruRepository.save(gorevTuru);
    }

    public GorevTuru gorevTuruGuncelle(
            Long id,
            GorevTuru yeniGorevTuru) {

        GorevTuru mevcutGorevTuru =
                gorevTuruRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Görev türü bulunamadı"
                                ));

        mevcutGorevTuru.setAd(
                yeniGorevTuru.getAd()
        );

        mevcutGorevTuru.setAciklama(
                yeniGorevTuru.getAciklama()
        );

        // aktif alanını burada değiştirmiyoruz

        return gorevTuruRepository.save(
                mevcutGorevTuru
        );
    }

    public GorevTuru gorevTuruPasifeAl(Long id) {

        GorevTuru mevcutGorevTuru =
                gorevTuruRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Görev türü bulunamadı"
                                ));

        mevcutGorevTuru.setAktif(false);

        return gorevTuruRepository.save(
                mevcutGorevTuru
        );
    }

    @Service
    public static class BirimService {

        private final BirimRepository birimRepository;

        public BirimService(BirimRepository birimRepository) {
            this.birimRepository = birimRepository;
        }

        public List<Birim> tumBirimleriGetir() {
            return birimRepository.findByAktifTrue();
        }

        public Birim birimEkle(Birim birim) {

            birim.setAktif(true);

            return birimRepository.save(birim);
        }

        public Birim birimGuncelle(
                Long id,
                Birim yeniBirim) {

            Birim mevcutBirim =
                    birimRepository.findById(id)
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Birim bulunamadı"
                                    ));

            mevcutBirim.setAd(yeniBirim.getAd());

            return birimRepository.save(mevcutBirim);
        }

        public Birim birimPasifeAl(Long id) {

            Birim mevcutBirim =
                    birimRepository.findById(id)
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Birim bulunamadı"
                                    ));

            mevcutBirim.setAktif(false);

            return birimRepository.save(mevcutBirim);
        }
    }
}