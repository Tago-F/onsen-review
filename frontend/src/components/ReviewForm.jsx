import { useState, useEffect } from "react";

/**
 * レビューの新規投稿と編集を担当するフォームコンポーネント
 * @param {object} props - 親コンポーネントから渡されるプロパティ
 * @param {object | null} props.initialData - 編集対象のレビューデータ。新規作成時はnull
 * @param {function} props.onFormSubmit - フォームが送信されたときに呼び出される関数
 * @param {function} props.onCancelEdit - 編集キャンセル時に呼び出される関数
 */
function ReviewForm({ initialData, onFormSubmit, onCancelEdit }) {
  // フォームの各入力フィールドの状態を管理する
  const [name, setName] = useState("");
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [visitedDate, setVisitedDate] = useState("");
  const [quality, setQuality] = useState("");
  const [scenery, setScenery] = useState("");
  const [cleanliness, setCleanliness] = useState("");
  const [service, setService] = useState("");
  const [meal, setMeal] = useState("");

  // initialData（編集対象データ）が変更されたら、フォームの内容を更新する
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setRating(initialData.rating);
      setComment(initialData.comment || "");
      setVisitedDate(initialData.visited_date || "");
      setQuality(initialData.quality || "");
      setScenery(initialData.scenery || "");
      setCleanliness(initialData.cleanliness || "");
      setService(initialData.service || "");
      setMeal(initialData.meal || "");
    } else {
      setName("");
      setRating("");
      setComment("");
      setVisitedDate("");
      setQuality("");
      setScenery("");
      setCleanliness("");
      setService("");
      setMeal("");
    }
  }, [initialData]);

  /**
   * フォームの送信ボタンが押されたときの処理
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const reviewData = {
      id: initialData ? initialData.id : undefined,
      name: name,
      rating: parseFloat(rating),
      comment: comment,
      visited_date: visitedDate || null,
      quality: parseFloat(quality) || null,
      scenery: parseFloat(scenery) || null,
      cleanliness: parseFloat(cleanliness) || null,
      service: parseFloat(service) || null,
      meal: parseFloat(meal) || null,
    };
    onFormSubmit(reviewData);
  };

  return (
    // フォーム全体をカードスタイルにする
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-8 mb-6"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {initialData ? "レビューを編集" : "新しいレビューを投稿"}
      </h2>

      {/* 各入力フィールドをFlexboxでレイアウト */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          場所の名前：
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          評価：
        </label>
        <input
          type="number"
          step="0.5"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          コメント：
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-24"
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          訪問日：
        </label>
        <input
          type="date"
          value={visitedDate}
          onChange={(e) => setVisitedDate(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <div className="flex items-center gap-x-4">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {initialData ? "更新" : "登録"}
        </button>
        {initialData && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            キャンセル
          </button>
        )}
      </div>
      <h3 className="text-lg font-bold mt-6 mb-2 text-gray-700">詳細評価</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
        {/* 以下、各評価項目の入力欄 (例: お湯の質) */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            お湯の質
          </label>
          <input
            type="number"
            step="0.5"
            min="0"
            max="5"
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            景色
          </label>
          <input
            type="number"
            step="0.5"
            min="0"
            max="5"
            value={scenery}
            onChange={(e) => setScenery(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            清潔さ
          </label>
          <input
            type="number"
            step="0.5"
            min="0"
            max="5"
            value={cleanliness}
            onChange={(e) => setCleanliness(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            サービス
          </label>
          <input
            type="number"
            step="0.5"
            min="0"
            max="5"
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            食事
          </label>
          <input
            type="number"
            step="0.5"
            min="0"
            max="5"
            value={meal}
            onChange={(e) => setMeal(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3"
          />
        </div>
      </div>
    </form>
  );
}

export default ReviewForm;
