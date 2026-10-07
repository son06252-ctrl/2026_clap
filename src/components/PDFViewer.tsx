import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight,
  Maximize2,
  Minimize2,
  FileText,
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';

// Set worker source to the static file in public
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

interface PDFViewerProps {
  url: string;
  title?: string;
  lang?: 'ko' | 'en';
}

export default function PDFViewer({ url, title, lang = 'ko' }: PDFViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const canvasRefs = useRef<{ [key: number]: HTMLCanvasElement | null }>({});

  const encodedUrl = encodeURI(url);

  // Load PDF document
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError(null);
    setCurrentPage(1);

    if (!url) {
      setError(lang === 'ko' ? '문서 경로가 지정되지 않았습니다.' : 'Document URL is not specified.');
      setLoading(false);
      return;
    }

    const loadingTask = pdfjsLib.getDocument({
      url: encodedUrl,
      cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/cmaps/',
      cMapPacked: true,
    });

    loadingTask.promise
      .then((doc) => {
        if (isCancelled) return;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setLoading(false);
      })
      .catch((err) => {
        if (isCancelled) return;
        console.error('Error loading PDF:', err);
        setError(
          lang === 'ko' 
            ? 'PDF 문서를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.' 
            : 'Failed to load PDF document. Please try again.'
        );
        setLoading(false);
      });

    return () => {
      isCancelled = true;
      try {
        loadingTask.destroy();
      } catch (e) {
        // ignore cleanup error
      }
    };
  }, [url, encodedUrl, lang]);

  // Render current page onto canvas
  useEffect(() => {
    if (!pdfDoc || numPages === 0) return;

    let renderTask: any = null;
    const canvas = canvasRefs.current[currentPage];

    if (canvas) {
      pdfDoc.getPage(currentPage).then((page) => {
        const viewport = page.getViewport({ scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const context = canvas.getContext('2d');
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };
          renderTask = page.render(renderContext);
          renderTask.promise.catch((err: any) => {
            if (err?.name !== 'RenderingCancelledException') {
              console.error('Page render error:', err);
            }
          });
        }
      });
    }

    return () => {
      if (renderTask) {
        try {
          renderTask.cancel();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [pdfDoc, currentPage, scale, numPages]);

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.2, 2.5));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.6));
  const handleResetZoom = () => setScale(1.1);

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, numPages));

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const getFileName = () => {
    try {
      const parts = url.split('/');
      return decodeURI(parts[parts.length - 1]);
    } catch {
      return title || 'Document.pdf';
    }
  };

  return (
    <div 
      ref={containerRef} 
      onContextMenu={(e) => e.preventDefault()}
      className="flex flex-col h-full w-full bg-[#525659] text-white relative select-none overflow-hidden"
    >
      {/* Top Controls Toolbar */}
      <div className="h-12 bg-[#323639] border-b border-[#404447] px-3 sm:px-4 flex items-center justify-between shrink-0 z-20 text-xs sm:text-sm">
        {/* Left: Document info & pages */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
          <FileText size={16} className="text-emerald-400 shrink-0" />
          <span className="font-medium text-gray-200 truncate max-w-[140px] sm:max-w-[240px] md:max-w-xs" title={getFileName()}>
            {getFileName()}
          </span>

          {numPages > 0 && (
            <div className="flex items-center bg-[#202124] rounded-lg px-2 py-1 text-xs gap-1 border border-white/10 shrink-0">
              <button
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                className="p-1 hover:text-white disabled:opacity-30 disabled:hover:text-inherit rounded transition-colors"
                title={lang === 'ko' ? '이전 페이지' : 'Previous page'}
              >
                <ChevronLeft size={14} />
              </button>
              <span className="font-medium px-1">
                {currentPage} / {numPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage >= numPages}
                className="p-1 hover:text-white disabled:opacity-30 disabled:hover:text-inherit rounded transition-colors"
                title={lang === 'ko' ? '다음 페이지' : 'Next page'}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Right: Zoom & Fullscreen buttons (Download blocked) */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Zoom controls */}
          <div className="hidden sm:flex items-center bg-[#202124] rounded-lg p-0.5 border border-white/10">
            <button
              onClick={handleZoomOut}
              className="p-1.5 hover:text-white text-gray-300 rounded hover:bg-white/10 transition-colors"
              title={lang === 'ko' ? '축소' : 'Zoom out'}
            >
              <ZoomOut size={15} />
            </button>
            <button
              onClick={handleResetZoom}
              className="px-2 py-1 text-[11px] font-mono text-gray-300 hover:text-white hover:bg-white/10 rounded transition-colors"
              title={lang === 'ko' ? '원래 크기' : 'Reset zoom'}
            >
              {Math.round(scale * 100)}%
            </button>
            <button
              onClick={handleZoomIn}
              className="p-1.5 hover:text-white text-gray-300 rounded hover:bg-white/10 transition-colors"
              title={lang === 'ko' ? '확대' : 'Zoom in'}
            >
              <ZoomIn size={15} />
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            className="flex p-1.5 hover:text-white text-gray-300 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
            title={isFullscreen ? (lang === 'ko' ? '전체화면 종료' : 'Exit fullscreen') : (lang === 'ko' ? '전체화면' : 'Fullscreen')}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 overflow-auto flex items-start justify-center p-4 sm:p-6 bg-[#525659]">
        {loading && (
          <div className="flex flex-col items-center justify-center h-full py-20 text-gray-200">
            <Loader2 size={36} className="animate-spin text-emerald-400 mb-3" />
            <p className="text-sm font-medium">{lang === 'ko' ? 'PDF 문서를 불러오는 중입니다...' : 'Loading PDF document...'}</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center h-full max-w-md text-center p-6 bg-[#323639] rounded-2xl border border-white/10 my-auto shadow-xl">
            <AlertCircle size={40} className="text-amber-400 mb-3" />
            <h4 className="font-bold text-base mb-2 text-white">
              {lang === 'ko' ? 'PDF 미리보기를 불러올 수 없습니다' : 'Unable to preview PDF'}
            </h4>
            <p className="text-xs text-gray-300 mb-5 leading-relaxed">
              {error}
            </p>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-all"
              >
                <RefreshCw size={14} />
                {lang === 'ko' ? '다시 시도' : 'Retry'}
              </button>
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="flex flex-col items-center gap-4 transition-all duration-150">
            <div className="bg-white rounded shadow-2xl overflow-hidden border border-black/20">
              <canvas 
                ref={(el) => { canvasRefs.current[currentPage] = el; }} 
                className="block max-w-full"
              />
            </div>

            {/* Bottom Quick Page Controls */}
            {numPages > 1 && (
              <div className="flex items-center gap-3 bg-[#323639]/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg text-xs">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage <= 1}
                  className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 text-white transition-colors"
                >
                  {lang === 'ko' ? '이전 페이지' : 'Prev'}
                </button>
                <span className="font-mono text-gray-200">
                  {currentPage} / {numPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage >= numPages}
                  className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 text-white transition-colors"
                >
                  {lang === 'ko' ? '다음 페이지' : 'Next'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
