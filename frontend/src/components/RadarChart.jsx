import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";
import { useInView } from "react-intersection-observer";

// Chart.jsに必要な部品を登録する
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

/**
 * レーダーチャートを表示するコンポーネント
 * @param {object} props
 * @param {object} props.reviewData - 5項目の評価データを含むレビューオブジェクト
 */
function RadarChart({ reviewData }) {
  const { ref, inView } = useInView({
    triggerOnce: true, // アニメーションを一度だけ再生する
    threshold: 0.5, // 要素が50%見えたらトリガー
  });
  // チャートに表示するデータ構造を作成
  const data = {
    // X軸のラベル (評価項目)
    labels: ["お湯の質", "景色", "清潔さ", "サービス", "食事"],
    datasets: [
      {
        label: "評価",
        // 表示するデータ (reviewDataから取得)
        data: [
          reviewData.quality,
          reviewData.scenery,
          reviewData.cleanliness,
          reviewData.service,
          reviewData.meal,
        ],
        backgroundColor: "rgba(54, 162, 235, 0.2)", // グラフの塗りつぶし色
        borderColor: "rgba(54, 162, 235, 1)", // グラフの線の色
        borderWidth: 2,
        lineTension: 0, // 線の張力。0にすると直線になる
      },
    ],
  };

  // チャートの見た目や挙動を設定するオプション
  const options = {
    // スケール（軸）の設定
    scales: {
      r: {
        // 最小値・最大値を設定
        min: 0,
        max: 5,
        // 目盛りの設定
        ticks: {
          stepSize: 1, // 1刻みで表示
        },
        // 軸の見た目
        pointLabels: {
          font: {
            size: 14, // ラベルのフォントサイズ
          },
        },
      },
    },
    // アニメーションの設定
    // animation: {
    //   // グラフが中心から広がるようなアニメーション
    //   tension: {
    //     duration: 1000,
    //     easing: "easeOutQuad",
    //     from: 0.2,
    //     to: 1,
    //     loop: false,
    //   },
    // },

    // レスポンシブ対応
    maintainAspectRatio: false,
  };

  return (
    // refをdivに設定し、inViewがtrueの時だけチャートを描画
    <div ref={ref} className="w-full h-full">
      {inView && <Radar data={data} options={options} />}
    </div>
  );
}

export default RadarChart;
