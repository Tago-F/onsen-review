import { useState, useEffect } from "react";
import StarRatingInput from "./StarRatingInput.jsx";

/**
 * レビューの新規当行と編集を担当するフォーム用コンポーネント<br>
 * App.jsx から渡される props によって、新規モードと編集モードを切り替え
 * @param {object} props - コンポーネントのプロパティ
 * @param {object} [props.initialData=null] - フォームの初期データ、編集モード時に使用
 * @param {function} props.onFormSubmit - フォーム送信時に呼び出されるコールバック関数
 * @param {function} [props.onCancelEdit] - 編集モードでキャンセルボタンが押された時に呼び出される関数
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

  // 選択された画像ファイルを保持する state
  const [imageFile, setImageFile] = useState(null);
  // フォームが送信処理中かどうかを示すフラグ state
  const [isSubmitting, setIsSubmitting] = useState(false);
  // フォームのバリデーションエラーメッセージを保持する state
  const [formErrors, setFormErrors] = useState({});

  // 新規登録モード、編集モードが切り替わった時にフォームを初期化する useEffect
  useEffect(() => {
    // 編集モード
    if (initialData) {
      // フォームのデータを initialData の値で更新
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
      // 編集モード開始時は画像選択をリセット
      setImageFile(null);
    } else {
      // 新規登録モード
      setFormData({
        // フォームのデータをリセット
        name: "", rating: "", comment: "", visited_date: "",
        quality: "", scenery: "", cleanliness: "", service: "", meal: "",
      });
      setImageFile(null);
    }
    // モードが切り替わったタイミングでエラーメッセージをリセット
    setFormErrors({});
  }, [initialData]);

  /**
   * input や textarea の入力値が変更されたときに呼ばれるハンドラ関数
   * @param {*} e - イベントオブジェクト
   */
  const handleChange = (e) => {
    // イベント発生時の要素の name と value を取得
    const { name, value } = e.target;
    // 変更があったフィールの値だけを更新
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * StarRatingInput コンポーネントで評価が変更されたときに呼ばれるハンドラ関数
   * @param {*} newRating - 新しい評価値
   */
  const handleRatingChange = (newRating) => {
    setFormData((prev) => ({ ...prev, rating: newRating }));
  };

  /**
   * ファイル選択 input で画像ファイルが変更された時の呼ばれるハンドラ関数
   * @param {*} e - イベントオブジェクト
   */
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0] || null);
  };

  /**
   * フォームの送信ボタンが押されたときに呼ばれるハンドラ関数
   * @param {*} e - イベントオブジェクト
   * @returns 
   */
  const handleSubmit = async (e) => {

    // フォーム送信によるページのリロードを防止
    e.preventDefault();

    // バリデーションチェック
    const errors = {};
    if (!formData.name) {
      errors.name = "場所の名前を入力してください。";
    }
    if (!formData.rating) {
      errors.rating = "評価を選択してください。";
    }

    // エラーメッセージを state セット
    setFormErrors(errors);

    // エラーメッセージがある場合、処理を中断
    if (Object.keys(errors).length > 0) {
      return;
    }

    // 送信処理中の場合は処理を中断（二重送信を防止）
    if (isSubmitting) return;

    // 送信中フラグを更新
    setIsSubmitting(true);

    const numericFields = ['rating', 'quality', 'scenery', 'cleanliness', 'service', 'meal'];
    const processedData = { ...formData };
    numericFields.forEach(field => {
      processedData[field] = processedData[field] ? parseFloat(processedData[field]) : null;
    });

    await onFormSubmit(processedData, imageFile);

    if (!initialData) {
      setFormData({
        name: "", rating: "", comment: "", visited_date: "",
        quality: "", scenery: "", cleanliness: "", service: "", meal: "",
      });
      setImageFile(null);
      e.target.reset();
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-md shadow-xl rounded-lg p-8 mb-6 border border-white/20">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {initialData ? "レビューを編集" : "新しいレビューを投稿"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">場所の名前：</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
          {formErrors.name && (
            <p className="text-red-500 text-xs italic mt-1">{formErrors.name}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">評価：</label>
          <StarRatingInput
            rating={formData.rating}
            onRatingChange={handleRatingChange}
          />
          {formErrors.rating && (
            <p className="text-red-500 text-xs italic mt-1">{formErrors.rating}</p>
          )}
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

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">温泉の写真：</label>
        <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
      </div>

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
