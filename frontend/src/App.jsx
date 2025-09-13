import { useState } from "react";
import ReviewForm from "./components/ReviewForm.jsx";
import ReviewList from "./components/ReviewList.jsx";
import { useReviews } from "./hooks/useReviews.js";
import "./index.css";

function App() {
  // レビューに関する状態とロジックはカスタムフックから取得
  const { reviews, isLoading, error, addReview, updateReview, deleteReview } = useReviews();
  
  // フォームの編集状態はAppコンポーネントで管理
  const [editingReview, setEditingReview] = useState(null);

  /**
   * フォームの送信処理
   * @param {object} reviewData - フォームから受け取ったデータ
   * @param {File | null} imageFile - フォームから受け取った画像ファイル
   */
  const handleFormSubmit = (reviewData, imageFile) => {
    if (editingReview) {
      // 更新処理
      updateReview({ ...editingReview, ...reviewData }, imageFile);
      setEditingReview(null); // 編集モードを解除
    } else {
      // 新規追加処理
      addReview(reviewData, imageFile);
    }
  };

  /**
   * 編集ボタンが押されたときの処理
   */
  const handleEdit = (reviewToEdit) => {
    setEditingReview(reviewToEdit);
    window.scrollTo(0, 0); // ページ上部のフォームにスクロール
  };
  
  /**
   * 編集キャンセル時の処理
   */
  const handleCancelEdit = () => {
    setEditingReview(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          温泉レビューアプリ
        </h1>

        <ReviewForm
          // keyを渡すことで、編集対象が切り替わったときにフォームを再マウントさせる
          key={editingReview ? editingReview.id : "new"}
          initialData={editingReview}
          onFormSubmit={handleFormSubmit}
          onCancelEdit={handleCancelEdit}
        />

        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            レビュー一覧
          </h2>
          <ReviewList
            isLoading={isLoading}
            error={error}
            reviews={reviews}
            onEdit={handleEdit}
            onDelete={deleteReview} // フックから取得したdeleteReviewを直接渡す
          />
        </div>
      </div>
    </div>
  );
}

export default App;

