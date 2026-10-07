import React, { useState } from 'react';

const FORM_1_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSe3yAllMXCs0SeLgxGVQ2If5QA-PCdQkA_-45zuR8AIpb9iDg/formResponse';
const FORM_2_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSe19DTsZ90UFaasbRvAUHuNwa59dJyqUtTlilxZ6b1gxzsesA/formResponse';

const ENTRY_NAME = 'entry.865449928'; // 성함
const ENTRY_PERIOD = 'entry.152449295'; // 차시
const ENTRY_FEEDBACK = 'entry.825535778'; // 의견
const ENTRY_ISSUE = 'entry.825244205'; // 돌발상황/보고

export default function FeedbackTracker({ initialPeriod = '', lang = "ko" }: { initialPeriod?: string, lang?: "ko"|"en" }) {
  const [feedback, setFeedback] = useState('');
  const [issue, setIssue] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  React.useEffect(() => {
    setSuccessMsg('');
    setErrorMsg('');
  }, [initialPeriod]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    if (!initialPeriod || !feedback) return;

    setIsSubmitting(true);
    try {
      const formData = new URLSearchParams();
      formData.append(ENTRY_NAME, `${lang === "ko" ? "선생님" : "Teacher"}`);
      formData.append(ENTRY_PERIOD, initialPeriod);
      formData.append(ENTRY_FEEDBACK, feedback);
      if (issue) {
        formData.append(ENTRY_ISSUE, issue);
      }

      const formUrl = FORM_1_URL;

      // no-cors fetch to Google Forms
      await fetch(formUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      setSuccessMsg(`${lang === "ko" ? `${initialPeriod}차시 피드백이 성공적으로 제출되었습니다.` : `Feedback for session ${initialPeriod} has been submitted successfully.`}`);
      setFeedback('');
      setIssue('');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(lang === "ko" ? "제출 중 오류가 발생했습니다. 다시 시도해주세요." : "An error occurred during submission. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-ink">
          {lang === "ko" ? <>{initialPeriod}차시 피드백 제출</> : <>Submit Feedback for Session {initialPeriod}</>}
        </h3>
        <span className="text-xs text-gray-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            {lang === "ko" ? "자동 연동" : "Auto-synced"}
        </span>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-1">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">{lang === "ko" ? "차시 *" : "Session *"}</label>
            <input
              type="text"
              value={lang === "ko" ? `${initialPeriod}차시` : `Session ${initialPeriod}`}
              disabled
              className="px-4 py-2 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>
        </div>
        
        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-sm font-medium text-gray-700">{lang === "ko" ? "본 차시에 대한 의견 *" : "Feedback for this session *"}</label>
          <textarea
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            placeholder={lang === "ko" ? "수업에 대한 의견을 자유롭게 남겨주세요." : "Please leave your feedback freely."}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-primary transition-all bg-gray-50 focus:bg-white resize-none min-h-[120px]"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">{lang === "ko" ? "돌발 상황/특이사항 (선택)" : "Issues/Special Notes (Optional)"}</label>
          <textarea
            value={issue}
            onChange={e => setIssue(e.target.value)}
            placeholder={lang === "ko" ? "보고해야 할 내용이나 특이사항이 있었다면 작성해주세요." : "Please report any issues or special notes here."}
            className="px-4 py-3 border border-gray-300 rounded-xl outline-none focus:border-primary transition-all bg-gray-50 focus:bg-white resize-none h-24"
          />
        </div>

        <div className="mt-2 text-right">
          <button 
            type="submit"
            disabled={!initialPeriod || !feedback || isSubmitting}
            className="px-8 py-3 bg-gray-800 text-white rounded-xl font-medium hover:bg-black transition-all disabled:opacity-50"
          >
            {isSubmitting ? (lang === "ko" ? "제출 중..." : "Submitting...") : (lang === "ko" ? "피드백 제출하기" : "Submit Feedback")}
          </button>
        </div>
      </form>
      
      {successMsg && <p className="mt-4 text-sm text-emerald-600 font-medium text-center">{successMsg}</p>}
      {errorMsg && <p className="mt-4 text-sm text-red-500 font-medium text-center">{errorMsg}</p>}
    </div>
  );
}
