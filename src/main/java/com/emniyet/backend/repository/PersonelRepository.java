package com.emniyet.backend.repository;

import com.emniyet.backend.entity.Personel;
import org.springframework.data.jpa.repository.JpaRepository;
import com.emniyet.backend.enums.Cinsiyet;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface PersonelRepository extends
        JpaRepository<Personel, Long>,
        JpaSpecificationExecutor<Personel> {

    List<Personel> findByAktifTrue();

    List<Personel> findByBirimIdAndAktifTrue(Long birimId);

    List<Personel> findByAdContainingIgnoreCaseAndAktifTrue(String ad);

    List<Personel> findBySoyadContainingIgnoreCaseAndAktifTrue(String soyad);

    List<Personel> findByCinsiyetAndAktifTrue(Cinsiyet cinsiyet);

    List<Personel> findBySicilNoAndAktifTrue(String sicilNo);
}