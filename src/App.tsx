import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { motion } from 'motion/react';
import FeedbackTracker from './components/FeedbackTracker';
import AttendanceTracker from './components/AttendanceTracker';
import PDFViewer from './components/PDFViewer';
import { 
  Bot, 
  BookOpen, 
  Users, 
  ArrowRight, 
  Lightbulb, 
  HeartHandshake,
  Target,
  Sparkles,
  Globe,
  Milestone,
  ArrowLeft,
  FileText,
  ExternalLink,
  Presentation,
  Map,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  ShieldCheck,
  Scale,
  Brain,
  Compass,
  CheckCircle2,
  Quote
} from 'lucide-react';

const FadeIn = ({ children, delay = 0, className = "" }: { key?: React.Key, children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    className={className}
  >
    {children}
  </motion.div>
);

type ProjectType = 'CLAP' | 'CLO';

const CLAP_SESSIONS = [
  { 
    id: 1, 
    phase: 0, 
    title: "개요", 
    enTitle: "Overview", 
    desc: "CLAP 프로젝트 전체의 목표와 방향성을 확인합니다.", 
    enDesc: "Review the overall goals and direction of the CLAP project.", 
    color: "bg-emerald-50/50 group-hover:bg-emerald-50 border-emerald-100/50 hover:border-emerald-200/80", 
    docs: { plan: "/unitplan/clap_unitplan/K-CLAP(overview:13).pdf" },
    activities: [
      "CLAP 프로젝트 전체 로드맵 및 운영 방향 탐색",
      "교과 문해력과 AI 리터러시 연계 목표 공유"
    ]
  },
  { 
    id: 2, 
    phase: 1, 
    title: "1-2차시", 
    enTitle: "Sessions 1-2", 
    desc: "프로젝트 시작하기: 사회 문제 해결을 위한 인공지능", 
    enDesc: "Starting the project: AI for Solving Social Problems", 
    color: "bg-teal-50/50 group-hover:bg-teal-50 border-teal-100/50 hover:border-teal-200/80", 
    aiDimension: "Contextualization",
    alignment: "ED-AI Lit: 맥락화 (Contextualization)",
    docs: { plan: "/unitplan/clap_unitplan/K-CLAP(1-2:13).pdf", worksheet: "/worksheet/CLAP_worksheet (1-2).pdf", ppt: "https://docs.google.com/presentation/d/1qgS3PUJhvLxVSUhcKHWkkrU5XwQAd1PVQdd9JILvEpM/preview" },
    activities: [
      "프로젝트 목표 이해: 사회 문제 해결을 위한 인공지능 (AI for Solving Social Problems)",
      "실세계 문제 해결을 위한 바이브 코딩 (Vibe Coding for real world problems) 기획",
      "실생활 탐구 모둠 구성 및 프로젝트 진행 규칙 수립"
    ]
  },
  { 
    id: 3, 
    phase: 2, 
    title: "3-4차시", 
    enTitle: "Sessions 3-4", 
    desc: "주장하는 글 읽기: 인공지능과 함께하는 독해 및 질문", 
    enDesc: "Reading persuasive texts: Reading with AI", 
    color: "bg-green-50/50 group-hover:bg-green-50 border-green-100/50 hover:border-green-200/80", 
    aiDimension: "Knowledge",
    alignment: "ED-AI Lit: 지식 (Knowledge)",
    docs: { plan: "/unitplan/clap_unitplan/K-CLAP(3-4:13).pdf", worksheet: "/worksheet/CLAP_worksheet (3-4).pdf", ppt: "https://docs.google.com/presentation/d/1RgfQ8L7g-fxDL0sz3NuijMFBKLmwXPaqnfWYDdB5hAc/preview" },
    activities: [
      "인공지능의 기본 원리 학습 (AI for Oceans 머신러닝 학습)",
      "주장하는 글 심층 독해 (Reading argumentative essays)",
      "생성형 AI 질문법: 효과적인 프롬프트 작성 (Prompt writing)",
      "읽은 글에 대해 AI에게 질문하고 심층 탐구하기 (Asking AI questions)"
    ]
  },
  { 
    id: 4, 
    phase: 2, 
    title: "5차시", 
    enTitle: "Session 5", 
    desc: "민주주의에서 미디어의 역할 알기 & AI 윤리", 
    enDesc: "The Role of Media in a Democracy & AI Ethics", 
    color: "bg-lime-50/50 group-hover:bg-lime-50 border-lime-100/50 hover:border-lime-200/80", 
    aiDimension: "Ethics",
    alignment: "ED-AI Lit: 윤리 (Ethics)",
    docs: { plan: "/unitplan/clap_unitplan/K-CLAP(5:13).pdf", worksheet: "/worksheet/CLAP worksheet (5).pdf", ppt: "https://docs.google.com/presentation/d/15GycQ0zWEPWBPXYuygHBi0XWY0NIdJsHmqv2x6Xy-p8/preview" },
    activities: [
      "민주주의와 미디어에 대한 설명글 읽기 (Reading informational text about democracy and media)",
      "미디어 에티켓 및 인공지능 윤리(공정성·투명성·개인정보 보호) 탐구",
      "디지털 정보 생산자로서의 도덕적 책임 토론"
    ]
  },
  { 
    id: 5, 
    phase: 2, 
    title: "6차시", 
    enTitle: "Session 6", 
    desc: "미디어의 내용을 비판적으로 읽기 & 옆으로 읽기", 
    enDesc: "Reading Media contents critically & Lateral Reading", 
    color: "bg-cyan-50/50 group-hover:bg-cyan-50 border-cyan-100/50 hover:border-cyan-200/80", 
    aiDimension: "Evaluation",
    alignment: "ED-AI Lit: 비판적 평가 (Evaluation)",
    docs: { plan: "/unitplan/clap_unitplan/K-CLAP(6:13).pdf", worksheet: "/worksheet/CLAP worksheet (6).pdf", ppt: "https://docs.google.com/presentation/d/16yPCh4HY4aPtnPUkvZ0E_FmypAS-7Saw5GJcERTIaaI/preview" },
    activities: [
      "온라인 정보와 AI 생성 정보의 비교 및 식별 (Online vs AI generated info)",
      "옆으로 읽기(Lateral Reading)를 통한 정보 신뢰성 교차 검증 및 팩트체크",
      "AI 산출물의 강점, 한계점 및 잠재적 편향(Biases) 비판적 진단"
    ]
  },
  { 
    id: 6, 
    phase: 3, 
    title: "7차시", 
    enTitle: "Session 7", 
    desc: "사회 문제 해결을 위한 계획 세우기 (AI 협업)", 
    enDesc: "Making a plan to solve a local problem (AI Collaboration)", 
    color: "bg-sky-50/50 group-hover:bg-sky-50 border-sky-100/50 hover:border-sky-200/80", 
    aiDimension: "Collaboration",
    alignment: "ED-AI Lit: 협업 및 소통 (Collaboration)",
    docs: { plan: "/unitplan/clap_unitplan/K-CLAP(7:13).pdf", worksheet: "/worksheet/CLAP worksheet (7).pdf", ppt: "https://docs.google.com/presentation/d/1sFm6zvWxN74MwQyQIMBi3mA1NDNpE1-ge1uwwemLGpU/preview" },
    activities: [
      "해결하고 싶은 지역 사회 이슈 선정 (Selecting a local issue)",
      "AI를 지원 도구로 활용한 지역 이슈 탐색 및 브레인스토밍 (AI assisted searching)",
      "AI와 협력하여 주장하는 글의 논리 구조와 개요 설계 (Planning essay structure with AI)"
    ]
  },
  { 
    id: 7, 
    phase: 3, 
    title: "8-9차시", 
    enTitle: "Sessions 8-9", 
    desc: "주장하는 글 쓰기 (AI Free) & 출처 표기", 
    enDesc: "Writing persuasive texts (AI Free) & Citing Sources", 
    color: "bg-fuchsia-50/50 group-hover:bg-fuchsia-50 border-fuchsia-100/50 hover:border-fuchsia-200/80", 
    aiDimension: "Ethics",
    alignment: "올바른 인용 및 지적 윤리 (Ethics)",
    docs: { plan: "/unitplan/clap_unitplan/K-CLAP(8-9:13).pdf", worksheet: "/worksheet/CLAP worksheet (8-9).pdf", ppt: "https://docs.google.com/presentation/d/1a-i9lzwU-qdyMNwk7rgeBadLNbGeVzw6jT1J0KKoCLQ/preview" },
    activities: [
      "AI Free 글쓰기: AI 도구 없이 자신의 순수한 논리와 근거로 초안 작성",
      "올바른 출처 인용법(How to cite the sources) 학습 및 적용",
      "지역 사회 문제 해결을 위한 설득력 있는 논증 에세이 완성"
    ]
  },
  { 
    id: 8, 
    phase: 3, 
    title: "10-12차시", 
    enTitle: "Sessions 10-12", 
    desc: "AI를 활용해 글 점검하기 & 바이브 코딩 솔루션", 
    enDesc: "Revising texts with AI & Vibe coding", 
    color: "bg-rose-50/50 group-hover:bg-rose-50 border-rose-100/50 hover:border-rose-200/80", 
    aiDimension: "Autonomy",
    alignment: "ED-AI Lit: 주도성 (Autonomy)",
    docs: { plan: "/unitplan/clap_unitplan/K-CLAP(10-12:13).pdf", worksheet: "/worksheet/CLAP worksheet (10-12).pdf", ppt: "https://docs.google.com/presentation/d/1ED4D0DLvmLCxKvWiame90i1AOTYqhMDUmWywDA_Xqow/preview" },
    activities: [
      "동료 피드백 및 AI 피드백을 주도적으로 비교하여 글 퇴고 (Revising with AI)",
      "AI 제안을 무조건 수용하지 않고 주체적으로 취사선택하는 자기결정권 발휘",
      "지역 사회 문제 해결을 위한 바이브 코딩 (Vibe coding to solve local problems) 앱 제작"
    ]
  },
  { 
    id: 9, 
    phase: 4, 
    title: "13차시", 
    enTitle: "Session 13", 
    desc: "최종 프로젝트 발표회 & 결과물 전시", 
    enDesc: "Final showcase: Exhibition of Essays and Apps", 
    color: "bg-pink-50/50 group-hover:bg-pink-50 border-pink-100/50 hover:border-pink-200/80", 
    aiDimension: "Contextualization",
    alignment: "ED-AI Lit: 맥락화 (Contextualization)",
    docs: { plan: "/unitplan/clap_unitplan/K-CLAP(13:13).pdf" },
    activities: [
      "최종 프로젝트 성과물 전시 및 공유 (Final showcase)",
      "주장하는 글(에세이) 및 바이브 코딩 앱(웹사이트) 시연 및 발표",
      "동료 및 공동체 상호 피드백 나눔 및 프로젝트 성찰"
    ]
  }
];

const CLO_SESSIONS = [
  { 
    id: 101, 
    phase: 0, 
    title: "개요", 
    enTitle: "Overview", 
    desc: "CLO 프로젝트 전체의 목표와 방향성을 확인합니다.", 
    enDesc: "Review the overall goals and direction of the CLO project.", 
    color: "bg-blue-50/50 group-hover:bg-blue-50 border-blue-100/50 hover:border-blue-200/80", 
    docs: { plan: "/unitplan/clo_unitplan/K-CLO(overview:13).pdf" },
    activities: [
      "CLO 프로젝트 전체 목표 및 연간/학기 로드맵 확인",
      "교과 문해력 중심 심층 독서·작문 방향 탐색"
    ]
  },
  { 
    id: 102, 
    phase: 1, 
    title: "1-2차시", 
    enTitle: "Sessions 1-2", 
    desc: "프로젝트 시작하기: 시민 과학으로 사회 문제 해결", 
    enDesc: "Starting the project: Citizen science to solve Social Problems", 
    color: "bg-indigo-50/50 group-hover:bg-indigo-50 border-indigo-100/50 hover:border-indigo-200/80", 
    docs: { plan: "/unitplan/clo_unitplan/K-CLO(1-2:13).pdf", worksheet: "/worksheet/CLO_worksheet (1-2).pdf", ppt: "https://docs.google.com/presentation/d/1X22bbgZsSke-dQwZkhjux8xvZp0eBKVCBhR1ZHaVq8c/preview" },
    activities: [
      "프로젝트 목표 이해: 시민 과학으로 사회 문제 해결 (Citizen science to solve Social Problems)",
      "실세계 문제를 위한 시민 과학 참여 및 탐구 과제 설정"
    ]
  },
  { 
    id: 103, 
    phase: 2, 
    title: "3-4차시", 
    enTitle: "Sessions 3-4", 
    desc: "주장하는 글 읽기: 심화 독해 및 정보 검색", 
    enDesc: "Reading persuasive texts: Extended reading & internet search", 
    color: "bg-emerald-50/50 group-hover:bg-emerald-50 border-emerald-100/50 hover:border-emerald-200/80", 
    docs: { plan: "/unitplan/clo_unitplan/K-CLO(3-4:13).pdf", worksheet: "/worksheet/CLO worksheet (3-4).pdf", ppt: "https://docs.google.com/presentation/d/1qht_23nnxGk4DQC5NNAbv-AwM389BgIv9tGDYPiu7Pw/preview" },
    activities: [
      "주장하는 글 심층 독해 (Reading argumentative essays)",
      "심화 독해 시간 (Extended reading time)",
      "인터넷 검색 방법과 대상 학습 (How and what to search for on the internet)",
      "글에서 낯선 정보를 인터넷으로 검색하기"
    ]
  },
  { 
    id: 104, 
    phase: 2, 
    title: "5차시", 
    enTitle: "Session 5", 
    desc: "민주주의에서 미디어의 역할 알기 & 미디어 에티켓", 
    enDesc: "The Role of Media in a Democracy & Media Etiquette", 
    color: "bg-teal-50/50 group-hover:bg-teal-50 border-teal-100/50 hover:border-teal-200/80", 
    docs: { plan: "/unitplan/clo_unitplan/K-CLO(5:13).pdf", worksheet: "/worksheet/CLO worksheet (5).pdf", ppt: "https://docs.google.com/presentation/d/15WD9_Goz7sSn-Iju8yb7LzP9BNI4tnCgayy7LSgI5As/preview" },
    activities: [
      "민주주의와 미디어에 대한 설명글 읽기 (Reading informational text about democracy and media)",
      "미디어 에티켓 학습 및 실천"
    ]
  },
  { 
    id: 105, 
    phase: 2, 
    title: "6차시", 
    enTitle: "Session 6", 
    desc: "미디어의 내용을 비판적으로 읽기 & 옆으로 읽기", 
    enDesc: "Reading Media contents critically & Lateral Reading", 
    color: "bg-cyan-50/50 group-hover:bg-cyan-50 border-cyan-100/50 hover:border-cyan-200/80", 
    docs: { plan: "/unitplan/clo_unitplan/K-CLO(6:13).pdf", worksheet: "/worksheet/CLO worksheet (6).pdf", ppt: "https://docs.google.com/presentation/d/1ZH3tXa-YqooVpPoyfhT-9pBSKxUYCSMIcc9kO5M8jG0/preview" },
    activities: [
      "온라인 정보 탐색 및 평가",
      "옆으로 읽기(Lateral Reading)를 통한 정보의 신뢰성 교차 검증"
    ]
  },
  { 
    id: 106, 
    phase: 3, 
    title: "7차시", 
    enTitle: "Session 7", 
    desc: "사회 문제 해결을 위한 계획 세우기 (인터넷 탐색)", 
    enDesc: "Making a plan to solve a local problem (Web Search)", 
    color: "bg-orange-50/50 group-hover:bg-orange-50 border-orange-100/50 hover:border-orange-200/80", 
    docs: { plan: "/unitplan/clo_unitplan/K-CLO(7:13).pdf", worksheet: "/worksheet/CLO worksheet (7).pdf", ppt: "https://docs.google.com/presentation/d/1KT9JjcMQgxNHy349HhpsjIkR-b8niCsAxUaGKrv6LYo/preview" },
    activities: [
      "해결하고 싶은 지역 사회 이슈 선정 (Selecting a local issue)",
      "인터넷 검색을 통한 지역 이슈 심층 조사 (Searching the internet: local issues)",
      "주장하는 글의 논리 구조 및 개요 설계 (Planning essay structure)"
    ]
  },
  { 
    id: 107, 
    phase: 3, 
    title: "8-9차시", 
    enTitle: "Sessions 8-9", 
    desc: "주장하는 글 쓰기 & 출처 표기법", 
    enDesc: "Writing persuasive texts & Citing sources", 
    color: "bg-amber-50/50 group-hover:bg-amber-50 border-amber-100/50 hover:border-amber-200/80", 
    docs: { plan: "/unitplan/clo_unitplan/K-CLO(8-9:13).pdf", worksheet: "/worksheet/CLO worksheet (8-9).pdf", ppt: "https://docs.google.com/presentation/d/1H1YIHu-ZYx_5DofO3lSWU4aXrEqLot0SKEyjkqbEl_0/preview" },
    activities: [
      "올바른 출처 표기법(How to cite the sources) 학습",
      "지역 사회 문제 해결을 위한 주장하는 글 작성"
    ]
  },
  { 
    id: 108, 
    phase: 3, 
    title: "10-12차시", 
    enTitle: "Sessions 10-12", 
    desc: "글 고쳐쓰기 & 지역 문제 해결 영상 제작", 
    enDesc: "Revising texts & Creating video", 
    color: "bg-yellow-50/50 group-hover:bg-yellow-50 border-yellow-100/50 hover:border-yellow-200/80", 
    docs: { plan: "/unitplan/clo_unitplan/K-CLO(10-12:13).pdf", worksheet: "/worksheet/CLO worksheet (10-12).pdf", ppt: "https://docs.google.com/presentation/d/1Un_27NA9jFreOoFRIJzgxTJLtH6fKOIXb_7DTmc6qMo/preview" },
    activities: [
      "심화 동료 피드백 및 글 고쳐쓰기 (Extended peer review and revising)",
      "지역 문제 해결을 위한 동영상 콘텐츠 제작 (Creating video to solve local problems)"
    ]
  },
  { 
    id: 109, 
    phase: 4, 
    title: "13차시", 
    enTitle: "Session 13", 
    desc: "프로젝트 결과 발표회 & 영상 시연", 
    enDesc: "Final showcase: Exhibition of Essays and Videos", 
    color: "bg-purple-50/50 group-hover:bg-purple-50 border-purple-100/50 hover:border-purple-200/80", 
    docs: { plan: "/unitplan/clo_unitplan/K-CLO(13:13).pdf" },
    activities: [
      "최종 프로젝트 발표회 (Final showcase)",
      "프로젝트 성과물 전시: 주장하는 글 & 제작 영상 시연 (Exhibition: Essays and Videos)"
    ]
  }
];

type ViewState = 'landing' | 'schedule' | { type: 'session', sessionId: number };

function SessionCard({ session, onView, lang }: { key?: React.Key, session: any, onView: (view: ViewState) => void, lang: "ko"|"en" }) {
  return (
    <button 
      onClick={() => onView({ type: 'session', sessionId: session.id })} 
      className={`w-full text-left p-4 rounded-xl border shadow-sm hover:shadow-md hover:scale-[1.01] transition-all group ${session.color}`}
    >
      <div className="relative z-10 flex items-center justify-between gap-3">
        <div className="flex-1 flex flex-col gap-1 overflow-hidden">
          {/* Main top line: Title and Description */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 overflow-hidden">
            <span className="font-bold text-ink text-lg whitespace-nowrap shrink-0">{lang === 'ko' ? session.title : session.enTitle}</span>
            <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0"></div>
            <p className="text-base font-medium text-gray-600 truncate">{lang === 'ko' ? session.desc : session.enDesc}</p>
          </div>

          {/* Bottom line: AI icon + English dimension name ONLY */}
          {session.aiDimension && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mt-0.5">
              <Bot size={14} className="text-primary shrink-0" />
              <span>{session.aiDimension}</span>
            </div>
          )}
        </div>

        {/* Right arrow (활동 n개 삭제됨) */}
        <div className="flex items-center gap-2 shrink-0">
          <ArrowRight size={20} className="text-gray-400 group-hover:text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0" />
        </div>
      </div>
    </button>
  );
}

function SessionDetail({ lang, 
  project,
  session, 
  onBack,
  onNavigate,
  hasPrev,
  hasNext
}: { 
  lang: "ko"|"en",
  project: ProjectType,
  session: any, 
  onBack: () => void,
  onNavigate: (direction: 'prev' | 'next') => void,
  hasPrev: boolean,
  hasNext: boolean
}) {
  const [activeDoc, setActiveDoc] = useState<'plan' | 'worksheet' | 'ppt'>('plan');
  
  const currentUrl = session.docs[activeDoc] || "";

  return (
    <div className="flex flex-col h-screen bg-bg">
      <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-white border-b border-gray-200 shrink-0 shadow-sm relative z-10">
        <div className="flex items-center gap-1 sm:gap-2">
          <button 
            onClick={onBack}
            className="hidden sm:flex items-center gap-2 font-bold text-xl tracking-tighter text-primary mr-2 hover:opacity-80 transition-opacity"
            title={lang === "ko" ? "본 페이지로 돌아가기" : "Back to Main Project"}
          >
            {project}
          </button>
          
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-ink font-medium px-2 sm:px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
            title={lang === "ko" ? "목록으로 돌아가기" : "Back to List"}
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">{lang === "ko" ? "돌아가기" : "Back"}</span>
          </button>
          
          <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>
          
          <button
            onClick={() => onNavigate('prev')}
            disabled={!hasPrev}
            className={`p-2 rounded-xl transition-colors ${!hasPrev ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-ink hover:bg-gray-100'}`}
            title={lang === "ko" ? "이전 차시" : "Previous Session"}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => onNavigate('next')}
            disabled={!hasNext}
            className={`p-2 rounded-xl transition-colors ${!hasNext ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-ink hover:bg-gray-100'}`}
            title={lang === "ko" ? "다음 차시" : "Next Session"}
          >
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="font-bold text-lg text-ink truncate max-w-[50vw]">
          {session.title}
        </div>
        <div className="flex flex-row gap-2">
           {currentUrl && activeDoc === 'ppt' && (
             <a
               href={encodeURI(currentUrl)}
               target="_blank"
               rel="noreferrer"
               className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors"
             >
               {lang === "ko" ? "새 탭으로 열기" : "Open in new tab"}
               <ExternalLink size={16} />
             </a>
           )}
        </div>
      </header>
      
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        <div className="flex-1 relative flex flex-col bg-[#F1F3F4] lg:border-r border-gray-200 lg:h-full h-[40vh] min-h-[350px] lg:min-h-0 shrink-0 lg:shrink">
           {currentUrl ? (
             activeDoc === 'ppt' ? (
               <>
                 <div className={`${project === 'CLO' ? 'bg-blue-50/80 text-blue-700 border-blue-100' : 'bg-emerald-50/80 text-emerald-700 border-emerald-100'} backdrop-blur-sm text-[13px] px-4 py-2 border-b flex items-center justify-between shrink-0 absolute top-0 left-0 right-0 z-10 w-full transition-opacity hover:opacity-100 opacity-90`}>
                   <span className="truncate mr-4">{lang === "ko" ? "화면이 보이지 않나요? 문서 보안 정책 때문일 수 있습니다. (구글 프레젠테이션)" : "Can't see the screen? It might be blocked by document security policies (e.g., Google Slides)."}</span>
                   <a href={encodeURI(currentUrl)} target="_blank" rel="noreferrer" className={`font-bold underline whitespace-nowrap shrink-0 ${project === 'CLO' ? 'hover:text-blue-800' : 'hover:text-emerald-800'}`}>{lang === "ko" ? "새 탭에서 바로 열기" : "Open directly in new tab"}</a>
                 </div>
                 <iframe 
                   src={currentUrl} 
                   className="w-full h-full border-none bg-white flex-1 relative z-0 pt-10"
                   title={`${session.title} ${activeDoc}`}
                   allowFullScreen
                 />
               </>
             ) : (
               <PDFViewer 
                 url={currentUrl} 
                 title={`${session.title} - ${activeDoc === 'plan' ? (lang === 'ko' ? '지도안' : 'Lesson Plan') : (lang === 'ko' ? '워크시트' : 'Worksheet')}`}
                 lang={lang}
               />
             )
           ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-white m-0">
               <FileText size={48} className="mb-4 opacity-30" />
               <p className="font-medium">{lang === "ko" ? "준비 중인 문서입니다." : "This document is being prepared."}</p>
             </div>
           )}
        </div>
        
        <div className="w-full lg:w-[480px] xl:w-[560px] bg-white flex flex-col h-[60vh] lg:h-full overflow-y-auto shrink-0 shadow-[-4px_0_24px_rgba(0,0,0,0.02)] z-10">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-lg mb-4 text-ink">{lang === "ko" ? "학습 자료" : "Learning Materials"}</h3>
            <div className="grid grid-cols-3 gap-3">
               <button 
                 onClick={() => setActiveDoc('plan')}
                 disabled={!session.docs.plan}
                 className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                   !session.docs.plan ? 'opacity-50 cursor-not-allowed bg-gray-50 text-gray-400 border-gray-100' :
                   activeDoc === 'plan' ? `border-primary text-primary shadow-sm ${project === 'CLO' ? 'bg-blue-50' : 'bg-emerald-50'}` : 'border-gray-200 hover:border-gray-300 text-gray-500 hover:text-ink bg-white'}`}
               >
                 <Map size={24} className="mb-2" />
                 <span className="text-xs font-bold">{lang === "ko" ? "지도안" : "Plan"}</span>
               </button>
               <button 
                 onClick={() => setActiveDoc('ppt')}
                 disabled={!session.docs.ppt}
                 className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                   !session.docs.ppt ? 'opacity-50 cursor-not-allowed bg-gray-50 text-gray-400 border-gray-100' :
                   activeDoc === 'ppt' ? `border-primary text-primary shadow-sm ${project === 'CLO' ? 'bg-blue-50' : 'bg-emerald-50'}` : 'border-gray-200 hover:border-gray-300 text-gray-500 hover:text-ink bg-white'}`}
               >
                 <Presentation size={24} className="mb-2" />
                 <span className="text-xs font-bold">PPT</span>
               </button>
               <button 
                 onClick={() => setActiveDoc('worksheet')}
                 disabled={!session.docs.worksheet}
                 className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                   !session.docs.worksheet ? 'opacity-50 cursor-not-allowed bg-gray-50 text-gray-400 border-gray-100' :
                   activeDoc === 'worksheet' ? `border-primary text-primary shadow-sm ${project === 'CLO' ? 'bg-blue-50' : 'bg-emerald-50'}` : 'border-gray-200 hover:border-gray-300 text-gray-500 hover:text-ink bg-white'}`}
               >
                 <FileText size={24} className="mb-2" />
                 <span className="text-xs font-bold">{lang === "ko" ? "워크시트" : "Worksheet"}</span>
               </button>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100">
               <h4 className="font-bold text-sm text-primary mb-2 flex items-center gap-2">
                 <Target size={16} /> {lang === "ko" ? "학습 목표" : "Learning Objectives"}
               </h4>
               <p className="text-gray-700 text-sm leading-relaxed mb-4">{session.desc}</p>

               {session.activities && session.activities.length > 0 && (
                 <div className="mt-4 p-4 rounded-2xl bg-primary/5 border border-primary/20">
                   <div className="flex items-center justify-between mb-2.5">
                     <h5 className="font-bold text-xs uppercase tracking-wider text-ink flex items-center gap-1.5">
                       <Sparkles size={14} className="text-primary" />
                       {lang === "ko" ? "차시별 주요 수업 활동" : "Key Lesson Activities"}
                     </h5>
                     {session.alignment && (
                       <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white text-primary border border-primary/20 shadow-2xs">
                         {session.alignment}
                       </span>
                     )}
                   </div>
                   <ul className="space-y-2 text-xs text-slate-700">
                     {session.activities.map((act: string, idx: number) => (
                       <li key={idx} className="flex items-start gap-2 leading-relaxed">
                         <span className="text-primary font-bold mt-0.5">•</span>
                         <span>{act}</span>
                       </li>
                     ))}
                   </ul>
                 </div>
               )}
            </div>
          </div>
          
          <div className="flex-1 flex flex-col bg-gray-50/50 relative min-h-[400px]">
             <div className="p-6 pt-2 pb-0">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col mb-4">
                   <h3 className="font-bold text-lg text-ink mb-2">{lang === "ko" ? "녹음파일 제출" : "Submit Audio Record"}</h3>
                   <p className="text-sm text-gray-600 mb-4">{lang === "ko" ? "수업 녹음파일을 구글 폼을 통해 제출해주세요." : "Please submit class recordings via Google Forms."}</p>
                   <a
                     href="https://docs.google.com/forms/d/e/1FAIpQLSdg3yuHxKY6ixgKwSqHDCikbHpwL-dTbhX6waK8Ti3wDXGy1Q/viewform?usp=header"
                     target="_blank"
                     rel="noreferrer"
                     className="flex items-center justify-center gap-2 w-full py-3 bg-gray-100 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-200 hover:text-gray-900 transition-colors"
                   >
                     <ExternalLink size={18} />
                     {lang === "ko" ? "구글 폼으로 녹음파일 제출 열기" : "Open Google Form for submission"}
                   </a>
                </div>
             </div>
             <div className="p-6 pt-0 pb-6 flex-1">
                <FeedbackTracker initialPeriod={session.title.match(/(\d+)/)?.[1] || ''} lang={lang} />
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Portal({ onSelectProject, lang, setLang }: { onSelectProject: (p: ProjectType) => void, lang: "ko"|"en", setLang: (l: "ko"|"en") => void }) {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6 lg:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-white to-white">
      <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-gray-100 text-center relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#10b981] to-[#155dfc]"></div>
        <div className="absolute top-4 right-6 flex gap-2">
          <button type="button" onClick={() => setLang('ko')} className={`text-sm font-bold ${lang === 'ko' ? 'text-gray-800' : 'text-gray-400'}`}>KOR</button>
          <span className="text-gray-300">|</span>
          <button type="button" onClick={() => setLang('en')} className={`text-sm font-bold ${lang === 'en' ? 'text-gray-800' : 'text-gray-400'}`}>ENG</button>
        </div>
        
        <div className="mb-8 mt-4">
          <h1 className="text-3xl font-bold mb-3 tracking-tight text-ink">{lang === 'ko' ? '프로젝트 선택' : 'Select Project'}</h1>
          <p className="text-gray-500 font-medium">{lang === "ko" ? "참여할 프로젝트를 선택해주세요." : "Please select a project."}</p>
        </div>
        
        <div className="flex flex-col gap-4 w-full">
          <button 
            onClick={() => onSelectProject('CLAP')} 
            className="w-full bg-gradient-to-br from-[#10b981] to-[#0ea5e9] text-white font-bold text-xl py-6 rounded-2xl hover:from-[#047857] hover:to-[#0284c7] transition-all hover:shadow-lg hover:shadow-emerald-500/30"
          >
            CLAP Project
          </button>
          <button 
            onClick={() => onSelectProject('CLO')} 
            className="w-full bg-gradient-to-br from-[#155dfc] to-[#10b981] text-white font-bold text-xl py-6 rounded-2xl hover:from-[#0045d8] hover:to-[#047857] transition-all hover:shadow-lg hover:shadow-blue-500/30"
          >
            CLO Project
          </button>
        </div>
      </div>
    </div>
  );
}

const EDAI_FRAMEWORK_DIMENSIONS = [
  {
    id: 'knowledge',
    title: 'Knowledge',
    koTitle: '지식',
    icon: Brain,
    iconColor: 'bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-100',
    activityBg: 'bg-sky-50/70 border-sky-200 text-sky-950',
    badge: 'CLAP 3-4차시 연계',
    sessionId: 3,
    definition: 'To gain an understanding of how AI technologies work.',
    koDesc: '인공지능의 기본 원리와 머신러닝 학습 메커니즘, 기술 작동 방식을 종합적으로 이해합니다.',
    summary: '기술 원리 및 데이터 이해',
    activityExamples: [
      'AI 원리 탐구: AI for Oceans를 활용한 머신러닝 분류 및 모델 학습 원리 실습',
      '프롬프트 작성 훈련: 생성형 AI에게 효과적으로 질문하고 요청하는 프롬프트 작성법 익히기',
      '글에 대한 AI 질의: 읽은 주장하는 글의 주요 내용에 대해 AI에게 능동적으로 질문하며 심층 독해'
    ],
    enActivityExamples: [
      'AI Principles: Hands-on machine learning classification and training via AI for Oceans',
      'Prompt Writing: Learning effective prompt writing to ask questions to Gen AI',
      'AI Inquiry: Asking AI questions about read argumentative essays for deeper comprehension'
    ]
  },
  {
    id: 'evaluation',
    title: 'Evaluation',
    koTitle: '비판적 평가',
    icon: Scale,
    iconColor: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    activityBg: 'bg-indigo-50/70 border-indigo-200 text-indigo-950',
    badge: 'CLAP 6차시 연계',
    sessionId: 5,
    definition: 'To develop the ability to critically judge AI technologies.',
    koDesc: 'AI의 강점, 한계점, 잠재적 편향성(Strengths, limitations, biases)을 비판적 시각에서 평가합니다.',
    summary: '비판적 분석 및 한계 검증',
    activityExamples: [
      '온라인 정보 vs AI 생성 정보 비교: 사람이 작성한 온라인 정보와 AI 생성 텍스트의 차이점 및 신뢰도 분석',
      '옆으로 읽기(Lateral Reading): 다른 신뢰할 수 있는 탭과 출처를 열어 정보의 사실 여부 교차 검증 및 팩트체크',
      '편향·한계 진단: AI 응답의 환각(Hallucination), 오류 가능성 및 잠재적 편향을 비판적으로 판별'
    ],
    enActivityExamples: [
      'Online vs AI Info: Comparing human-written online texts with AI-generated contents',
      'Lateral Reading: Evaluating information credibility across authoritative tabs',
      'Critique & Biases: Checking AI outputs for potential hallucinations, biases, and accuracy'
    ]
  },
  {
    id: 'ethics',
    title: 'Ethics',
    koTitle: '윤리',
    icon: ShieldCheck,
    iconColor: 'bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-100',
    activityBg: 'bg-rose-50/70 border-rose-200 text-rose-950',
    badge: 'CLAP 5차시 / 8-9차시 연계',
    sessionId: 4,
    definition: 'To recognize and address moral issues related to AI technologies.',
    koDesc: '공정성, 책임성, 투명성, 개인정보 보호(Fairness, accountability, privacy) 등 윤리적 가치를 내면화합니다.',
    summary: '사회적 책임 및 도덕적 기준',
    activityExamples: [
      '미디어의 사회적 역할 탐구: 민주주의 사회에서 미디어와 인공지능이 미치는 영향력 이해',
      '미디어 에티켓 및 AI 윤리: 책임감 있는 AI 활용 규범과 개인정보 보호, 공정성 실천',
      '정직한 출처 표기(How to cite): AI 도구의 도움을 받은 글쓰기에서 투명한 출처 표기 및 저작권 존중'
    ],
    enActivityExamples: [
      'Democracy & Media: Reading informational texts about media and AI influence on society',
      'AI Ethics & Etiquette: Practicing media etiquette, responsible AI use, and privacy protection',
      'Citing Sources: Learning and applying scholarly citation standards when using AI tools'
    ]
  },
  {
    id: 'contextualization',
    title: 'Contextualization',
    koTitle: '맥락화',
    icon: Compass,
    iconColor: 'bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-100',
    activityBg: 'bg-amber-50/70 border-amber-200 text-amber-950',
    badge: 'CLAP 1-2차시 & 13차시 연계',
    sessionId: 2,
    definition: 'To understand how to use AI as a tool in real-world settings.',
    koDesc: '실제 사회적 문제와 실생활 맥락 속에서 당면 과제를 해결하는 유용한 도구로 AI를 활용합니다.',
    summary: '실생활 문제 해결 도구',
    activityExamples: [
      '사회 문제 해결 프로젝트 이해: 실생활 문제를 해결하기 위한 도구로서 AI의 필요성과 프로젝트 목표 설정 (1-2차시)',
      '실세계 바이브 코딩: 지역 공동체의 실질적 문제 해결을 위한 바이브 코딩(Vibe Coding) 기획 및 착수',
      '최종 성과물 전시(Final showcase): 작성한 주장하는 글과 바이브 코딩 웹앱(사이트)을 지역 사회에 전시 및 공유 (13차시)'
    ],
    enActivityExamples: [
      'Social Problem Solving: Understanding AI as a purposeful tool for community challenges',
      'Vibe Coding: Initiating Vibe Coding tailored for addressing real-world community issues',
      'Final Showcase: Exhibition of argumentative essays and Vibe-coded apps/sites'
    ]
  },
  {
    id: 'collaboration',
    title: 'Collaboration',
    koTitle: '협업 및 소통',
    icon: Users,
    iconColor: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    activityBg: 'bg-emerald-50/70 border-emerald-200 text-emerald-950',
    badge: 'CLAP 7차시 연계',
    sessionId: 6,
    definition: 'To develop skills for effective communication and collaboration with AI systems and individuals.',
    koDesc: 'AI 시스템과의 상호작용뿐 아니라, AI를 매개로 동료 및 다른 사람들과 효과적으로 협력하고 소통합니다.',
    summary: '인간-AI 및 동료 간 시너지',
    activityExamples: [
      '지역 사회 문제 선정 토론: 모둠원과 함께 해결하고자 하는 우리 지역 공동체의 핵심 이슈 선정',
      'AI 지원 정보 탐색: AI를 브레인스토밍 및 심층 정보 조사 파트너로 활용',
      'AI 협력 에세이 구조화: AI와 대화하며 설득력 있는 주장하는 글의 논리 구조와 개요 협력적 설계'
    ],
    enActivityExamples: [
      'Selecting Local Issue: Selecting a community problem through peer dialogue',
      'AI Assisted Searching: Conducting AI-assisted searching on specific local issues and facts',
      'Planning with AI: Planning the structure and argumentation of the essay in synergy with AI'
    ]
  },
  {
    id: 'autonomy',
    title: 'Autonomy',
    koTitle: '주도성',
    icon: Target,
    iconColor: 'bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-100',
    activityBg: 'bg-teal-50/70 border-teal-200 text-teal-950',
    badge: 'CLAP 10-12차시 연계',
    sessionId: 8,
    definition: 'To develop self-determination in actions and decision-making when interacting with AI.',
    koDesc: 'AI에 맹목적으로 의존하지 않고, 자신의 생각과 주도적인 판단에 따라 주체적으로 의사결정을 내립니다.',
    summary: '주체적 의사결정 및 자기결정권',
    activityExamples: [
      '주체적 글 퇴고: 동료 피드백과 AI 제안을 비판적으로 선별·비교하여 글 수정 반영 (Revising with AI)',
      '문제 해결 바이브 코딩 솔루션 제작: 자기 주도적 의사결정으로 지역 문제 해결 웹앱/프로그램 직접 구현',
      '자기결정권(Self-determination) 발휘: AI 산출물의 수용 여부를 스스로 판단하며 주체적 학습 주도권 유지'
    ],
    enActivityExamples: [
      'Revising with AI: Critically selecting and applying peer and AI feedback to revise essays',
      'Vibe Coding Solution: Vibe coding to build practical apps solving chosen local problems',
      'Self-Determination: Exercising autonomous judgment without blind reliance on AI suggestions'
    ]
  }
];

function ProjectApp({ project, onLogout, lang, setLang }: { project: ProjectType, onLogout: () => void, lang: "ko"|"en", setLang: (l: "ko"|"en") => void }) {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [todaySchedule, setTodaySchedule] = useState<string | null>(null);
  const [tomorrowSchedule, setTomorrowSchedule] = useState<string | null>(null);
  const [expandedFrameworks, setExpandedFrameworks] = useState<Record<string, boolean>>({});
  const [selectedFrameworkModal, setSelectedFrameworkModal] = useState<any | null>(null);
  const SESSIONS = project === 'CLAP' ? CLAP_SESSIONS : CLO_SESSIONS;

  const toggleFramework = (id: string) => {
    setExpandedFrameworks(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAllFrameworks = (expand: boolean) => {
    const next: Record<string, boolean> = {};
    EDAI_FRAMEWORK_DIMENSIONS.forEach(d => {
      next[d.id] = expand;
    });
    setExpandedFrameworks(next);
  };

  useEffect(() => {
    fetch('https://docs.google.com/spreadsheets/d/1-2i5QcMz56KAjgMKj8rfiN-nLPJI7oIQqE-u9612ubg/export?format=csv&gid=122908317')
      .then(r => r.text())
      .then(csvText => {
        Papa.parse(csvText, {
          complete: (results) => {
            const data = results.data as string[][];
            
            const findScheduleForDate = (date: Date) => {
              const dateStr = `${date.getMonth() + 1}/${date.getDate()}`; // e.g. "5/20"
              const dateStrWithZero = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
              
              let foundCol = -1;
              let foundRowIndex = -1;

              // Find the date column and row
              for (let i = 0; i < data.length; i++) {
                if (!data[i] || data[i].length === 0) continue;
                for (let j = 1; j < data[i].length; j++) {
                  const cell = data[i][j];
                  const isMatch = (str: string, target: string) => str === target || str.startsWith(target + '/') || str.startsWith(target + ' ') || str.startsWith(target + '(');
                  if (typeof cell === 'string' && (isMatch(cell, dateStr) || isMatch(cell, dateStrWithZero))) {
                    // Make sure it looks like a date row (starts with week name or 프로젝트)
                    if (data[i][0] && (data[i][0].includes('주간') || data[i][0].includes('프로젝트'))) {
                      foundCol = j;
                      foundRowIndex = i;
                      break;
                    }
                  }
                }
                if (foundCol !== -1) break;
              }

              if (foundCol !== -1 && foundRowIndex !== -1) {
                const classPrefix = "6-"; // fallback
                const sessionsFound: string[] = [];
                
                // Scan the periods below the date row
                for (let i = foundRowIndex + 1; i < data.length; i++) {
                  if (data[i][0] && (data[i][0].includes('주간') || data[i][0].includes('프로젝트'))) {
                    break; // next date row
                  }
                  const cell = data[i][foundCol];
                  if (typeof cell === 'string' && cell.includes(classPrefix)) {
                    // extract the text in parenthesis or right after
                    const regex = new RegExp(`${classPrefix}\\s*\\(([^)]+)\\)(?:\\s*차시)?`);
                    const match = cell.match(regex);
                    if (match && match[1]) {
                      let sessionText = match[1];
                      if (!sessionText.includes('차시') && cell.match(new RegExp(`${classPrefix}\\s*\\([^)]+\\)\\s*차시`))) {
                        sessionText += '차시';
                      } else if (!sessionText.includes('차시')) {
                        sessionText += '차시';
                      }
                      sessionsFound.push(`${data[i][0].substring(0, 3)}에 ${sessionText}`);
                    } else {
                      sessionsFound.push(`${data[i][0].substring(0, 3)}에 관련 일정(${cell})`);
                    }
                  }
                }

                if (sessionsFound.length > 0) {
                  return sessionsFound.join(', ');
                } else {
                  return '없음';
                }
              } else {
                return '없음';
              }
            };
            
            const today = new Date();
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);

            setTodaySchedule(findScheduleForDate(today));
            setTomorrowSchedule(findScheduleForDate(tomorrow));
          }
        });
      })
      .catch(e => console.error("Failed to load schedule:", e));
  }, []);

  if (currentView === 'schedule') {
    return (
      <div className="flex flex-col h-screen bg-bg">
        <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-white border-b border-gray-200 shrink-0 shadow-sm relative z-10">
          <div className="flex items-center gap-1 sm:gap-2">
            <button 
              onClick={() => setCurrentView('landing')}
              className="hidden sm:flex items-center gap-2 font-bold text-xl tracking-tighter text-primary mr-2 hover:opacity-80 transition-opacity"
              title={lang === "ko" ? "본 페이지로 돌아가기" : "Back to Main Project"}
            >
              {project}
            </button>
            <button 
              onClick={() => setCurrentView('landing')}
              className="flex items-center gap-2 text-gray-600 hover:text-ink font-medium px-2 sm:px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
              title={lang === "ko" ? "목록으로 돌아가기" : "Back to List"}
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">{lang === "ko" ? "돌아가기" : "Back"}</span>
            </button>
          </div>
          <div className="font-bold text-lg text-ink truncate max-w-[50vw]">
            {lang === "ko" ? "수업 스케줄" : "Class Schedule"}
          </div>
          <div className="flex flex-row gap-2">
             <a
               href="https://docs.google.com/spreadsheets/d/1-2i5QcMz56KAjgMKj8rfiN-nLPJI7oIQqE-u9612ubg/edit?gid=122908317#gid=122908317"
               target="_blank"
               rel="noreferrer"
               className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors"
             >
               새 탭으로 열기
               <ExternalLink size={16} />
             </a>
          </div>
        </header>
        <main className="flex-1 bg-white relative">
          <iframe 
            src="https://docs.google.com/spreadsheets/d/1-2i5QcMz56KAjgMKj8rfiN-nLPJI7oIQqE-u9612ubg/edit?gid=122908317#gid=122908317" 
            className="w-full h-full border-none"
            title={lang === "ko" ? "수업 스케줄" : "Class Schedule"}
            allowFullScreen
          />
        </main>
      </div>
    );
  }

  if (typeof currentView === 'object' && currentView.type === 'session') {
    const currentIndex = SESSIONS.findIndex(s => s.id === currentView.sessionId);
    const session = SESSIONS[currentIndex];
    if (session) {
      return (
        <SessionDetail 
          lang={lang}
          project={project}
          session={session} 
          onBack={() => setCurrentView('landing')}
          onNavigate={(direction) => {
            if (direction === 'prev' && currentIndex > 0) {
              setCurrentView({ type: 'session', sessionId: SESSIONS[currentIndex - 1].id });
            } else if (direction === 'next' && currentIndex < SESSIONS.length - 1) {
              setCurrentView({ type: 'session', sessionId: SESSIONS[currentIndex + 1].id });
            }
          }}
          hasPrev={currentIndex > 0}
          hasNext={currentIndex < SESSIONS.length - 1}
        />
      );
    }
  }

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  const highlightSchedule = (schedule: string) => {
    return schedule.split(/(\d+(?:-\d+)?교시|\d+(?:-\d+)?차시)/g).map((part, i) => 
      part.match(/\d+(?:-\d+)?교시|\d+(?:-\d+)?차시/) ? 
        <span key={i} className="font-bold text-red-600">{part}</span> : 
        <span key={i}>{part}</span>
    );
  };

  return (
    <div 
      className="min-h-screen bg-bg text-ink selection:bg-primary selection:text-white"
    >
      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 font-bold text-2xl tracking-tighter hover:opacity-80 transition-opacity"
            >
              <span className="text-primary">{project}</span>
            </button>
            <button 
              onClick={onLogout}
              className="text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 transition-all px-3 py-1.5 rounded-lg border border-primary/20"
            >
              {lang === 'ko' ? '학급 변경' : 'Change Class'}
            </button>
            <div className="flex items-center gap-2 ml-2 bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-100">
               <button type="button" onClick={() => setLang('ko')} className={`text-xs font-bold ${lang === 'ko' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}>KOR</button>
               <span className="text-gray-300 text-xs">|</span>
               <button type="button" onClick={() => setLang('en')} className={`text-xs font-bold ${lang === 'en' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}>ENG</button>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600 items-center">
              <a href="#about" className="hover:text-primary transition-colors">{lang === "ko" ? "프로젝트 소개" : "About"}</a>
              <a href="#curriculum" className="hover:text-primary transition-colors">{lang === "ko" ? "커리큘럼" : "Curriculum"}</a>
              {project === 'CLAP' && (
                <a href="#pillars" className="hover:text-primary transition-colors">{lang === "ko" ? "프레임워크" : "Framework"}</a>
              )}
              <button className="hover:text-primary transition-colors">
                {lang === "ko" ? "도입문의" : "Contact Us"}
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="about" className="relative pt-32 pb-8 md:pt-40 md:pb-10 px-6 overflow-hidden">
        <div className={`absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${project === 'CLO' ? 'from-blue-50' : 'from-emerald-50'} via-white to-white`}></div>
        
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className={`inline-block py-1 px-3 rounded-full font-semibold text-xs mb-3 border ${project === 'CLO' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'}`}>
              {lang === "ko" ? "지식 이해를 넘어 지식을 실천하는 민주시민으로!" : "From understanding knowledge to practicing it as democratic citizens!"}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-2 lg:mb-4 leading-[1.1]">
              <span className="text-gradient font-extrabold pb-1 lg:pb-3 inline-block">{project} {lang === "ko" ? "프로젝트" : "Project"}</span>
            </h1>
            <p className="text-base md:text-xl lg:text-2xl text-gray-500 mb-6 lg:mb-8 tracking-tight font-medium max-w-4xl mx-auto leading-relaxed">
              {lang === 'ko' ? (
                 project === 'CLAP' ? (
                <>
                  <span className="relative inline-block z-10 font-bold text-gray-800">
                    <span className="absolute bottom-1.5 left-0 w-full h-3 bg-emerald-400/40 -z-10 -rotate-1 rounded-sm"></span>
                    교과 문해력
                  </span>과{' '}
                  <span className="relative inline-block z-10 font-bold text-gray-800">
                    <span className="absolute bottom-1.5 left-0 w-full h-3 bg-teal-400/40 -z-10 rotate-1 rounded-sm"></span>
                    AI 문해력
                  </span> 향상을 위한 프로젝트 기반 학습
                </>
              ) : (
                <>
                  <span className="relative inline-block z-10 font-bold text-gray-800">
                    <span className="absolute bottom-1.5 left-0 w-full h-3 bg-blue-400/40 -z-10 -rotate-1 rounded-sm"></span>
                    교과 문해력
                  </span> 향상을 위한 프로젝트 기반 학습
                </>
              )
              ) : (
                 project === 'CLAP' ? (
                    <>
                      <span className="font-bold">C</span>ontent Area <span className="font-bold">L</span>iteracy <span className="font-bold">a</span>nd <span className="font-bold">A</span>I Literacy through <span className="font-bold">P</span>roject Based Learning
                    </>
                 ) : (
                    <>
                      <span className="font-bold">C</span>ontent Area <span className="font-bold">L</span>iteracy <span className="font-bold">O</span>nly
                    </>
                 )
              )}
              {lang === 'ko' && (
                <>
                  <br className="hidden md:block" />
                  <span className="text-sm md:text-lg text-gray-400 font-normal mt-1.5 block">
                    (<span className="font-bold">C</span>ontent Area <span className="font-bold">L</span>iteracy {project === 'CLAP' ? <><span className="font-bold">a</span>nd <span className="font-bold">A</span>I Literacy through <span className="font-bold">P</span>roject Based Learning</> : <><span className="font-bold">O</span>nly</>})
                  </span>
                </>
              )}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button 
                onClick={() => setCurrentView('schedule')}
                className="h-10 px-6 text-sm rounded-full bg-white border-2 border-primary text-primary font-semibold flex items-center gap-2 hover:bg-primary hover:text-white transition-all w-full sm:w-auto justify-center"
              >
                {lang === "ko" ? "수업 스케줄" : "Class Schedule"}
              </button>
              <a href="#curriculum" className="h-10 px-6 text-sm rounded-full bg-primary text-white font-semibold flex items-center gap-2 hover:bg-primary-dark hover:-translate-y-0.5 transition-all w-full sm:w-auto justify-center shadow-lg shadow-primary/20">
                {lang === "ko" ? "커리큘럼 살펴보기" : "View Curriculum"}
              </a>
            </div>
            
            <div className={`mt-5 p-3 ${project === 'CLO' ? 'bg-blue-50/50 border-blue-100' : 'bg-emerald-50/50 border-emerald-100'} rounded-xl border w-full max-w-4xl mx-auto flex items-start sm:items-center gap-3 text-left`}>
              <div className={`bg-white p-2.5 rounded-lg shadow-sm border ${project === 'CLO' ? 'border-blue-100' : 'border-emerald-100'} hidden sm:block mt-1 sm:mt-0`}>
                <Target className={project === 'CLO' ? 'text-blue-600' : 'text-emerald-600'} size={20} />
              </div>
              <div className="flex flex-col gap-1.5">
                <p className={`${project === 'CLO' ? 'text-blue-900' : 'text-emerald-900'} text-base font-medium`}>
                  {todaySchedule === null ? (
                    lang === 'ko' ? '스케줄을 불러오는 중...' : 'Loading schedule...'
                  ) : todaySchedule === '없음' ? (
                    lang === 'ko' 
                    ? `선생님, 오늘(${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일, ${weekdays[today.getDay()]}요일)은 예정된 수업이 없습니다.`
                    : `There are no classes scheduled for today.`
                  ) : (
                    <span>
                      {lang === 'ko' 
                        ? <>선생님, 오늘({today.getFullYear()}년 {today.getMonth() + 1}월 {today.getDate()}일, {weekdays[today.getDay()]}요일)은 {highlightSchedule(todaySchedule)} 수업이 있습니다.</>
                        : <>Today you have {highlightSchedule(todaySchedule)} classes.</>}
                    </span>
                  )}
                </p>
                {tomorrowSchedule !== null && (
                  <p className={`${project === 'CLO' ? 'text-blue-800/80' : 'text-emerald-800/80'} text-sm font-medium`}>
                    {tomorrowSchedule === '없음' 
                      ? (lang === 'ko' ? `내일(${tomorrow.getFullYear()}년 ${tomorrow.getMonth() + 1}월 ${tomorrow.getDate()}일, ${weekdays[tomorrow.getDay()]}요일)은 예정된 수업이 없습니다.` : `There are no classes scheduled for tomorrow.`)
                      : (lang === 'ko' ? <>내일({tomorrow.getFullYear()}년 {tomorrow.getMonth() + 1}월 {tomorrow.getDate()}일, {weekdays[tomorrow.getDay()]}요일)은 {highlightSchedule(tomorrowSchedule)} 수업이 예정되어 있습니다.</> : <>Tomorrow you have {highlightSchedule(tomorrowSchedule)} classes scheduled.</>)
                    }
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 max-w-4xl mx-auto text-left">
              <AttendanceTracker lang={lang} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section id="curriculum" className="py-24 md:py-32 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="mb-12 text-center">
              <span className="text-primary font-bold text-sm tracking-widest uppercase mb-3 block">{lang === "ko" ? "차시별 내용" : "Curriculum Details"}</span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">{project} {lang === "ko" ? "차시별 내용" : "Curriculum Details"}</h2>
              <p className="text-sm text-gray-500 italic max-w-2xl mx-auto mb-10">
                {lang === "ko" ? "카드를 클릭하여 각 차시별 자료를 확인하세요." : "Click on the cards to view the materials for each session."}
              </p>
              <div className="max-w-xl mx-auto">
                <SessionCard session={SESSIONS[0]} onView={setCurrentView} lang={lang} />
              </div>
            </div>
          </FadeIn>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute left-[50%] top-0 bottom-0 w-px bg-gray-200"></div>

            <div className="space-y-12 md:space-y-24">
              {/* Phase 1 */}
              <FadeIn className="relative">
                <div className="md:grid grid-cols-2 flex flex-col md:flex-row items-center gap-8 md:gap-16">
                  <div className="md:text-right w-full">
                    <span className="text-primary font-bold text-sm tracking-widest uppercase mb-2 block">Phase 1</span>
                    <h3 className="text-2xl font-bold mb-3 md:mb-0">{lang === "ko" ? "프로젝트 준비 (1-2차시)" : "Project Preparation (Sessions 1-2)"}</h3>
                  </div>
                  <div className="hidden md:flex absolute left-[50%] top-1/2 -translate-y-1/2 -ml-5 w-10 h-10 rounded-full bg-white border-4 border-primary items-center justify-center z-10">
                    <Target size={16} className="text-primary" />
                  </div>
                  <div className="w-full space-y-4">
                    {SESSIONS.filter(s => s.phase === 1).map((session) => (
                      <SessionCard key={session.id} session={session} onView={setCurrentView} lang={lang} />
                    ))}
                  </div>
                </div>
              </FadeIn>

              {/* Phase 2 */}
              <FadeIn className="relative">
                <div className="md:grid grid-cols-2 flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16">
                  <div className="w-full order-first md:order-last">
                    <span className="text-emerald-500 font-bold text-sm tracking-widest uppercase mb-2 block">Phase 2</span>
                    <h3 className="text-2xl font-bold mb-3 md:mb-0">{lang === "ko" ? (project === 'CLAP' ? 'AI와 함께 읽기 (3-6차시)' : '읽기 (3-6차시)') : (project === 'CLAP' ? 'Reading with AI (Sessions 3-6)' : 'Reading (Sessions 3-6)')}</h3>
                  </div>
                  <div className="hidden md:flex absolute left-[50%] top-1/2 -translate-y-1/2 -ml-5 w-10 h-10 rounded-full bg-white border-4 border-emerald-500 items-center justify-center z-10">
                    <Sparkles size={16} className="text-emerald-500" />
                  </div>
                  <div className="w-full space-y-4 order-last md:order-first">
                    {SESSIONS.filter(s => s.phase === 2).map((session) => (
                      <SessionCard key={session.id} session={session} onView={setCurrentView} lang={lang} />
                    ))}
                  </div>
                </div>
              </FadeIn>

              {/* Phase 3 */}
              <FadeIn className="relative">
                <div className="md:grid grid-cols-2 flex flex-col md:flex-row items-center gap-8 md:gap-16">
                  <div className="md:text-right w-full">
                    <span className="text-orange-500 font-bold text-sm tracking-widest uppercase mb-2 block">Phase 3</span>
                    <h3 className="text-2xl font-bold mb-3 md:mb-0">{lang === "ko" ? (project === 'CLAP' ? 'AI와 함께 쓰기 (7-12차시)' : '쓰기 (7-12차시)') : (project === 'CLAP' ? 'Writing with AI (Sessions 7-12)' : 'Writing (Sessions 7-12)')}</h3>
                  </div>
                  <div className="hidden md:flex absolute left-[50%] top-1/2 -translate-y-1/2 -ml-5 w-10 h-10 rounded-full bg-white border-4 border-orange-500 items-center justify-center z-10">
                    <Lightbulb size={16} className="text-orange-500" />
                  </div>
                  <div className="w-full space-y-4">
                    {SESSIONS.filter(s => s.phase === 3).map((session) => (
                      <SessionCard key={session.id} session={session} onView={setCurrentView} lang={lang} />
                    ))}
                  </div>
                </div>
              </FadeIn>

              {/* Phase 4 */}
              <FadeIn className="relative">
                <div className="md:grid grid-cols-2 flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16">
                  <div className="w-full order-first md:order-last">
                    <span className="text-purple-500 font-bold text-sm tracking-widest uppercase mb-2 block">Phase 4</span>
                    <h3 className="text-2xl font-bold mb-3 md:mb-0">{lang === "ko" ? "프로젝트 결과발표 (13차시)" : "Project Presentation (Session 13)"}</h3>
                  </div>
                  <div className="hidden md:flex absolute left-[50%] top-1/2 -translate-y-1/2 -ml-5 w-10 h-10 rounded-full bg-white border-4 border-purple-500 items-center justify-center z-10">
                    <Globe size={16} className="text-purple-500" />
                  </div>
                  <div className="w-full space-y-4 order-last md:order-first">
                    {SESSIONS.filter(s => s.phase === 4).map((session) => (
                      <SessionCard key={session.id} session={session} onView={setCurrentView} lang={lang} />
                    ))}
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ED-AI Lit Framework Section (CLAP 전용) */}
      {project === 'CLAP' && (
        <section id="pillars" className="py-24 bg-gradient-to-b from-white via-gray-50/50 to-white px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="max-w-4xl mx-auto mb-12">
            <div className="text-center flex flex-col items-center justify-center mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-primary/10 text-primary mb-3 border border-primary/20">
                <Sparkles size={13} />
                Educational Framework
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-ink mb-3 text-center">
                {lang === "ko" ? "ED-AI Lit 프레임워크" : "ED-AI Lit Framework"}
              </h2>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto text-center">
                {lang === "ko" 
                  ? "교육 현장에서의 실질적인 인공지능 문해력(AI Literacy) 신장을 위한 6가지 핵심 영역과 단원별 수업 활동 연계" 
                  : "Six core dimensions and pedagogical activities for fostering interdisciplinary AI literacy in educational settings"}
              </p>
            </div>

            {/* Citation만 왼쪽 정렬 */}
            <div className="w-full text-left pt-3 border-t border-gray-100">
              <p className="text-left text-xs sm:text-sm text-gray-500 font-serif leading-relaxed">
                Allen, L. K., &amp; Kendeou, P. (2024). <span className="italic">ED-AI Lit: An interdisciplinary framework for AI literacy in education.</span> Policy Insights from the Behavioral and Brain Sciences, 11(1), 3-10.
              </p>
            </div>
          </FadeIn>

          {/* Quick instructions and expand all controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-gray-200/60 shadow-xs">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span>{lang === "ko" ? "💡 블럭을 클릭하면 각 영역의 세부 수업 활동 예시가 펼쳐집니다." : "💡 Click any block to reveal concrete class activity examples."}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => expandAllFrameworks(true)}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              >
                {lang === "ko" ? "모두 펼치기" : "Expand All"}
              </button>
              <button
                type="button"
                onClick={() => expandAllFrameworks(false)}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              >
                {lang === "ko" ? "모두 접기" : "Collapse All"}
              </button>
            </div>
          </div>

          {/* 6 Dimensions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EDAI_FRAMEWORK_DIMENSIONS.map((dim, idx) => {
              const IconComp = dim.icon;
              const isExpanded = !!expandedFrameworks[dim.id];

              return (
                <FadeIn key={dim.id} delay={0.05 * (idx + 1)} className="h-full">
                  <div
                    onClick={() => setSelectedFrameworkModal(dim)}
                    className="h-full bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 hover:border-primary/40 transition-all duration-300 flex flex-col justify-between cursor-pointer group shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl hover:-translate-y-1"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm ${dim.iconColor}`}>
                          <IconComp size={24} />
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${dim.badgeColor}`}>
                          {dim.badge}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-ink">{dim.title}</h3>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                          {lang === "ko" ? dim.koTitle : dim.title}
                        </span>
                      </div>

                      <p className="text-sm font-medium text-gray-700 mb-2 leading-snug">
                        {dim.definition}
                      </p>
                      <p className="text-xs text-gray-500 leading-relaxed mb-4">
                        {lang === "ko" ? dim.koDesc : dim.definition}
                      </p>

                      {/* Click prompt banner */}
                      <div className="flex items-center justify-between py-2.5 px-3.5 rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors text-xs font-bold mb-3">
                        <span className="flex items-center gap-1.5 text-primary">
                          <Sparkles size={14} />
                          {lang === 'ko' ? '👉 클릭 시 세부 수업 활동예시 보기' : '👉 Click to view detailed Activity Examples'}
                        </span>
                        <ArrowRight size={14} className="text-primary group-hover:translate-x-1 transition-transform" />
                      </div>

                      {/* 수업 활동예시 block on card */}
                      <div className={`rounded-2xl p-3.5 border ${dim.activityBg} mb-4 transition-all duration-300`}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-extrabold text-xs flex items-center gap-1.5 text-slate-900">
                            <Sparkles size={13} className="text-primary" />
                            {lang === "ko" ? "수업 활동예시:" : "Activity Examples:"}
                          </span>
                          <span className="text-[10px] font-bold text-primary">
                            {lang === "ko" ? "활동 3개" : "3 activities"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed line-clamp-2">
                          {(lang === "ko" ? dim.activityExamples : dim.enActivityExamples)[0]}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-gray-600">
                      <span className="inline-flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-primary" />
                        {dim.summary}
                      </span>
                      <span className="text-[11px] font-bold text-primary group-hover:underline flex items-center gap-1">
                        {lang === 'ko' ? '활동 전체보기' : 'View Activities'} →
                      </span>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>

          {/* Modal popup when clicking any block: 수업 활동 딱 나오게 */}
          {selectedFrameworkModal && (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
              onClick={() => setSelectedFrameworkModal(null)}
            >
              <div 
                className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${selectedFrameworkModal.iconColor}`}>
                      {React.createElement(selectedFrameworkModal.icon, { size: 24 })}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-bold text-ink">{selectedFrameworkModal.title}</h3>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                          {lang === 'ko' ? selectedFrameworkModal.koTitle : selectedFrameworkModal.title}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-primary">{selectedFrameworkModal.badge}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFrameworkModal(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Definition */}
                <div className="mb-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 text-sm text-gray-700 leading-relaxed">
                  <p className="font-semibold text-ink mb-1">{selectedFrameworkModal.definition}</p>
                  <p className="text-xs text-gray-500">{lang === 'ko' ? selectedFrameworkModal.koDesc : selectedFrameworkModal.definition}</p>
                </div>

                {/* 수업 활동예시: xxx */}
                <div className="flex-1 overflow-y-auto mb-5 pr-1">
                  <div className={`p-5 rounded-2xl border ${selectedFrameworkModal.activityBg}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles size={18} className="text-primary" />
                      <h4 className="font-extrabold text-base text-slate-900">
                        {lang === 'ko' ? "수업 활동예시:" : "Activity Examples:"}
                      </h4>
                    </div>
                    <ul className="space-y-2.5 text-xs sm:text-sm text-slate-800">
                      {(lang === 'ko' ? selectedFrameworkModal.activityExamples : selectedFrameworkModal.enActivityExamples).map((act: string, i: number) => (
                        <li key={i} className="flex items-start gap-2.5 leading-relaxed bg-white/80 p-3 rounded-xl border border-slate-200/50 shadow-2xs">
                          <span className="text-primary font-bold text-base leading-none mt-0.5">•</span>
                          <span className="font-medium">{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-400 hidden sm:inline">Allen &amp; Kendeou (2024) ED-AI Lit</span>
                  <div className="flex items-center gap-2 ml-auto">
                    {selectedFrameworkModal.sessionId && (
                      <button
                        type="button"
                        onClick={() => {
                          const sId = selectedFrameworkModal.sessionId;
                          setSelectedFrameworkModal(null);
                          setCurrentView({ type: 'session', sessionId: sId });
                        }}
                        className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all"
                      >
                        <span>{lang === 'ko' ? '해당 차시 자료 열기' : 'Open Session Docs'}</span>
                        <ArrowRight size={16} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedFrameworkModal(null)}
                      className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs sm:text-sm transition-colors"
                    >
                      {lang === 'ko' ? '닫기' : 'Close'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-ink text-white px-6">
        <div className="max-w-4xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl mb-8 tracking-tight leading-tight">
              {project === 'CLAP' ? (
                <>
                  <span className="font-bold">C</span>ontent Area <span className="font-bold">L</span>iteracy<br />
                  and <span className="font-bold">A</span>I Literacy<br />
                  through <span className="font-bold">P</span>roject Based Learning
                </>
              ) : (
                <>
                  <span className="font-bold">C</span>ontent Area <span className="font-bold">L</span>iteracy <span className="font-bold">O</span>nly
                </>
              )}
            </h2>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row lg:justify-between gap-12 lg:gap-8">
          
          {/* Column 1: Project */}
          <div className="space-y-2 lg:max-w-[320px]">
            <div className="flex items-center h-10">
              <h3 className="font-bold text-xl text-ink tracking-tight">{project} Project</h3>
            </div>
            <p className="text-gray-500 text-sm leading-snug">
              <span className="font-medium text-gray-700">C</span>ontent Area <span className="font-medium text-gray-700">L</span>iteracy {project === 'CLAP' ? <><span className="font-medium text-gray-700">a</span>nd <span className="font-medium text-gray-700">A</span>I Literacy through <span className="font-medium text-gray-700">P</span>roject Based Learning</> : <><span className="font-medium text-gray-700">O</span>nly</>}
            </p>
          </div>

          {/* Column 2: Contact */}
          <div className="space-y-2">
            <div className="flex items-center h-10">
              <h3 className="text-sm font-bold text-gray-700">Contact</h3>
            </div>
            <div className="text-sm text-gray-500 space-y-1">
              <p>YooJeong Son</p>
              <a href="mailto:son06252@umn.edu" className="hover:text-primary transition-colors block">son06252@umn.edu</a>
            </div>
          </div>

          {/* Column 3: Department */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 h-10 -ml-1">
              <img src="/worksheet/umn-logo.svg" alt="University of Minnesota" className="h-[22px] object-contain" />
              <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">University of Minnesota</span>
            </div>
            <div className="text-[11px] text-gray-500 space-y-1">
              <p className="font-medium text-gray-600">Educational Psychology</p>
              <p>250 Education Sciences Bldg., 56 East River Road</p>
              <p>Minneapolis, MN 55455</p>
            </div>
          </div>

          {/* Column 4: LILAC Lab */}
          <div className="space-y-1 flex flex-col lg:items-end">
            <div>
              <div className="flex items-center h-10 overflow-visible">
                 <span className="text-[17px] font-bold text-gray-700 tracking-tight leading-none">LILAC Lab</span>
              </div>
              <div className="text-[12px] text-gray-500 -mt-1 space-y-1">
                 <p className="font-medium text-gray-600 leading-tight">Literacy, Language, and Content Learning</p>
                 <p className="font-medium text-gray-500 leading-tight">PI <span className="mx-1 font-light text-gray-300">|</span> HyeJin Hwang</p>
              </div>
            </div>
          </div>

        </div>
        
        <div className="max-w-7xl mx-auto px-6 mt-16 pt-6 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
          <p>© {new Date().getFullYear()} YooJeong Son. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const [activeProject, setActiveProject] = useState<{ type: ProjectType } | null>(null);
  const [lang, setLang] = useState<"ko"|"en">("ko");

  useEffect(() => {
    if (activeProject) {
      document.title = `${activeProject.type} Project`;
    } else {
      document.title = 'CLAP/CLO Project';
    }
  }, [activeProject]);

  if (!activeProject) {
    return <Portal onSelectProject={(type) => setActiveProject({ type })} lang={lang} setLang={setLang} />;
  }

  return (
    <div
      style={{
        '--color-primary': activeProject.type === 'CLO' ? '#155dfc' : '#10b981',
        '--color-primary-dark': activeProject.type === 'CLO' ? '#0045d8' : '#047857',
        '--color-secondary': activeProject.type === 'CLO' ? '#10b981' : '#0ea5e9'
      } as React.CSSProperties}
      className="h-full"
    >
      <ProjectApp project={activeProject.type} onLogout={() => setActiveProject(null)} lang={lang} setLang={setLang} />
    </div>
  );
}
