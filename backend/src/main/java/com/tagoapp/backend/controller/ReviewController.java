package com.tagoapp.backend.controller;

import java.net.URL;
import java.util.List;
import java.util.stream.Collectors;

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

import com.azure.storage.blob.sas.BlobSasPermission;
import com.tagoapp.backend.entity.Review;
import com.tagoapp.backend.repository.ReviewRepository;
import com.tagoapp.backend.service.StorageService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://127.0.0.1:5173" })
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final StorageService storageService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Review createReview(@RequestBody Review review) {
        return reviewRepository.save(review);
    }

    @GetMapping
    public List<Review> getAllReviews() {
        List<Review> reviews = reviewRepository.findAll();

        // 各レビューの画像URLにSASトークンを付与する
        return reviews.stream().map(review -> {
            if (review.getImageUrl() != null && !review.getImageUrl().isEmpty()) {
                try {
                    // URLからファイル名（Blob名）を抽出
                    URL url = new URL(review.getImageUrl());
                    String path = url.getPath();
                    String blobName = path.substring(path.lastIndexOf('/') + 1);

                    // 読み取り専用(r)のSASトークンを生成（有効期限1時間）
                    BlobSasPermission permission = new BlobSasPermission().setReadPermission(true);
                    String sasToken = storageService.generateSasToken(blobName, permission, 60);

                    // 元のURLにSASトークンを結合
                    review.setImageUrl(review.getImageUrl() + "?" + sasToken);

                } catch (Exception e) {
                    // URLのパースに失敗した場合は、URLをそのままにするか、エラーとして扱う
                    e.printStackTrace();
                }
            }
            return review;
        }).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public Review getReviewById(@PathVariable Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found with id: " + id));
    }

    // ★★★ UPDATED METHOD ★★★
    @PutMapping("/{id}")
    public Review updateReview(@PathVariable Long id, @RequestBody Review updatedReviewDetails) {
        return reviewRepository.findById(id)
                .map(existingReview -> {
                    // 基本情報
                    existingReview.setName(updatedReviewDetails.getName());
                    existingReview.setRating(updatedReviewDetails.getRating());
                    existingReview.setComment(updatedReviewDetails.getComment());
                    existingReview.setVisitedDate(updatedReviewDetails.getVisitedDate());

                    // 詳細評価
                    existingReview.setQuality(updatedReviewDetails.getQuality());
                    existingReview.setScenery(updatedReviewDetails.getScenery());
                    existingReview.setCleanliness(updatedReviewDetails.getCleanliness());
                    existingReview.setService(updatedReviewDetails.getService());
                    existingReview.setMeal(updatedReviewDetails.getMeal());

                    // 画像URL
                    existingReview.setImageUrl(updatedReviewDetails.getImageUrl());

                    return reviewRepository.save(existingReview);
                })
                .orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found with id: " + id));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReview(@PathVariable Long id) {
        if (!reviewRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found with id: " + id);
        }
        reviewRepository.deleteById(id);
    }
}
