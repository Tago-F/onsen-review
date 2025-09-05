package com.tagoapp.backend.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, precision = 2, scale = 1)
    private BigDecimal rating;

    @Column
    private String comment;

    @Column(name = "visited_date")
    private LocalDate visitedDate;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @Column(precision = 2, scale = 1)
    private BigDecimal quality; // お湯の質

    @Column(precision = 2, scale = 1)
    private BigDecimal scenery; // 景色

    @Column(precision = 2, scale = 1)
    private BigDecimal cleanliness; // 清潔さ

    @Column(precision = 2, scale = 1)
    private BigDecimal service; // サービス

    @Column(precision = 2, scale = 1)
    private BigDecimal meal; // 食事
}