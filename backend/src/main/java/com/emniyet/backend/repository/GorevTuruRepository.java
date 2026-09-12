package com.emniyet.backend.repository;

import com.emniyet.backend.entity.GorevTuru;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GorevTuruRepository
        extends JpaRepository<GorevTuru, Long> {

    List<GorevTuru> findByAktifTrue();
}