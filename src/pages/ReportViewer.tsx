import React, { useState } from 'react';
import { REPORT_PAGES, REPORT_METADATA } from '../data/reportPagesData';
import { ArchitecturalDiagrams } from '../components/ArchitecturalDiagrams';
import { exportReportToWord } from '../utils/docxExport';
import { 
  BookOpen, Download, Printer, Search, ChevronLeft, 
  ChevronRight, FileText, CheckCircle2, Bookmark, 
  Sparkles, Layers, Code, ArrowUpRight
} from 'lucide-react';

export const ReportViewer: React.FC = () => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0); // 0 to 49
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'single' | 'continuous'>('single');
  const [isExportingWord, setIsExportingWord] = useState(false);

  const categories = ['All', 'Front Matter', 'Executive', 'Architecture', 'Technology', 'Database', 'Security', 'API', 'Frontend', 'Testing', 'DevOps', 'Management', 'Academic', 'References'];

  const filteredPages = REPORT_PAGES.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesQuery = 
      p.title.toLowerCase().includes(query) ||
      p.chapter.toLowerCase().includes(query) ||
      p.summary.toLowerCase().includes(query) ||
      p.content.some(c => c.toLowerCase().includes(query));
    return matchesCategory && matchesQuery;
  });

  const currentPage = REPORT_PAGES[currentPageIndex] || REPORT_PAGES[0];

  const handleDownloadWord = async () => {
    try {
      setIsExportingWord(true);
      await exportReportToWord();
    } catch (err) {
      console.error('Word export error:', err);
    } finally {
      setIsExportingWord(false);
    }
  };

  const handlePrintPdf = () => {
    setViewMode('continuous');
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* Top Dossier Command Header */}
      <div className="p-6 bg-linear-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-2xl shadow-lg border border-teal-800/40 relative overflow-hidden no-print">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-2 border border-teal-500/30">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Academic Capstone & Technical Architecture Dossier</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hospital Management System: 50-Page Engineering Report
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Exhaustive documentation covering system architecture, React 19, Node.js, Express, MongoDB schemas, JWT security, REST APIs, HIPAA compliance, testing pipelines, and viva notes.
            </p>
          </div>

          {/* Export Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleDownloadWord}
              disabled={isExportingWord}
              className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all hover:scale-105 disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isExportingWord ? 'Generating Word File...' : 'Download Word (.docx)'}</span>
            </button>

            <button
              onClick={handlePrintPdf}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={() => setViewMode(viewMode === 'single' ? 'continuous' : 'single')}
              className="px-3 py-2.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
            >
              {viewMode === 'single' ? 'View All 50 Pages' : 'Single Page Mode'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Reader Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Navigation, Chapter TOC & Search (4 cols) - Hidden on Print */}
        <div className="lg:col-span-4 space-y-4 no-print">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-500">
                Table of Contents (50 Pages)
              </span>
              <span className="text-[11px] font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-bold">
                Page {currentPage.pageNumber} / 50
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search report topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:border-teal-500"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
              {categories.slice(0, 6).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-1 rounded-md shrink-0 transition-colors ${
                    selectedCategory === cat 
                      ? 'bg-teal-600 text-white font-semibold' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Page List Directory */}
            <div className="max-h-[600px] overflow-y-auto space-y-1.5 pr-1">
              {filteredPages.map((page) => {
                const isSelected = currentPage.pageNumber === page.pageNumber;
                return (
                  <button
                    key={page.pageNumber}
                    onClick={() => {
                      setCurrentPageIndex(page.pageNumber - 1);
                      setViewMode('single');
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 ${
                      isSelected 
                        ? 'bg-teal-50 border border-teal-300 text-teal-950 font-semibold shadow-2xs' 
                        : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded flex items-center justify-center font-mono text-[10px] shrink-0 font-bold ${
                      isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {page.pageNumber}
                    </span>

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-slate-400 uppercase tracking-tight block truncate">
                        Ch. {page.chapterNumber}: {page.chapter}
                      </span>
                      <p className="text-xs font-medium text-slate-900 truncate">
                        {page.title}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Page Content Viewer (8 cols) */}
        <div className="lg:col-span-8">
          {viewMode === 'single' ? (
            /* Single Page View */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-10 space-y-6">
              {/* Institutional Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-teal-700">MEDIPULSE HMS DOSSIER</span>
                  <span>•</span>
                  <span>CHAPTER {currentPage.chapterNumber}: {currentPage.chapter.toUpperCase()}</span>
                </div>
                <span className="font-mono font-bold text-slate-700">PAGE {currentPage.pageNumber} OF 50</span>
              </div>

              {/* Page Title & Category */}
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                  {currentPage.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                  {currentPage.title}
                </h2>
              </div>

              {/* Executive Summary Block */}
              <div className="p-4 bg-slate-50 rounded-xl border-l-4 border-l-teal-500 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                <span className="font-bold text-slate-900 block mb-1">Executive Chapter Summary:</span>
                {currentPage.summary}
              </div>

              {/* Interactive Architectural Diagram if present */}
              {currentPage.diagramType && (
                <ArchitecturalDiagrams type={currentPage.diagramType} />
              )}

              {/* Content Paragraphs */}
              <div className="space-y-4 text-xs sm:text-sm text-slate-800 leading-relaxed">
                {currentPage.content.map((para, idx) => (
                  <p key={idx} className={para.startsWith('•') || para.startsWith('Q') ? 'font-medium' : ''}>
                    {para}
                  </p>
                ))}
              </div>

              {/* Code Snippet if present */}
              {currentPage.codeSnippet && (
                <div className="my-4 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 text-slate-200 text-xs">
                  <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                    <span className="font-mono text-teal-400 font-semibold">{currentPage.codeSnippet.caption}</span>
                    <span className="uppercase text-[10px] text-slate-400">{currentPage.codeSnippet.language}</span>
                  </div>
                  <pre className="p-4 font-mono text-[11px] overflow-x-auto text-teal-300">
                    {currentPage.codeSnippet.code}
                  </pre>
                </div>
              )}

              {/* Key Implementation Notes */}
              {currentPage.keyNotes.length > 0 && (
                <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-100 text-xs space-y-2">
                  <span className="font-bold text-teal-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    Key Architectural & Implementation Notes:
                  </span>
                  <ul className="space-y-1 text-slate-700 list-disc list-inside">
                    {currentPage.keyNotes.map((note, i) => (
                      <li key={i}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* References Section */}
              {currentPage.references.length > 0 && (
                <div className="pt-4 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
                  <span className="font-bold text-slate-700 block">Authoritative Citations & References:</span>
                  {currentPage.references.map((ref, i) => (
                    <p key={i} className="italic text-slate-500">• {ref}</p>
                  ))}
                </div>
              )}

              {/* Bottom Navigation Pagination Bar - Hidden on print */}
              <div className="pt-6 border-t border-slate-200 flex items-center justify-between no-print">
                <button
                  disabled={currentPageIndex === 0}
                  onClick={() => setCurrentPageIndex(prev => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Page</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Page</span>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={currentPage.pageNumber}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val >= 1 && val <= 50) {
                        setCurrentPageIndex(val - 1);
                      }
                    }}
                    className="w-12 text-center py-1 text-xs font-mono font-bold border border-slate-300 rounded bg-slate-50"
                  />
                  <span className="text-xs text-slate-500 font-medium">of 50</span>
                </div>

                <button
                  disabled={currentPageIndex >= REPORT_PAGES.length - 1}
                  onClick={() => setCurrentPageIndex(prev => Math.min(REPORT_PAGES.length - 1, prev + 1))}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Next Page</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Continuous View: All 50 Pages rendered sequentially for Print / Complete Reading */
            <div className="space-y-10">
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-center justify-between no-print">
                <span>Rendering all 50 pages continuously. Use your browser's Print dialog to save as PDF.</span>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700"
                >
                  Trigger Print to PDF
                </button>
              </div>

              {REPORT_PAGES.map((page) => (
                <div 
                  key={page.pageNumber} 
                  className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 space-y-6 page-break-after shadow-sm"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs text-slate-500">
                    <span className="font-bold text-teal-700">MEDIPULSE HMS DOSSIER • CH. {page.chapterNumber}</span>
                    <span className="font-mono font-bold text-slate-800">PAGE {page.pageNumber} OF 50</span>
                  </div>

                  <h2 className="text-2xl font-bold text-slate-900">{page.title}</h2>
                  <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded border-l-4 border-l-teal-500">
                    {page.summary}
                  </p>

                  {page.diagramType && (
                    <ArchitecturalDiagrams type={page.diagramType} />
                  )}

                  <div className="space-y-3 text-xs sm:text-sm text-slate-800 leading-relaxed">
                    {page.content.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>

                  {page.codeSnippet && (
                    <div className="p-3 bg-slate-900 text-teal-300 font-mono text-[11px] rounded">
                      <div className="text-slate-400 text-[10px] mb-1">{page.codeSnippet.caption}</div>
                      <pre>{page.codeSnippet.code}</pre>
                    </div>
                  )}

                  {page.keyNotes.length > 0 && (
                    <div className="p-3 bg-teal-50/50 rounded border border-teal-100 text-xs">
                      <span className="font-bold text-teal-900 block mb-1">Key Implementation Notes:</span>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                        {page.keyNotes.map((n, i) => <li key={i}>{n}</li>)}
                      </ul>
                    </div>
                  )}

                  {page.references.length > 0 && (
                    <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-500">
                      <span className="font-bold block">References:</span>
                      {page.references.map((r, i) => <p key={i}>• {r}</p>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
