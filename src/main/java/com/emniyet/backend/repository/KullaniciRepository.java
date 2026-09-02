package com.emniyet.backend.repository;

import com.emniyet.backend.entity.Kullanici;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface KullaniciRepository extends JpaRepository<Kullanici, Long> {

    Optional<Kullanici> findByKullaniciAdi(String kullaniciAdi);
}