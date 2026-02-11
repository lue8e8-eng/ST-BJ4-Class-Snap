import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Download, X, Check, Users, Calendar as CalendarIcon } from 'lucide-react';

const CalendarApp = () => {
  // ----------------State Management----------------
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduleData, setScheduleData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateKey, setSelectedDateKey] = useState(null);
  const [customTitle, setCustomTitle] = useState('伸動保健室預約月曆'); // State for custom title
  
  const exportRef = useRef(null); // Ref for the wrapper to export
  
  // Modal Form State
  const [formType, setFormType] = useState('class'); // 'class' or 'rest'
  const [formPeople, setFormPeople] = useState({
    CHARLES: false,
    OLLIE: false
  });

  const calendarRef = useRef(null);

  // ----------------Load Assets (html2canvas & Fonts)----------------
  useEffect(() => {
    // Load html2canvas
    const script = document.createElement('script');
    script.src = "https://html2canvas.hertzen.com/dist/html2canvas.min.js";
    script.async = true;
    document.body.appendChild(script);

    // Load Google Font: Noto Sans TC
    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.body.removeChild(script);
      document.head.removeChild(link);
    };
  }, []);

  // ----------------Calendar Logic----------------
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday, 1 is Monday...
    
    const days = [];
    
    // Calculate empty slots for Monday start
    // Formula: (DayOfWeek + 6) % 7 gives the offset from Monday (0) to Sunday (6)
    // Sunday (0) -> (0+6)%7 = 6 empty slots
    // Monday (1) -> (1+6)%7 = 0 empty slots
    const emptySlots = (firstDayOfMonth + 6) % 7;

    // Fill empty slots for previous month
    for (let i = 0; i < emptySlots; i++) {
      days.push(null);
    }
    
    // Fill days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const formatDateKey = (date) => {
    if (!date) return null;
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  };

  const changeMonth = (offset) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(newDate);
  };

  // ----------------Handlers----------------
  const handleDayClick = (date) => {
    if (!date) return;
    const key = formatDateKey(date);
    setSelectedDateKey(key);
    
    // Load existing data or default
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
    setScheduleData({
      ...scheduleData,
      [selectedDateKey]: {
        type: formType,
        people: { ...formPeople }
      }
    });
    setIsModalOpen(false);
  };

  const handleClear = () => {
    const newData = { ...scheduleData };
    delete newData[selectedDateKey];
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
          scale: 2, // Higher resolution
          backgroundColor: "#ffffff",
          useCORS: true, 
          // Note: data-html2canvas-ignore attributes in JSX will handle hiding buttons
        });
        const image = canvas.toDataURL("image/jpeg", 1.0);
        const link = document.createElement("a");
        link.download = `Schedule_${currentDate.getFullYear()}_${currentDate.getMonth() + 1}.jpg`;
        link.href = image;
        link.click();
      } catch (error) {
        console.error("Export failed:", error);
        alert("圖片匯出失敗，請稍後再試");
      }
    } else {
      alert("匯出功能尚未載入完成，請稍待幾秒後再試。");
    }
  };

  // ----------------Components----------------
  const days = getDaysInMonth(currentDate);
  // Updated weekDays to start with Monday
  const weekDays = ['一', '二', '三', '四', '五', '六', '日'];

  return (
    <div className="min-h-screen bg-gray-50 p-4 text-gray-800" style={{ fontFamily: '"Noto Sans TC", sans-serif' }}>
      
      {/* Wrapper for Export (Contains Header + Grid) */}
      <div ref={exportRef} className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 relative">

        {/* --- MERGED DARK HEADER SECTION --- */}
        <div className="bg-slate-800 text-white p-4 pb-0">
          
          {/* Top Control Row */}
          <div className="relative flex items-center justify-between mb-4 h-14">
            
            {/* LEFT: Actions (Hidden in export) */}
            <div className="flex items-center gap-2 z-20" data-html2canvas-ignore="true">
              <button 
                onClick={handleExport}
                className="flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-colors shadow-sm"
                title="匯出 JPG"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>

            {/* CENTER: Custom Editable Title */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <input 
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="pointer-events-auto bg-transparent border-none text-white text-3xl font-bold tracking-widest text-center focus:ring-0 focus:outline-none w-full max-w-lg placeholder-slate-400"
                  placeholder="輸入標題"
                  style={{ fontFamily: '"Noto Sans TC", sans-serif' }}
                />
            </div>
            
            {/* RIGHT: Date & Navigation */}
            <div className="flex items-center gap-4 z-20">
               <div className="flex items-center gap-2">
                 {/* Prev Button */}
                 <button 
                    onClick={() => changeMonth(-1)} 
                    className="p-1 hover:bg-slate-700 rounded-full transition-colors"
                    data-html2canvas-ignore="true"
                  >
                    <ChevronLeft className="w-6 h-6 text-slate-300" />
                  </button>

                 {/* Date Display */}
                 <span className="text-2xl font-bold tracking-widest min-w-[140px] text-center">
                    {currentDate.getFullYear()} / {String(currentDate.getMonth() + 1).padStart(2, '0')}
                 </span>

                 {/* Next Button */}
                 <button 
                    onClick={() => changeMonth(1)} 
                    className="p-1 hover:bg-slate-700 rounded-full transition-colors"
                    data-html2canvas-ignore="true"
                  >
                    <ChevronRight className="w-6 h-6 text-slate-300" />
                  </button>
               </div>
            </div>
          </div>

          {/* Bottom Row: Week Days (Integrated visually) */}
          <div className="grid grid-cols-7 border-t border-slate-700/50">
            {weekDays.map(day => (
              <div key={day} className="py-3 text-center font-medium text-slate-300 text-sm tracking-wider">
                {day}
              </div>
            ))}
          </div>
        </div>

        {/* --- CALENDAR GRID BODY --- */}
        <div ref={calendarRef} className="relative z-0">
          
          {/* Grid Container */}
          <div className="grid grid-cols-7 auto-rows-fr border-l border-gray-200 relative z-10 bg-white/50 backdrop-blur-[1px]">
            {days.map((date, index) => {
              const key = formatDateKey(date);
              const data = scheduleData[key];
              
              if (!date) {
                return (
                  <div 
                    key={`empty-${index}`} 
                    className="bg-white/40 min-h-[100px] md:min-h-[120px] border-r border-b border-gray-200"
                  ></div>
                );
              }
              
              const isRest = data && data.type === 'rest';
              const hasPeople = data && (data.people.CHARLES || data.people.OLLIE);
              const showStamp = isRest || (data && !isRest && !hasPeople);

              return (
                <div 
                  key={index}
                  onClick={() => handleDayClick(date)}
                  className="bg-white/70 min-h-[100px] md:min-h-[120px] p-2 pt-8 relative cursor-pointer hover:bg-blue-50/90 transition-colors group flex flex-col items-center justify-start border-r border-b border-gray-200 backdrop-blur-[1px]"
                >
                  <span className={`absolute top-2 left-2 text-base font-bold w-6 h-6 flex items-center justify-center rounded-full z-20 ${
                    date.getDay() === 0 || date.getDay() === 6 ? 'text-red-500' : 'text-slate-500'
                  }`}>
                    {date.getDate()}
                  </span>

                  {data && (
                    <div className="flex flex-col items-center justify-start w-full z-10 space-y-1">
                      
                      {/* Stamp Circle */}
                      {showStamp && (
                        <div className={`
                          w-12 h-12 flex items-center justify-center rounded-full border-2 shadow-sm
                          ${isRest 
                            ? 'border-red-500 text-red-500 bg-red-50/90' 
                            : 'border-blue-600 text-blue-600 bg-blue-50/90'}
                        `}>
                          <span className="font-bold text-xl leading-none pt-[2px]">
                            {isRest ? '休' : '課'}
                          </span>
                        </div>
                      )}

                      {/* Names */}
                      {!isRest && (
                        <div className="flex flex-col items-center space-y-1 w-full justify-start">
                          {data.people.CHARLES && (
                            <span className="text-xs md:text-sm font-bold text-blue-700 bg-blue-50/95 border border-blue-200 px-2 pt-1 pb-1.5 rounded-md w-full text-center truncate shadow-sm">
                              CHARLES
                            </span>
                          )}
                          {data.people.OLLIE && (
                            <span className="text-xs md:text-sm font-bold text-green-700 bg-green-50/95 border border-green-200 px-2 pt-1 pb-1.5 rounded-md w-full text-center truncate shadow-sm">
                              OLLIE
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Hover Hint */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-800 text-white p-4 flex justify-between items-center">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                設定行程 ({selectedDateKey})
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-slate-700 p-1 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-3">類型</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setFormType('class')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      formType === 'class' 
                        ? 'border-blue-600 bg-blue-50 text-blue-600 font-bold' 
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full border border-current bg-current"></div>
                    上課
                  </button>
                  <button
                    onClick={() => setFormType('rest')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      formType === 'rest' 
                        ? 'border-red-500 bg-red-50 text-red-600 font-bold' 
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full border border-current bg-current"></div>
                    休息
                  </button>
                </div>
              </div>

              {/* People Selection - Only show if type is CLASS */}
              {formType === 'class' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-3">
                    選擇人員 <span className="text-xs text-gray-400">(可複選)</span>
                  </label>
                  <div className="space-y-3">
                    {/* CHARLES Option */}
                    <label 
                      className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        formPeople['CHARLES']
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input 
                        type="checkbox"
                        checked={formPeople['CHARLES']}
                        onChange={() => togglePerson('CHARLES')}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className={`ml-3 font-medium ${formPeople['CHARLES'] ? 'text-blue-700' : 'text-gray-600'}`}>
                        CHARLES
                      </span>
                      {formPeople['CHARLES'] && <Check className="w-5 h-5 ml-auto text-blue-600" />}
                    </label>

                    {/* OLLIE Option */}
                    <label 
                      className={`flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                        formPeople['OLLIE']
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input 
                        type="checkbox"
                        checked={formPeople['OLLIE']}
                        onChange={() => togglePerson('OLLIE')}
                        className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                      />
                      <span className={`ml-3 font-medium ${formPeople['OLLIE'] ? 'text-green-700' : 'text-gray-600'}`}>
                        OLLIE
                      </span>
                      {formPeople['OLLIE'] && <Check className="w-5 h-5 ml-auto text-green-600" />}
                    </label>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg text-center text-sm text-gray-500 border border-gray-100">
                  設定為「休息」時，月曆上將隱藏人員名稱。
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 flex gap-3">
              <button 
                onClick={handleClear}
                className="flex-1 px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                清除設定
              </button>
              <button 
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors font-bold"
              >
                儲存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarApp;
