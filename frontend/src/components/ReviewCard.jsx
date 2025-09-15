import RadarChart from "./RadarChart.jsx";
import { FaStar } from "react-icons/fa";

const StarDisplay = ({ rating }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, index) => (
      <FaStar
        key={index}
        color={index < rating ? "#ffc107" : "#e4e5e9"}
        size={20}
      />
    ))}
    <span className="ml-2 text-gray-600 font-bold">{rating.toFixed(1)}</span>
  </div>
);

/**
 * 個々のレビュー情報を表示するカードコンポーネント
 * @param {object} props
 * @param {object} props.review - 表示するレビューデータ
 * @param {function} props.onEdit - 編集ボタンクリック時に呼び出される関数
 * @param {function} props.onDelete - 削除ボタンクリック時に呼び出される関数
 */
function ReviewCard({ review, onEdit, onDelete }) {
  return (
    <li className="bg-white/70 backdrop-blur-md shadow-xl rounded-lg p-6 flex flex-col justify-between border border-white/20">
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{review.name}</h3>
        <StarDisplay rating={review.rating} />
        {review.image_url ? (
          <img
            src={review.image_url}
            alt={review.name}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-md mb-4">
            <span className="text-gray-400">画像なし</span>
          </div>
        )}

        {review.quality != null ? (
          <div className="w-full h-64 mb-4">
            <RadarChart reviewData={review} />
          </div>
        ) : (
          <div className="w-full h-64 mb-4 flex items-center justify-center bg-gray-50 rounded">
            <p className="text-gray-400">詳細評価はありません</p>
          </div>
        )}

        <p className="text-gray-600 mb-4">{review.comment}</p>
        <small className="text-gray-500">訪問日：{review.visited_date}</small>
      </div>
      <div className="mt-4 flex gap-x-2">
        <button
          onClick={() => onEdit(review)}
          className="bg-green-500 hover:bg-green-700 text-white text-sm font-bold py-1 px-3 rounded"
        >
          編集
        </button>
        <button
          onClick={() => onDelete(review.id)}
          className="bg-red-500 hover:bg-red-700 text-white text-sm font-bold py-1 px-3 rounded"
        >
          削除
        </button>
      </div>
    </li>
  );
}
export default ReviewCard;

