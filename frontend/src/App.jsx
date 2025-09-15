import { useState, useEffect } from "react";
import ReviewForm from "./components/ReviewForm.jsx";
import ReviewList from "./components/ReviewList.jsx";
import { useReviews } from "./hooks/useReviews.js";
import "./index.css";

// 背景画像のURLリスト
const backgroundImages = [
  "https://tagostorage001.blob.core.windows.net/onsenreview-freeimages/onsen001.jpg",
  "https://tagostorage001.blob.core.windows.net/onsenreview-freeimages/onsen002.jpg",
  "https://tagostorage001.blob.core.windows.net/onsenreview-freeimages/onsen003.jpg",
];

function App() {
  const { reviews, isLoading, error, addReview, updateReview, deleteReview } = useReviews();
  const [editingReview, setEditingReview] = useState(null);
  // 表示中の背景画像のインデックスを管理する state
  const [bgIndex, setBgIndex] = useState(0);

  // スクロールイベントを監視する useEffect
  useEffect(() => {
    const handleScroll = () => {
      // ページ全体の高さ
      const pageHeight = document.documentElement.scrollHeight;
      // 表示領域の高さ
      const windowHeight = window.innerHeight;
      // 現在のスクロール位置
      const scrollPosition = window.scrollY;
      
      // スクロール可能な最大距離
      const maxScroll = pageHeight - windowHeight;
      if (maxScroll <= 0) return; // スクロールできない場合は何もしない

      // スクロール位置の割合 (0から1) を計算
      const scrollRatio = scrollPosition / maxScroll;
      
      // スクロール割合に応じて表示する画像のインデックスを計算
      const newIndex = Math.min(
        Math.floor(scrollRatio * backgroundImages.length),
        backgroundImages.length - 1
      );

      if (newIndex !== bgIndex) {
        setBgIndex(newIndex);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // コンポーネントがアンマウントされたときにイベントリスナーを解除
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [bgIndex]);

  // (handleFormSubmit, handleEdit, handleCancelEdit はそのまま)
  const handleFormSubmit = (reviewData, imageFile) => {
    if (editingReview) {
      updateReview({ ...editingReview, ...reviewData }, imageFile);
      setEditingReview(null);
    } else {
      addReview(reviewData, imageFile);
    }
  };

  const handleEdit = (reviewToEdit) => {
    setEditingReview(reviewToEdit);
    window.scrollTo(0, 0);
  };
  
  const handleCancelEdit = () => {
    setEditingReview(null);
  };


  return (
    // ここからが背景の実装部分
    <div className="relative min-h-screen">
      {/* 背景画像を表示するコンテナ */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 transition-opacity duration-1000">
        {backgroundImages.map((img, index) => (
          <img
            key={img}
            src={img}
            alt="Onsen background"
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === bgIndex ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        {/* 画像の上に少し暗いオーバーレイをかけると文字が読みやすくなる */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/30"></div>
      </div>

      {/* 元々のコンテンツ */}
      <div className="max-w-4xl mx-auto p-8 relative z-10">
        <h1 className="text-4xl font-bold text-center text-white mb-4 drop-shadow-lg">
          温泉レビュー
        </h1>
        <p className="text-center text-white/90 mb-8 drop-shadow-lg">
          心に残る最高の温泉体験を共有しよう
        </p>

        <ReviewForm
          key={editingReview ? editingReview.id : "new"}
          initialData={editingReview}
          onFormSubmit={handleFormSubmit}
          onCancelEdit={handleCancelEdit}
        />

        <div className="mt-12">
          <h2 className="text-3xl font-bold text-white mb-6 drop-shadow-lg">
            レビュー一覧
          </h2>
          <ReviewList
            isLoading={isLoading}
            error={error}
            reviews={reviews}
            onEdit={handleEdit}
            onDelete={deleteReview}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
