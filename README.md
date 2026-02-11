📅 Course Calendar | 排課月曆
這是一個基於 React 開發的互動式排課月曆，專為 Charles & Ollie 團隊設計，支援快速排課與行事曆圖片匯出。

✨ 核心功能
動態月曆：自由切換年月，自動排列日期。

直覺編輯：點擊日期即可設定「上課（藍）」或「休息（紅）」。

人員標記：支援複選 Charles / Ollie，並具備專屬色彩識別。

一鍵匯出：內建圖片轉換技術，可直接下載乾淨的 JPG 檔分享。

🛠️ 技術工具
React (前端框架)

Tailwind CSS (介面排版)

Lucide React (圖示庫)

html2canvas (圖片產生)

🚀 快速開始
安裝環境：確保專案已配置 Tailwind CSS。

安裝套件：

Bash
npm install lucide-react html2canvas
放入檔案：將 CalendarApp.jsx 放入 src 資料夾。

引入組件：

JavaScript
import CalendarApp from './CalendarApp';

function App() {
  return <CalendarApp />;
}
📝 備註
特別感謝 Gemini 的幫忙
