// frontend/src/App.jsx

import { useState, useEffect } from 'react'
import ReviewForm from './components/ReviewForm';
import './App.css'

function App() {
  // レビュー一覧を保存するためのstateを定義
  const [reviews, setReviews] = useState([])

  // 画面が最初に表示された時に一度だけAPIを叩く
  useEffect(() => {
    fetch('http://localhost:8080/api/reviews')
      .then(response => response.json())
      .then(data => {
        console.log(data) // 取得したデータをブラウザのコンソールに表示
        setReviews(data)  // stateにデータを保存
      })
      .catch(error => console.error('データの取得に失敗しました:', error))
  }, []) // 第2引数の[]は「最初の一回だけ実行する」という意味

  return (
    <div>
      <h1>温泉レビューアプリ</h1>
      <ReviewForm />
      <hr />
      <ul>
        {reviews.map(review => (
          <li key={review.id}>
            <h2>{review.name}</h2>
            <p>評価：{review.rating}</p>
            <p>{review.comment}</p>
            <small>訪問日：{review.visited_date}</small>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App