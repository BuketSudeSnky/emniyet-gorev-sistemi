package com.emniyet.backend.repository;

import com.emniyet.backend.entity.Birim;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BirimRepository extends JpaRepository<Birim, Long> {

    List<Birim> findByAktifTrue();
}