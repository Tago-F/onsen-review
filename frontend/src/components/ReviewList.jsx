import ReviewCard from "./ReviewCard.jsx";

/**
 * レビューの一覧を表示するコンポーネント
 * @param {object} props
 * @param {boolean} props.isLoading - ローディング中かどうか
 * @param {string | null} props.error - エラーメッセージ
 * @param {Array} props.reviews - 表示するレビューの配列
 * @param {function} props.onEdit - 編集ボタンクリック時に呼び出される関数
 * @param {function} props.onDelete - 削除ボタンクリック時に呼び出される関数
 */
function ReviewList({ isLoading, error, reviews, onEdit, onDelete }) {
  if (isLoading) {
    return <p className="text-center text-gray-500">読み込み中...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 font-bold">{error}</p>;
  }

  if (reviews.length === 0) {
    return (
      <p className="text-center text-gray-500">
        まだレビューがありません。最初のレビューを投稿してみましょう！
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default ReviewList;

