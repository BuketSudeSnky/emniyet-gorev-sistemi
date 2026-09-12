package com.emniyet.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(
        name = "gorev_personel",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"gorev_id", "personel_id"})
        }
)
public class GorevPersonel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "gorev_id", nullable = false)
    private Gorev gorev;

    @ManyToOne
    @JoinColumn(name = "personel_id", nullable = false)
    private Personel personel;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Gorev getGorev() {
        return gorev;
    }

    public void setGorev(Gorev gorev) {
        this.gorev = gorev;
    }

    public Personel getPersonel() {
        return personel;
    }

    public void setPersonel(Personel personel) {
        this.personel = personel;
    }
}