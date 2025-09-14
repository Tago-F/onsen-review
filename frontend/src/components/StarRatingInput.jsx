// frontend/src/components/StarRatingInput.jsx

import { useState } from 'react';
import { FaStar } from 'react-icons/fa';

/**
 * 星評価の入力を行うコンポーネント
 * @param {object} props
 * @param {number} props.rating - 現在の評価値
 * @param {function} props.onRatingChange - 評価が変更されたときに呼び出される関数
 */
function StarRatingInput({ rating, onRatingChange }) {
  const [hover, setHover] = useState(null);

  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        const starColor = ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9";

        return (
          <label key={ratingValue} className="cursor-pointer">
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => onRatingChange(ratingValue)}
              className="hidden" // radioボタン自体は非表示にする
            />
            <FaStar
              size={28}
              color={starColor}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(null)}
            />
          </label>
        );
      })}
    </div>
  );
}

export default StarRatingInput;