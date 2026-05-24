"use client";

import { useState, useEffect, useRef } from 'react';
import { saveCvContent } from '@/app/dashboard/actions';
import {
  FileEdit, Bold, Italic, List, Heading1, Heading2, Heading3, Eraser, Code, Eye
} from 'lucide-react';

interface MarkdownEditorProps {
  cvId: string;
  initialContent: string;
  onSave?: () => void;
  saveStatus: 'saved' | 'saving' | 'error';
  setSaveStatus: (status: 'saved' | 'saving' | 'error') => void;
}

// Markdown syntax highlighting parser for dark theme (used in Markdown mode)
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
    const boldMatches: string[] = [];
    let boldParsed = listContent.replace(/\*\*([^*]+)\*\*/g, (match, p1) => {
      boldMatches.push(p1);
      return `\u0001${boldMatches.length - 1}\u0002`;
    });

    let italicParsed = boldParsed.replace(/\*([^*]+)\*/g, '<span class="italic text-slate-400">*$1*</span>');

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

// Robust Markdown-to-HTML parser for the visual editor
function mdToHtml(markdown: string): string {
  if (!markdown) return '<p><br></p>';

  const lines = markdown.split('\n');
  const result: string[] = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Check for headers
    if (trimmed.startsWith('# ')) {
      if (inList) {
        result.push('</ul>');
        inList = false;
      }
      result.push(`<h1>${parseInline(trimmed.substring(2))}</h1>`);
    } else if (trimmed.startsWith('## ')) {
      if (inList) {
        result.push('</ul>');
        inList = false;
      }
      result.push(`<h2>${parseInline(trimmed.substring(3))}</h2>`);
    } else if (trimmed.startsWith('### ')) {
      if (inList) {
        result.push('</ul>');
        inList = false;
      }
      result.push(`<h3>${parseInline(trimmed.substring(4))}</h3>`);
    }
    // Check for list items
    else if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('– ')) {
      if (!inList) {
        result.push('<ul>');
        inList = true;
      }
      const content = trimmed.replace(/^([-*–])\s+/, '');
      result.push(`<li>${parseInline(content)}</li>`);
    }
    // Check for empty lines
    else if (trimmed === '') {
      if (inList) {
        result.push('</ul>');
        inList = false;
      }
      result.push('<p><br></p>');
    }
    // Ordinary lines of text
    else {
      if (inList) {
        result.push('</ul>');
        inList = false;
      }
      result.push(`<p>${parseInline(line)}</p>`);
    }
  }

  if (inList) {
    result.push('</ul>');
  }

  return result.join('\n');
}

function parseInline(text: string): string {
  let escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Bold: **text**
  escaped = escaped.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // Italic: *text*
  escaped = escaped.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  // Italic: _text_
  escaped = escaped.replace(/_([^_]+)_/g, '<em>$1</em>');

  return escaped;
}

// Robust HTML-to-Markdown parser for the visual editor
function htmlToMd(html: string): string {
  if (typeof window === 'undefined') return html;

  const doc = new DOMParser().parseFromString(html, 'text/html');
  const body = doc.body;

  let markdown = '';

  function traverse(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      markdown += node.nodeValue;
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const tagName = element.tagName.toUpperCase();

      switch (tagName) {
        case 'H1':
          markdown += '\n# ';
          traverseChildren(element);
          markdown += '\n';
          break;
        case 'H2':
          markdown += '\n## ';
          traverseChildren(element);
          markdown += '\n';
          break;
        case 'H3':
          markdown += '\n### ';
          traverseChildren(element);
          markdown += '\n';
          break;
        case 'P':
        case 'DIV':
          if (element.innerHTML === '<br>' || element.innerText.trim() === '') {
            markdown += '\n\n';
          } else {
            markdown += '\n';
            traverseChildren(element);
            markdown += '\n';
          }
          break;
        case 'UL':
          traverseChildren(element);
          markdown += '\n';
          break;
        case 'LI':
          markdown += '\n- ';
          traverseChildren(element);
          break;
        case 'STRONG':
        case 'B':
          markdown += '**';
          traverseChildren(element);
          markdown += '**';
          break;
        case 'EM':
        case 'I':
          markdown += '*';
          traverseChildren(element);
          markdown += '*';
          break;
        case 'BR':
          if (element.nextSibling !== null) {
            markdown += '\n';
          }
          break;
        default:
          traverseChildren(element);
          break;
      }
    }
  }

  function traverseChildren(element: HTMLElement) {
    for (let i = 0; i < element.childNodes.length; i++) {
      traverse(element.childNodes[i]);
    }
  }

  traverseChildren(body);

  // Clean up excess spacing and newlines
  let cleaned = markdown
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return cleaned;
}

export default function MarkdownEditor({ cvId, initialContent, onSave, saveStatus, setSaveStatus }: MarkdownEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [mode, setMode] = useState<'visual' | 'markdown'>('visual');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Refs for Markdown editor sync scroll
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Ref for visual editor
  const editableRef = useRef<HTMLDivElement>(null);

  // Synchronize internal content if it changes externally
  useEffect(() => {
    setContent(initialContent);
    if (mode === 'visual' && editableRef.current && document.activeElement !== editableRef.current) {
      editableRef.current.innerHTML = mdToHtml(initialContent);
    }
  }, [initialContent]);

  // Handle autosave debounce for both modes
  const triggerAutosave = (value: string) => {
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

  // Change handler for Markdown text editor
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);
    setSaveStatus('saving');
    triggerAutosave(value);
  };

  // Change handler for Visual editor
  const handleVisualInput = () => {
    if (editableRef.current) {
      const html = editableRef.current.innerHTML;
      const md = htmlToMd(html);
      setContent(md);
      setSaveStatus('saving');
      triggerAutosave(md);
    }
  };

  // Switch between visual and markdown mode
  const handleModeChange = (newMode: 'visual' | 'markdown') => {
    if (newMode === mode) return;

    if (newMode === 'visual') {
      setMode('visual');
      setTimeout(() => {
        if (editableRef.current) {
          editableRef.current.innerHTML = mdToHtml(content);
        }
      }, 0);
    } else {
      if (editableRef.current) {
        const html = editableRef.current.innerHTML;
        const md = htmlToMd(html);
        setContent(md);
      }
      setMode('markdown');
    }
  };

  // Formatting actions in the toolbar
  const applyStyle = (command: string, value: string = '') => {
    if (editableRef.current) {
      editableRef.current.focus();
      document.execCommand(command, false, value);
      handleVisualInput();
    }
  };

  // Synchronize scroll positions between textarea and overlay (Markdown mode)
  const handleScroll = () => {
    if (textareaRef.current && overlayRef.current) {
      overlayRef.current.scrollTop = textareaRef.current.scrollTop;
      overlayRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  // Keep scroll synchronized on content edits in Markdown mode
  useEffect(() => {
    if (textareaRef.current && overlayRef.current) {
      overlayRef.current.scrollTop = textareaRef.current.scrollTop;
      overlayRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, [content, mode]);

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
      
      {/* Title bar of the editor */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#0d1321] border-b border-slate-900 shrink-0 select-none z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-sky-500/10 text-sky-400 rounded-lg">
            <FileEdit className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-350 tracking-wide uppercase">Contenido</span>
        </div>

        {/* Toggle Mode Switch */}
        <div className="flex bg-[#090d16] p-0.5 rounded-xl border border-slate-800/80">
          <button
            type="button"
            onClick={() => handleModeChange('visual')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-extrabold tracking-wider uppercase transition-all duration-250 cursor-pointer ${mode === 'visual' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Eye className="w-3 h-3" />
            Visual
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('markdown')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-extrabold tracking-wider uppercase transition-all duration-250 cursor-pointer ${mode === 'markdown' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/20' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Code className="w-3 h-3" />
            Markdown
          </button>
        </div>
      </div>

      {/* Visual Editor Toolbar */}
      {mode === 'visual' && (
        <div className="flex items-center gap-1 px-6 py-2 bg-[#0b101c]/70 border-b border-slate-900 shrink-0 overflow-x-auto select-none z-10 scrollbar-none">
          {/* Bold Button */}
          <div className="relative group">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyStyle('bold')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer shrink-0"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-300 text-[9px] font-bold tracking-wider uppercase rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-20">
              Negrita
            </div>
          </div>

          {/* Italic Button */}
          <div className="relative group">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyStyle('italic')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer shrink-0"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-300 text-[9px] font-bold tracking-wider uppercase rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-20">
              Cursiva
            </div>
          </div>
          
          <div className="w-px h-4 bg-slate-800 mx-1 shrink-0" />

          {/* List Button */}
          <div className="relative group">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyStyle('insertUnorderedList')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer shrink-0"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-300 text-[9px] font-bold tracking-wider uppercase rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-20">
              Viñetas
            </div>
          </div>

          <div className="w-px h-4 bg-slate-800 mx-1 shrink-0" />

          {/* H1 Button */}
          <div className="relative group">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyStyle('formatBlock', 'H1')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer font-bold text-xs shrink-0 flex items-center gap-0.5"
            >
              <Heading1 className="w-3.5 h-3.5" />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-300 text-[9px] font-bold tracking-wider uppercase rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-20">
              Título 1
            </div>
          </div>

          {/* H2 Button */}
          <div className="relative group">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyStyle('formatBlock', 'H2')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer font-bold text-xs shrink-0 flex items-center gap-0.5"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-300 text-[9px] font-bold tracking-wider uppercase rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-20">
              Título 2
            </div>
          </div>

          {/* H3 Button */}
          <div className="relative group">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyStyle('formatBlock', 'H3')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer font-bold text-xs shrink-0 flex items-center gap-0.5"
            >
              <Heading3 className="w-3.5 h-3.5" />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-300 text-[9px] font-bold tracking-wider uppercase rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-20">
              Título 3
            </div>
          </div>

          {/* Paragraph Button */}
          <div className="relative group">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyStyle('formatBlock', 'P')}
              className="px-2 py-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer font-bold text-[10px] tracking-wider uppercase shrink-0"
            >
              Párrafo
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-300 text-[9px] font-bold tracking-wider uppercase rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-20">
              Texto Normal
            </div>
          </div>

          <div className="w-px h-4 bg-slate-800 mx-1 shrink-0" />

          {/* Eraser Button */}
          <div className="relative group">
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyStyle('removeFormat')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer shrink-0"
            >
              <Eraser className="w-3.5 h-3.5" />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-300 text-[9px] font-bold tracking-wider uppercase rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none whitespace-nowrap z-20">
              Limpiar Formato
            </div>
          </div>
        </div>
      )}

      {/* Editor area */}
      <div className="flex-1 relative bg-[#090d16]/40 overflow-hidden">
        
        {/* Visual WYSIWYG Mode */}
        {mode === 'visual' ? (
          <div className="absolute inset-0 p-6 overflow-auto editor-scrollbar">
            <div
              ref={editableRef}
              contentEditable
              onInput={handleVisualInput}
              className="w-full min-h-full bg-transparent text-slate-300 font-sans text-sm leading-relaxed focus:outline-none select-text
                empty:before:content-[attr(placeholder)] empty:before:text-slate-650 empty:before:pointer-events-none empty:before:block
                [&_h1]:text-purple-300 [&_h1]:text-2xl [&_h1]:font-extrabold [&_h1]:mt-6 [&_h1]:mb-3 [&_h1]:tracking-tight [&_h1]:border-b [&_h1]:border-slate-800/60 [&_h1]:pb-1
                [&_h2]:text-purple-400 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:tracking-wide
                [&_h3]:text-purple-400 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-1.5
                [&_p]:mb-3 [&_p]:leading-relaxed
                [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ul]:space-y-1
                [&_li]:text-slate-300 [&_li]:leading-normal
                [&_strong]:text-white [&_strong]:font-bold
                [&_em]:text-slate-400 [&_em]:italic"
              placeholder="Escribe el contenido de tu CV aquí..."
              style={{ outline: 'none' }}
            />
          </div>
        ) : (
          /* Classical Markdown Mode */
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
