package com.tagoapp.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tagoapp.backend.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}