import React, { useState } from 'react';

const FORM_ACTION_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdcRYud48BVZoqN9m7txUHSmowq31dP1LtOK7s2ebN5A7NL7w/formResponse';
const ENTRY_DATE = 'entry.1191977718';
const ENTRY_PERIOD = 'entry.2096987822';
const ENTRY_CLASS = 'entry.2114639522';
const ENTRY_NUMBER = 'entry.503586027';

export default function AttendanceTracker({ lang = "ko" }: { lang?: "ko"|"en" }) {
  const [date, setDate] = useState(() => {
    const today = new Date();
    // Default to YYYY-MM-DD format for consistency
    return `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
  });
  const [period, setPeriod] = useState('');
  const [absenteeNumber, setAbsenteeNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    if (!absenteeNumber || !date || !period) return;

    setIsSubmitting(true);
    try {
      const formData = new URLSearchParams();
      formData.append(ENTRY_DATE, date);
      formData.append(ENTRY_PERIOD, period);
      formData.append(ENTRY_CLASS, "해당없음");
      formData.append(ENTRY_NUMBER, absenteeNumber);

      // We use no-cors to bypass CORS errors for Google Forms. It will return an opaque response but submit successfully.
      await fetch(FORM_ACTION_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      setSuccessMsg(`${lang === "ko" ? `${absenteeNumber}번 결석생이 기록되었습니다.` : `Absentee number ${absenteeNumber} has been recorded.`}`);
      setAbsenteeNumber('');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(lang === "ko" ? "저장 중 오류가 발생했습니다." : "An error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-base text-ink">
          {lang === "ko" ? <>결석생 기록</> : <>Record Absentee</>}
        </h3>
        <span className="text-xs text-gray-500 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            {lang === "ko" ? "로그인 없이 연동됨" : "Synced without login"}
        </span>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xs font-medium text-gray-700 whitespace-nowrap w-12">{lang === "ko" ? "결석날짜" : "Date     "}</span>
            <input
              type="date"
              value={date}
              onChange={e => {
                setDate(e.target.value);
                setSuccessMsg('');
                setErrorMsg('');
              }}
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-primary transition-all bg-gray-50 focus:bg-white"
              required
              title={lang === "ko" ? "오늘 날짜" : "Today's Date"}
            />
          </div>
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xs font-medium text-gray-700 whitespace-nowrap w-12">{lang === "ko" ? "결석차시" : "Session  "}</span>
            <input
              type="number"
              value={period}
              onChange={e => {
                setPeriod(e.target.value);
                setSuccessMsg('');
                setErrorMsg('');
              }}
              placeholder={lang === "ko" ? "예: 1" : "e.g., 1"}
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-primary transition-all bg-gray-50 focus:bg-white"
              required
              min="1"
              max="15"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-700 whitespace-nowrap w-12">{lang === "ko" ? "번호" : "Number   "}</span>
          <div className="flex-1 flex gap-2">
            <input 
              type="text"
              value={absenteeNumber}
              onChange={e => {
                setAbsenteeNumber(e.target.value);
                setSuccessMsg('');
                setErrorMsg('');
              }}
              placeholder={lang === "ko" ? "예: 5" : "e.g., 5"}
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg outline-none focus:border-primary transition-all bg-gray-50 focus:bg-white"
              required
            />
            <button 
              type="submit"
              disabled={!absenteeNumber || !date || !period || isSubmitting}
              className="px-4 py-1.5 text-sm bg-gray-800 text-white rounded-lg font-medium hover:bg-black transition-all disabled:opacity-50 whitespace-nowrap"
            >
              {isSubmitting ? (lang === "ko" ? "기록 중" : "Recording") : (lang === "ko" ? "기록하기" : "Record")}
            </button>
          </div>
        </div>
      </form>
      
      {successMsg && <p className="mt-2 text-xs text-emerald-600 font-medium">{successMsg}</p>}
      {errorMsg && <p className="mt-2 text-xs text-red-500 font-medium">{errorMsg}</p>}
    </div>
  );
}

