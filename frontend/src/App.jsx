import { useState, useEffect } from "react";
import ReviewForm from "./components/ReviewForm";
import RadarChart from "./components/RadarChart"; // ★ 1. RadarChartコンポーネントをインポート
import "./App.css";

function App() {
  // 環境変数から API ベース URL を取得
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  // アプリケーションの主要な状態（state）を定義
  const [reviews, setReviews] = useState([]); // レビューのリスト
  const [editingReview, setEditingReview] = useState(null); // 現在編集中のレビューデータ
  const [isLoading, setIsLoading] = useState(true); // ローディング状態
  const [error, setError] = useState(null); // エラーメッセージ用

  // 副作用（API通信など）を扱うためのフック
  useEffect(() => {
    // GETリクエストで全てのレビューを取得するAPIを呼び出す
    fetch(`${API_BASE_URL}/reviews`)
      .then((response) => response.json())
      .then((data) => {
        setReviews(data); // 取得したデータでreviews stateを更新
      })
      .catch((error) => {
        console.error("データの取得に失敗しました:", error);
        setError(
          "サーバーとの通信に失敗しました。バックエンドが起動しているか確認してください。"
        );
      })
      .finally(() => {
        setIsLoading(false); // 通信が成功しても失敗しても、ローディングを終了する
      });
  }, []);

  // --- APIと連携する各種イベントハンドラ ---

  /**
   * 新規レビューが投稿されたときの処理
   */
  const handleReviewAdded = (reviewData) => {
    fetch(`${API_BASE_URL}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reviewData),
    })
      .then((response) => response.json())
      .then((addedReview) => {
        // 既存のレビューリストに、APIから返ってきた新しいレビューを追加してstateを更新
        setReviews([...reviews, addedReview]);
      })
      .catch((error) => console.error("レビューの投稿に失敗しました:", error));
  };

  /**
   * レビューが更新されたときの処理
   */
  const handleUpdate = (updatedReview) => {
    fetch(`${API_BASE_URL}/reviews/${updatedReview.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedReview),
    })
      .then((response) => response.json())
      .then((returnedReview) => {
        // reviewsリストの中から、更新されたレビューと同じIDのものを探し、新しいデータに差し替える
        setReviews(
          reviews.map((r) => (r.id === returnedReview.id ? returnedReview : r))
        );
        // 編集モードを解除する
        setEditingReview(null);
      })
      .catch((error) => console.error("レビューの更新に失敗しました:", error));
  };

  /**
   * レビューが削除されたときの処理
   */
  const handleDelete = (idToDelete) => {
    fetch(`${API_BASE_URL}/reviews/${idToDelete}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          // reviewsリストの中から、削除されたレビューID以外のものだけを残す
          setReviews(reviews.filter((review) => review.id !== idToDelete));
        } else {
          console.error("レビューの削除に失敗しました。");
        }
      })
      .catch((error) => console.error("通信エラー:", error));
  };

  /**
   * 「編集」ボタンが押されたときの処理
   */
  const handleEdit = (reviewToEdit) => {
    setEditingReview(reviewToEdit);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          温泉レビューアプリ
        </h1>

        <ReviewForm
          key={editingReview ? editingReview.id : "new"}
          initialData={editingReview}
          onFormSubmit={editingReview ? handleUpdate : handleReviewAdded}
          onCancelEdit={() => setEditingReview(null)}
        />

        <div>
          <h2 className="text-3xl font-bold text-gray-800 mt-12 mb-6">
            レビュー一覧
          </h2>

          {isLoading ? (
            <p className="text-center text-gray-500">読み込み中...</p>
          ) : error ? (
            <p className="text-center text-red-500 font-bold">{error}</p>
          ) : reviews.length === 0 ? (
            <p className="text-center text-gray-500">
              まだレビューがありません。最初のレビューを投稿してみましょう！
            </p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((review) => (
                <li
                  key={review.id}
                  className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {review.name}
                    </h3>
                    {review.image_url ? (
                      <img src={review.image_url} alt={review.name} className="w-full h-48 object-cover" />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">画像なし</span>
                      </div>
                    )}
                    {review.quality != null ? (
                      <div className="w-full h-64 mb-4">
                        <RadarChart reviewData={review} />
                      </div>
                    ) : (
                      <div className="w-full h-64 mb-4 flex items-center justify-center bg-gray-50 rounded">
                        <p className="text-gray-400">詳細評価はありません</p>
                      </div>
                    )}

                    <p className="text-gray-600 mb-4">{review.comment}</p>
                    <small className="text-gray-500">
                      訪問日：{review.visited_date}
                    </small>
                  </div>
                  <div className="mt-4 flex gap-x-2">
                    <button
                      onClick={() => handleEdit(review)}
                      className="bg-green-500 hover:bg-green-700 text-white text-sm font-bold py-1 px-3 rounded"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="bg-red-500 hover:bg-red-700 text-white text-sm font-bold py-1 px-3 rounded"
                    >
                      削除
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
