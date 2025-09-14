import { useState, useEffect } from "react";
import StarRatingInput from "./StarRatingInput.jsx";

/**
 * レビューの新規投稿と編集を担当するフォームコンポーネント
 * @param {object} props
 * @param {object | null} props.initialData - 編集対象のレビューデータ
 * @param {function} props.onFormSubmit - フォーム送信時に呼び出す関数
 * @param {function} props.onCancelEdit - 編集キャンセル時に呼び出す関数
 */
function ReviewForm({ initialData, onFormSubmit, onCancelEdit }) {
  const [formData, setFormData] = useState({
    name: "",
    rating: "",
    comment: "",
    visited_date: "",
    quality: "",
    scenery: "",
    cleanliness: "",
    service: "",
    meal: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // initialDataが変更されたらフォームの内容を更新
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        rating: initialData.rating || "",
        comment: initialData.comment || "",
        visited_date: initialData.visited_date || "",
        quality: initialData.quality || "",
        scenery: initialData.scenery || "",
        cleanliness: initialData.cleanliness || "",
        service: initialData.service || "",
        meal: initialData.meal || "",
      });
      setImageFile(null); // 編集開始時は画像選択をリセット
    } else {
      // 新規作成時はフォームをリセット
      setFormData({
        name: "", rating: "", comment: "", visited_date: "",
        quality: "", scenery: "", cleanliness: "", service: "", meal: "",
      });
      setImageFile(null);
    }
  }, [initialData]);

  /**
   * フォームの入力値をハンドルする
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * 星評価が変更されたときの処理
   */
  const handleRatingChange = (newRating) => {
    setFormData((prev) => ({ ...prev, rating: newRating }));
  };

  /**
   * 画像ファイルが選択されたときの処理
   */
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0] || null);
  };

  /**
   * フォームの送信処理
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    // 数値に変換するフィールド
    const numericFields = ['rating', 'quality', 'scenery', 'cleanliness', 'service', 'meal'];
    const processedData = { ...formData };
    numericFields.forEach(field => {
      processedData[field] = processedData[field] ? parseFloat(processedData[field]) : null;
    });

    // 親コンポーネントにデータとファイルを渡す
    await onFormSubmit(processedData, imageFile);

    // 新規投稿の場合、フォームをリセット
    if (!initialData) {
      setFormData({
        name: "", rating: "", comment: "", visited_date: "",
        quality: "", scenery: "", cleanliness: "", service: "", meal: "",
      });
      setImageFile(null);
      // input[type=file]の表示をリセットするためにフォーム自体をリセット
      event.target.reset();
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 mb-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {initialData ? "レビューを編集" : "新しいレビューを投稿"}
      </h2>

      {/* --- 基本情報 --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">場所の名前：</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3" />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">評価：</label>
          <StarRatingInput
            rating={formData.rating}
            onRatingChange={handleRatingChange}
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">コメント：</label>
        <textarea name="comment" value={formData.comment} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 h-24" />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">訪問日：</label>
        <input type="date" name="visited_date" value={formData.visited_date} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3" />
      </div>

      {/* --- 詳細評価 --- */}
      <h3 className="text-lg font-bold mt-6 mb-2 text-gray-700">詳細評価</h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">お湯の質</label>
          <input type="number" name="quality" step="0.5" min="0" max="5" value={formData.quality} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3" />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">景色</label>
          <input type="number" name="scenery" step="0.5" min="0" max="5" value={formData.scenery} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3" />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">清潔さ</label>
          <input type="number" name="cleanliness" step="0.5" min="0" max="5" value={formData.cleanliness} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3" />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">サービス</label>
          <input type="number" name="service" step="0.5" min="0" max="5" value={formData.service} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3" />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">食事</label>
          <input type="number" name="meal" step="0.5" min="0" max="5" value={formData.meal} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3" />
        </div>
      </div>

      {/* --- 画像アップロード --- */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">温泉の写真：</label>
        <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
      </div>

      {/* --- 送信ボタン --- */}
      <div className="flex items-center gap-x-4">
        <button type="submit" disabled={isSubmitting} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300">
          {isSubmitting ? '送信中...' : (initialData ? "更新" : "登録")}
        </button>
        {initialData && (
          <button type="button" onClick={onCancelEdit} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            キャンセル
          </button>
        )}
      </div>
    </form>
  );
}

export default ReviewForm;
