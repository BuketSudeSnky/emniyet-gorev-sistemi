package com.emniyet.backend.repository;

import com.emniyet.backend.entity.GorevPersonel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GorevPersonelRepository
        extends JpaRepository<GorevPersonel, Long> {

    List<GorevPersonel> findByGorevId(Long gorevId);

    List<GorevPersonel> findByPersonelId(Long personelId);

    boolean existsByGorevIdAndPersonelId(Long gorevId, Long personelId);

    @Query("""
       SELECT COUNT(gp)
       FROM GorevPersonel gp
       WHERE gp.personel.id = :personelId
         AND gp.gorev.gorevTuru.id = :gorevTuruId
       """)
    long countByPersonelAndGorevTuru(
            @Param("personelId") Long personelId,
            @Param("gorevTuruId") Long gorevTuruId
    );
}