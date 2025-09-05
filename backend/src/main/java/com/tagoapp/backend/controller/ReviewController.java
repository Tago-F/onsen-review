package com.tagoapp.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.tagoapp.backend.entity.Review;
import com.tagoapp.backend.repository.ReviewRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://127.0.0.1:5173" })
public class ReviewController {

    private final ReviewRepository reviewRepository;

    // Create a new review
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Review createReview(@RequestBody Review review) {
        return reviewRepository.save(review);
    }

    // Get all reviews
    @GetMapping
    public List<Review> getAllReviews() {
        // TODO : 遅延時間テスト用、本番では削除。
        try {
            // レスポンスを2秒間（2000ミリ秒）意図的に遅延させる
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            // スレッドの割り込み例外が発生した場合の処理
            e.printStackTrace();
        }
        return reviewRepository.findAll();
    }

    // Get a single review by ID
    @GetMapping("/{id}")
    public Review getReviewById(@PathVariable Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found with id: " + id));
    }

    // Update an existing review
    @PutMapping("/{id}")
    public Review updateReview(@PathVariable Long id, @RequestBody Review updatedReview) {
        return reviewRepository.findById(id)
                .map(review -> {
                    review.setName(updatedReview.getName());
                    review.setRating(updatedReview.getRating());
                    review.setComment(updatedReview.getComment());
                    review.setVisitedDate(updatedReview.getVisitedDate());
                    return reviewRepository.save(review);
                })
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found with id: " + id));
    }

    // Delete a review
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReview(@PathVariable Long id) {
        if (!reviewRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found with id: " + id);
        }
        reviewRepository.deleteById(id);
    }
}