import { useState, useEffect, useCallback } from "react";
import * as api from "../services/apiService";

/**
 * レビューデータの取得、追加、更新、削除のロジックを管理するカスタムフック
 */
export const useReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // レビューデータを取得する関数
  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getReviews();
      setReviews(data);
    } catch (err) {
      setError("サーバーとの通信に失敗しました。バックエンドが起動しているか確認してください。");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 初期表示時にレビューデータを取得
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  /**
   * 新しいレビューを追加する
   * @param {object} reviewData - フォームから受け取ったレビューデータ
   * @param {File | null} imageFile - アップロードする画像ファイル
   */
  const addReview = async (reviewData, imageFile) => {
    try {
      const imageUrl = await api.uploadImage(imageFile);
      const newReviewData = { ...reviewData, image_url: imageUrl };
      const addedReview = await api.createReview(newReviewData);
      setReviews((prevReviews) => [...prevReviews, addedReview]);
    } catch (err) {
      console.error("レビューの投稿に失敗しました:", err);
      // ここでUIにエラーを表示するなどの処理も可能
    }
  };

  /**
   * 既存のレビューを更新する
   * @param {object} reviewData - フォームから受け取った更新データ
   * @param {File | null} imageFile - 新しくアップロードする画像ファイル
   */
  const updateReview = async (reviewData, imageFile) => {
    try {
        let imageUrl = reviewData.image_url; // 既存の画像URLを維持
        if (imageFile) {
          imageUrl = await api.uploadImage(imageFile); // 新しい画像があればアップロード
        }
        const updatedData = { ...reviewData, image_url: imageUrl };
        const returnedReview = await api.updateReview(updatedData.id, updatedData);
        setReviews((prevReviews) =>
            prevReviews.map((r) => (r.id === returnedReview.id ? returnedReview : r))
        );
    } catch (err) {
        console.error("レビューの更新に失敗しました:", err);
    }
  };


  /**
   * レビューを削除する
   * @param {number} idToDelete - 削除するレビューのID
   */
  const deleteReview = async (idToDelete) => {
    try {
      await api.deleteReview(idToDelete);
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review.id !== idToDelete)
      );
    } catch (err) {
      console.error("レビューの削除に失敗しました:", err);
    }
  };

  return { reviews, isLoading, error, addReview, updateReview, deleteReview };
};
