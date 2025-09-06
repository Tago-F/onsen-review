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
  const [imageFile, setImageFile] = useState(null);
  const [meal, setMeal] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // 送信中の状態を管理

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
      setImageFile(null); // 編集開始時は画像選択をリセット
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
      setImageFile(null);
    }
  }, [initialData]);

  /**
   * フォームの送信ボタンが押されたときの処理
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true); // 送信開始

    let imageUrl = initialData ? initialData.image_url : null;

    // ★ 2. 新しい画像ファイルが選択されている場合のみアップロード処理を実行
    if (imageFile) {
      try {
        // --- Step A: バックエンドにSAS URLをリクエスト ---
        const sasResponse = await fetch('http://localhost:8080/api/storage/generate-upload-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileName: imageFile.name }),
        });
        if (!sasResponse.ok) throw new Error('SAS URLの取得に失敗しました。');
        const { sasUrl, blobUrl } = await sasResponse.json();
        imageUrl = blobUrl; // DBに保存する最終的なURLをセット

        // --- Step B: 取得したSAS URLに画像を直接アップロード ---
        const uploadResponse = await fetch(sasUrl, {
          method: 'PUT',
          headers: { 'x-ms-blob-type': 'BlockBlob', 'Content-Type': imageFile.type },
          body: imageFile,
        });
        if (!uploadResponse.ok) throw new Error('Azureへの画像アップロードに失敗しました。');

      } catch (error) {
        console.error(error);
        alert(error.message);
        setIsSubmitting(false); // エラー時は送信状態を解除
        return;
      }
    }
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
      image_url: imageUrl, // 画像URLを追加
    };
    onFormSubmit(reviewData);
    setIsSubmitting(false);
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
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          温泉の写真：
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <div className="flex items-center gap-x-4">
        <button type="submit" disabled={isSubmitting} className="...">
          {isSubmitting ? '送信中...' : (initialData ? "更新" : "登録")}
        </button>
        {/* ... (キャンセルボタンは変更なし) ... */}
      </div>
    </form>
  );
}

export default ReviewForm;
