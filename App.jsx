import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Download, X, Check, Calendar as CalendarIcon } from 'lucide-react';

const CalendarApp = () => {
  // ----------------State Management----------------
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduleData, setScheduleData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [customTitle, setCustomTitle] = useState('伸動保健室預約月曆');
  
  const exportRef = useRef(null);
  
  // Modal Form State
  const [formType, setFormType] = useState('class');
  const [formPeople, setFormPeople] = useState({
    CHARLES: false,
    OLLIE: false
  });

  // ----------------Load Assets----------------
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://html2canvas.hertzen.com/dist/html2canvas.min.js";
    script.async = true;
    document.body.appendChild(script);

    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
      if (document.head.contains(link)) document.head.removeChild(link);
    };
  }, []);

  // ----------------Calendar Logic----------------
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); 
    const days = [];
    const emptySlots = (firstDayOfMonth + 6) % 7;

    for (let i = 0; i < emptySlots; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  };

  const formatDateKey = (date) => {
    if (!date) return null;
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  };

  const formatDisplayDate = (date) => {
    if (!date) return "";
    return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月 ${date.getDate()} 日`;
  };

  const changeMonth = (offset) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(newDate);
  };

  // ----------------Handlers----------------
  const handleDayClick = (date) => {
    if (!date) return;
    const key = formatDateKey(date);
    setSelectedDate(date);
    
    if (scheduleData[key]) {
      setFormType(scheduleData[key].type);
      setFormPeople(scheduleData[key].people);
    } else {
      setFormType('class');
      setFormPeople({ CHARLES: false, OLLIE: false });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    const key = formatDateKey(selectedDate);
    setScheduleData({
      ...scheduleData,
      [key]: { type: formType, people: { ...formPeople } }
    });
    setIsModalOpen(false);
  };

  const handleClear = () => {
    const key = formatDateKey(selectedDate);
    const newData = { ...scheduleData };
    delete newData[key];
    setScheduleData(newData);
    setIsModalOpen(false);
  };

  const togglePerson = (name) => {
    setFormPeople(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleExport = async () => {
    if (window.html2canvas && exportRef.current) {
      try {
        const canvas = await window.html2canvas(exportRef.current, {
          scale: 2,
          backgroundColor: "#1e293b", // 強制指定背景色，防止透明或切邊
          useCORS: true,
          logging: false,
          onclone: (clonedDoc) => {
            // 在匯出版中切換標題顯示
            const input = clonedDoc.querySelector('.title-input');
            const div = clonedDoc.querySelector('.title-display');
            if (input) input.style.display = 'none';
            if (div) {
                div.style.display = 'block';
                div.style.paddingTop = '10px'; // 增加額外 Padding 防止切到
            }
          }
        });
        const image = canvas.toDataURL("image/jpeg", 1.0);
        const link = document.createElement("a");
        link.download = `Schedule_${currentDate.getFullYear()}_${currentDate.getMonth() + 1}.jpg`;
        link.href = image;
        link.click();
      } catch (error) {
        console.error("Export failed:", error);
        alert("圖片匯出失敗");
      }
    } else {
      alert("載入中，請稍候...");
    }
  };

  const days = getDaysInMonth(currentDate);
  const weekDays = ['一', '二', '三', '四', '五', '六', '日'];

  return (
    <div className="min-h-screen bg-gray-50 p-4 text-gray-800" style={{ fontFamily: '"Noto Sans TC", sans-serif' }}>
      
      <div ref={exportRef} className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 relative">

        {/* Header Section */}
        <div className="bg-slate-800 text-white p-4 pb-0">
          <div className="relative flex items-center justify-between mb-4 h-16">
            <div className="flex items-center gap-2 z-20" data-html2canvas-ignore="true">
              <button onClick={handleExport} className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-colors shadow-sm">
                <Download className="w-5 h-5" />
              </button>
            </div>

            {/* 標題區：解決切邊與 Input 渲染問題 */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pt-2">
                <input 
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="title-input pointer-events-auto bg-transparent border-none text-white text-2xl md:text-3xl font-bold tracking-widest text-center focus:ring-0 focus:outline-none w-full max-w-lg"
                />
                <div className="title-display hidden text-white text-2xl md:text-3xl font-bold tracking-widest text-center w-full max-w-lg">
                  {customTitle}
                </div>
            </div>
            
            <div className="flex items-center gap-4 z-20">
               <div className="flex items-center gap-2">
                 <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-slate-700 rounded-full" data-html2canvas-ignore="true">
                    <ChevronLeft className="w-6 h-6 text-slate-300" />
                 </button>
                 <span className="text-xl md:text-2xl font-bold tracking-widest min-w-[120px] text-center">
                    {currentDate.getFullYear()} / {String(currentDate.getMonth() + 1).padStart(2, '0')}
                 </span>
                 <button onClick={() => changeMonth(1)} className="p-1 hover:bg-slate-700 rounded-full" data-html2canvas-ignore="true">
                    <ChevronRight className="w-6 h-6 text-slate-300" />
                 </button>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-7 border-t border-slate-700/50">
            {weekDays.map(day => (
              <div key={day} className="py-3 text-center font-medium text-slate-300 text-sm tracking-wider">{day}</div>
            ))}
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 auto-rows-fr border-l border-gray-200 bg-white">
          {days.map((date, index) => {
            const key = formatDateKey(date);
            const data = scheduleData[key];
            if (!date) return <div key={`empty-${index}`} className="bg-gray-50/50 min-h-[100px] md:min-h-[120px] border-r border-b border-gray-200"></div>;
            
            const isRest = data && data.type === 'rest';
            const hasPeople = data && (data.people.CHARLES || data.people.OLLIE);
            const showStamp = isRest || (data && !isRest && !hasPeople);

            return (
              <div key={index} onClick={() => handleDayClick(date)} className="min-h-[100px] md:min-h-[120px] p-2 pt-8 relative cursor-pointer hover:bg-blue-50 transition-colors flex flex-col items-center border-r border-b border-gray-200">
                <span className={`absolute top-2 left-2 text-base font-bold w-6 h-6 flex items-center justify-center ${date.getDay() === 0 || date.getDay() === 6 ? 'text-red-500' : 'text-slate-500'}`}>
                  {date.getDate()}
                </span>

                {data && (
                  <div className="flex flex-col items-center justify-start w-full space-y-1">
                    {showStamp && (
                      /* 修正圈圈字體下移：移除 Flex 改用 line-height */
                      <div className={`w-12 h-12 rounded-full border-2 text-center ${isRest ? 'border-red-500 text-red-500 bg-red-50' : 'border-blue-600 text-blue-600 bg-blue-50'}`}
                           style={{ lineHeight: '2.75rem' }}>
                        <span className="font-bold text-xl">{isRest ? '休' : '課'}</span>
                      </div>
                    )}
                    {!isRest && (
                      <div className="flex flex-col items-center space-y-1 w-full">
                        {data.people.CHARLES && <span className="text-xs md:text-sm font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1 py-1 rounded w-full text-center truncate">CHARLES</span>}
                        {data.people.OLLIE && <span className="text-xs md:text-sm font-bold text-green-700 bg-green-50 border border-green-200 px-1 py-1 rounded w-full text-center truncate">OLLIE</span>}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Section */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="bg-slate-800 text-white p-4 flex justify-between items-center">
              <h3 className="font-bold text-lg flex items-center gap-2"><CalendarIcon className="w-5 h-5" />設定：{formatDisplayDate(selectedDate)}</h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-slate-700 p-1 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-3">類型</label>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setFormType('class')} className={`p-3 rounded-xl border-2 transition-all ${formType === 'class' ? 'border-blue-600 bg-blue-50 text-blue-600 font-bold' : 'border-gray-200 text-gray-500'}`}>上課</button>
                  <button onClick={() => setFormType('rest')} className={`p-3 rounded-xl border-2 transition-all ${formType === 'rest' ? 'border-red-500 bg-red-50 text-red-600 font-bold' : 'border-gray-200 text-gray-500'}`}>休息</button>
                </div>
              </div>
              {formType === 'class' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-3">選擇人員</label>
                  <div className="space-y-3">
                    {['CHARLES', 'OLLIE'].map(person => (
                      <label key={person} className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${formPeople[person] ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                        <input type="checkbox" checked={formPeople[person]} onChange={() => togglePerson(person)} className="w-5 h-5 text-blue-600 rounded" />
                        <span className={`ml-3 font-medium ${formPeople[person] ? (person === 'CHARLES' ? 'text-blue-700' : 'text-green-700') : 'text-gray-600'}`}>{person}</span>
                        {formPeople[person] && <Check className="w-5 h-5 ml-auto text-blue-600" />}
                      </label>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg text-center text-sm text-gray-500 border border-gray-100">休息模式將隱藏人員。</div>
              )}
            </div>
            <div className="p-4 bg-gray-50 flex gap-3">
              <button onClick={handleClear} className="flex-1 px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium">清除</button>
              <button onClick={handleSave} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold">儲存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarApp;
