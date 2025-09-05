// frontend/src/App.jsx

import { useState, useEffect } from "react";
import ReviewForm from "./components/ReviewForm";
import "./App.css";

function App() {
  // レビュー一覧を保存するためのstate
  const [reviews, setReviews] = useState([]);
  // どのレビューを編集中か管理するstate
  const [editingReview, setEditingReview] = useState(null);

  // 画面が最初に表示された時に一度だけAPIを叩く
  useEffect(() => {
    fetch("http://localhost:8080/api/reviews")
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // 取得したデータをブラウザのコンソールに表示
        setReviews(data); // stateにデータを保存
      })
      .catch((error) => console.error("データの取得に失敗しました:", error));
  }, []); // 第2引数の[]は「最初の一回だけ実行する」という意味

  // ReviewFormから新しいレビューを受け取るための関数
  const handleReviewAdded = (newReview) => {
    // 既存のレビューリスト(...)に新しいレビューを追加してstateを更新
    setReviews([...reviews, newReview]);
  };

  // レビュー削除用のAPIを呼び出す関数
  const handleDelete = (idToDelete) => {
    // APIにDELETEリクエストを送信
    fetch(`http://localhost:8080/api/reviews/${idToDelete}`, {
      method: "DELETE",
    })
      .then((response) => {
        // レスポンスが成功（例: 204 No Content）ならOK
        if (response.ok) {
          // 画面のstateからも削除する
          // idが一致しないものだけを残した新しい配列をセットする
          setReviews(reviews.filter((review) => review.id !== idToDelete));
        } else {
          // エラーハンドリング
          console.error("レビューの削除に失敗しました。");
        }
      })
      .catch((error) => console.error("通信エラー:", error));
  };

  // 編集ボタンが押された時の処理
  const handleEdit = (reviewToEdit) => {
    setEditingReview(reviewToEdit);
  };

  // 更新フォームが送信された時の処理
  const handleUpdate = (updatedReview) => {
    fetch(`http://localhost:8080/api/reviews/${updatedReview.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedReview),
    })
      .then((response) => response.json())
      .then((returnedReview) => {
        // レビューリストを更新
        setReviews(
          reviews.map((r) => (r.id === returnedReview.id ? returnedReview : r))
        );
        // 編集モードを解除
        setEditingReview(null);
      })
      .catch((error) => console.error("レビューの更新に失敗しました:", error));
  };

  return (
    <div>
      <h1>温泉レビューアプリ</h1>
      <ReviewForm
        key={editingReview ? editingReview.id : "new-review"}
        initialData={editingReview}
        onFormSubmit={editingReview ? handleUpdate : handleReviewAdded}
        onCancelEdit={() => setEditingReview(null)}
      />
      <hr />
      <ul>
        {reviews.map((review) => (
          <li key={review.id}>
            <h2>{review.name}</h2>
            <p>評価：{review.rating}</p>
            <p>{review.comment}</p>
            <small>訪問日：{review.visited_date}</small>
            <button onClick={() => handleEdit(review)}>編集</button>
            <button onClick={() => handleDelete(review.id)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
