// APIのベースURL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * APIリクエストを送信するための共通関数
 * @param {string} endpoint - APIのエンドポイント (例: "/reviews")
 * @param {object} options - fetchのオプション (method, headers, bodyなど)
 * @returns {Promise<any>} - APIからのレスポンス(JSON)
 */
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      // 204 No Contentの場合は成功として扱う
      if (response.status === 204) {
        return null;
      }
      const errorData = await response.json().catch(() => ({})); // JSONパース失敗も考慮
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    // レスポンスボディがない場合 (204など)
    if (response.status === 204) {
        return null;
    }
    return response.json();
  } catch (error) {
    console.error(`API request failed: ${error.message}`);
    throw error;
  }
};

/**
 * 全てのレビューを取得する
 */
export const getReviews = () => {
  return request("/reviews");
};

/**
 * 新しいレビューを作成する
 * @param {object} reviewData - 作成するレビューのデータ
 */
export const createReview = (reviewData) => {
  return request("/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reviewData),
  });
};

/**
 * 既存のレビューを更新する
 * @param {number} id - 更新するレビューのID
 * @param {object} reviewData - 更新後のレビューデータ
 */
export const updateReview = (id, reviewData) => {
  return request(`/reviews/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reviewData),
  });
};

/**
 * レビューを削除する
 * @param {number} id - 削除するレビューのID
 */
export const deleteReview = (id) => {
  return request(`/reviews/${id}`, {
    method: "DELETE",
  });
};

/**
 * 画像をAzure Blob Storageにアップロードする
 * @param {File} imageFile - アップロードする画像ファイル
 * @returns {Promise<string>} - アップロードされた画像のURL
 */
export const uploadImage = async (imageFile) => {
  if (!imageFile) return null;

  // Step 1: バックエンドにSAS URLをリクエスト
  const { sasUrl, blobUrl } = await request('/storage/generate-upload-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName: imageFile.name }),
  });

  // Step 2: 取得したSAS URLに画像を直接アップロード
  const uploadResponse = await fetch(sasUrl, {
    method: 'PUT',
    headers: { 'x-ms-blob-type': 'BlockBlob', 'Content-Type': imageFile.type },
    body: imageFile,
  });

  if (!uploadResponse.ok) {
    throw new Error('Azureへの画像アップロードに失敗しました。');
  }

  return blobUrl; // DBに保存する最終的なURLを返す
};
