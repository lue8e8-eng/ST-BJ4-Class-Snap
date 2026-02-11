排課月曆 (Course Calendar)

這是一個基於 React 開發的互動式排課月曆應用程式。專為管理個人或小團隊（Charles & Ollie）的課程與休息時間而設計。

🌟 主要功能

📅 動態月曆視圖：可自由切換年份與月份，自動計算每月天數與星期排列。

👆 點擊編輯：直覺式操作，點擊任意日期即可設定當日行程。

🎨 狀態標示：

上課 (藍色)：顯示藍色「課」字印章，並標示上課人員（Charles / Ollie）。

休息 (紅色)：顯示紅色「休」字印章，自動隱藏人員名稱以保持版面整潔。

👥 人員管理：支援複選人員，不同人員有專屬的顏色標籤（Charles: 藍色 / Ollie: 綠色）。

🖼️ 圖片匯出：內建 html2canvas 技術，可一鍵將當前月曆匯出為高解析度 JPG 圖片，且介面會自動優化（隱藏操作按鈕）以供分享。

✏️ 自訂標題：可自行輸入月曆標題（預設為「行事曆」）。

🛠️ 技術棧

React: 前端框架

Tailwind CSS: 用於快速且現代化的樣式排版

Lucide React: 提供精美的圖標介面

html2canvas: 用於將 DOM 元素轉換為圖片下載

🚀 如何在本地運行

本專案適合使用 Vite 或 Create React App 建立。

安裝依賴套件
請確保您的專案中安裝了以下套件：

npm install lucide-react html2canvas



(Tailwind CSS 需依照官方文件在專案中完成初始化配置)

加入組件
將 CalendarApp.jsx 檔案放入您的 src 目錄中。

引入並使用
在您的 App.js 或主入口檔案中引入：

import CalendarApp from './CalendarApp';

function App() {
  return (
    <div className="App">
      <CalendarApp />
    </div>
  );
}

export default App;


📝 授權

特別感謝 Gemini 的幫忙
