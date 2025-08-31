// frontend/src/components/ReviewForm.jsx

import { useState } from 'react';

function ReviewForm() {
  const [name, setName] = useState('');
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');
  const [visitedDate, setVisitedDate] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); // フォームのデフォルト送信機能をキャンセル
    // ここにAPIへデータを送信する処理を後で書きます
    alert('フォームが送信されました！');
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