// frontend/src/components/ReviewForm.jsx

import { useState, useEffect } from "react";

// propsを受け取るように変更
function ReviewForm({ initialData, onFormSubmit, onCancelEdit }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [visitedDate, setVisitedDate] = useState("");

  // ★★ initialDataが変わったらフォームの中身を更新する処理を追加 ★★
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setRating(initialData.rating);
      setComment(initialData.comment || "");
      setVisitedDate(initialData.visited_date || "");
    } else {
      // 編集が終わったらフォームをクリアする
      setName("");
      setRating("");
      setComment("");
      setVisitedDate("");
    }
  }, [initialData]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const reviewData = {
      id: initialData ? initialData.id : undefined,
      name: name,
      rating: rating,
      comment: comment,
      visited_date: visitedDate || null,
    };
    onFormSubmit(reviewData);

    // APIにPOSTリクエストを送信
    fetch("http://localhost:8080/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newReview),
    })
      .then((response) => response.json())
      .then((addedReview) => {
        // 親コンポーネントに新しいレビューを通知
        onReviewAdded(addedReview);

        // 送信後、フォームをクリアする
        setName("");
        setRating("");
        setComment("");
        setVisitedDate("");
      })
      .catch((error) => console.error("レビューの投稿に失敗しました:", error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>新しいレビューを投稿</h2>
      <div>
        <label>場所の名前：</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label>評価：</label>
        <input
          type="number"
          step="0.5"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
        />
      </div>
      <div>
        <label>コメント：</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <div>
        <label>訪問日：</label>
        <input
          type="date"
          value={visitedDate}
          onChange={(e) => setVisitedDate(e.target.value)}
        />
      </div>
      <button type="submit">登録</button>
    </form>
  );
}

export default ReviewForm;
