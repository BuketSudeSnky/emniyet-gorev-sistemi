package com.emniyet.backend.repository;

import com.emniyet.backend.entity.Gorev;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface GorevRepository extends JpaRepository<Gorev, Long> {

    // Tüm aktif görevler
    List<Gorev> findByAktifTrue();

    // Birime göre aktif görevler
    List<Gorev> findByBirimIdAndAktifTrue(Long birimId);

    // Tarihe göre aktif görevler
    List<Gorev> findByTarihAndAktifTrue(LocalDate tarih);

    // Görev türüne göre aktif görevler
    List<Gorev> findByGorevTuruIdAndAktifTrue(Long gorevTuruId);

    // Birim + tarih
    List<Gorev> findByBirimIdAndTarihAndAktifTrue(
            Long birimId,
            LocalDate tarih
    );

    // Birim + görev türü
    List<Gorev> findByBirimIdAndGorevTuruIdAndAktifTrue(
            Long birimId,
            Long gorevTuruId
    );
}