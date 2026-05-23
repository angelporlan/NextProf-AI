"use client";

import { useState, useEffect, useRef } from 'react';
import { saveCvContent } from '@/app/dashboard/actions';
import { FileEdit } from 'lucide-react';

interface MarkdownEditorProps {
  cvId: string;
  initialContent: string;
  onSave?: () => void;
  saveStatus: 'saved' | 'saving' | 'error';
  setSaveStatus: (status: 'saved' | 'saving' | 'error') => void;
}

// Markdown syntax highlighting parser for dark theme
function highlightMarkdown(text: string): string {
  if (!text) return '';

  // 1. Escape HTML
  let escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // 2. Parse lines
  const lines = escaped.split('\n');
  const highlightedLines = lines.map((line) => {
    let renderedLine = line;

    // Headings ## and ### in purple/accent (text-purple-400)
    if (renderedLine.startsWith('### ')) {
      return `<span class="text-purple-400 font-bold">${renderedLine}</span>`;
    } else if (renderedLine.startsWith('## ')) {
      return `<span class="text-purple-400 font-bold">${renderedLine}</span>`;
    } else if (renderedLine.startsWith('# ')) {
      return `<span class="text-purple-300 font-extrabold">${renderedLine}</span>`;
    }

    // List item dashes in secondary color (text-sky-400 font-bold)
    let hasListDash = false;
    let listContent = '';
    let listPrefix = '';
    if (renderedLine.startsWith('- ')) {
      hasListDash = true;
      listPrefix = '<span class="text-sky-400 font-bold">-</span> ';
      listContent = renderedLine.substring(2);
    } else if (renderedLine.startsWith('– ')) {
      hasListDash = true;
      listPrefix = '<span class="text-sky-400 font-bold">–</span> ';
      listContent = renderedLine.substring(2);
    } else if (renderedLine.startsWith('* ')) {
      hasListDash = true;
      listPrefix = '<span class="text-sky-400 font-bold">*</span> ';
      listContent = renderedLine.substring(2);
    } else {
      listContent = renderedLine;
    }

    // Inline elements: **bold** (primary text-white) and *italic* (secondary text-slate-400)
    // 1. Replace **bold** with temporary markers to avoid collision with single asterisks
    const boldMatches: string[] = [];
    let boldParsed = listContent.replace(/\*\*([^*]+)\*\*/g, (match, p1) => {
      boldMatches.push(p1);
      return `\u0001${boldMatches.length - 1}\u0002`;
    });

    // 2. Replace *italic* with HTML spans
    let italicParsed = boldParsed.replace(/\*([^*]+)\*/g, '<span class="italic text-slate-400">*$1*</span>');

    // 3. Restore bold matches with HTML spans
    let finalContent = italicParsed.replace(/\u0001(\d+)\u0002/g, (match, p1) => {
      const idx = parseInt(p1, 10);
      return `<span class="font-bold text-white">**${boldMatches[idx]}**</span>`;
    });

    if (hasListDash) {
      return listPrefix + finalContent;
    } else {
      return finalContent;
    }
  });

  return highlightedLines.join('\n');
}

export default function MarkdownEditor({ cvId, initialContent, onSave, saveStatus, setSaveStatus }: MarkdownEditorProps) {
  const [content, setContent] = useState(initialContent);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Synchronize internal content if it changes externally
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);
    setSaveStatus('saving');

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(async () => {
      try {
        const result = await saveCvContent(cvId, value);
        if (result.success) {
          setSaveStatus('saved');
          if (onSave) {
            onSave();
          }
        } else {
          setSaveStatus('error');
        }
      } catch (err) {
        console.error(err);
        setSaveStatus('error');
      }
    }, 1500); // 1.5 second debounce
  };

  // Synchronize scroll positions between textarea and overlay
  const handleScroll = () => {
    if (textareaRef.current && overlayRef.current) {
      overlayRef.current.scrollTop = textareaRef.current.scrollTop;
      overlayRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  // Keep scroll synchronized on content edits
  useEffect(() => {
    if (textareaRef.current && overlayRef.current) {
      overlayRef.current.scrollTop = textareaRef.current.scrollTop;
      overlayRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, [content]);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#090d16]/90 border border-slate-900 rounded-3xl overflow-hidden shadow-2xl relative">
      
      {/* Title bar of the editor (Premium Dark background) */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#0d1321] border-b border-slate-900 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-sky-500/10 text-sky-400 rounded-lg">
            <FileEdit className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-350 tracking-wide uppercase">Contenido Markdown</span>
        </div>
      </div>

      {/* Editor area with dark syntax highlighting overlay */}
      <div className="flex-1 relative bg-[#090d16]/40 overflow-hidden">
        {/* Highlighted text layer underneath */}
        <div
          ref={overlayRef}
          className="absolute inset-0 p-6 font-mono text-sm leading-relaxed overflow-auto pointer-events-none whitespace-pre-wrap break-words text-slate-300 editor-scrollbar select-none"
          dangerouslySetInnerHTML={{ __html: highlightMarkdown(content) }}
        />
        
        {/* Transparent textarea on top */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onScroll={handleScroll}
          className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-sky-400 font-mono text-sm leading-relaxed p-6 focus:outline-none resize-none selection:bg-sky-500/25 overflow-auto editor-scrollbar border-0"
          placeholder="# Escribe aquí en Markdown..."
          spellCheck="false"
        />
      </div>
    </div>
  );
}
