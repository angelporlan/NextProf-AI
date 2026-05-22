"use client";

import { useState, useEffect, useRef } from 'react';
import { saveCvContent } from '@/app/dashboard/actions';
import { FileEdit, Check, RefreshCw, AlertCircle } from 'lucide-react';

interface MarkdownEditorProps {
  cvId: string;
  initialContent: string;
  onSave?: () => void;
}

export default function MarkdownEditor({ cvId, initialContent, onSave }: MarkdownEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sincronizar el contenido si cambia desde el exterior (ej. optimización por IA)
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
    }, 1500); // 1.5 segundos de debounce
  };

  // Limpiar temporizador al desmontar
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-full glass-card border border-slate-800 bg-slate-950/40 rounded-3xl overflow-hidden shadow-2xl relative">
      
      {/* Barra de título del editor */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-slate-900 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-sky-500/10 text-sky-400 rounded-lg">
            <FileEdit className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-200 tracking-wide uppercase">Contenido Markdown</span>
        </div>

        {/* Estado del Guardado Autodebouncificado */}
        <div className="flex items-center gap-2">
          {saveStatus === 'saved' && (
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <Check className="w-3 h-3" />
              Guardado en la nube
            </span>
          )}
          {saveStatus === 'saving' && (
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Guardando cambios...
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
              <AlertCircle className="w-3 h-3" />
              Error de conexión
            </span>
          )}
        </div>
      </div>

      {/* Textarea del editor en Markdown */}
      <div className="flex-1 p-6 relative bg-slate-950/20">
        <textarea
          value={content}
          onChange={handleChange}
          className="w-full h-full bg-transparent text-slate-300 font-mono text-sm leading-relaxed focus:outline-none resize-none selection:bg-sky-500/30 scrollbar-custom"
          placeholder="# Escribe aquí en Markdown..."
          spellCheck="false"
        />
      </div>

      {/* Mini guía rápida */}
      <div className="px-6 py-2.5 bg-slate-950/70 border-t border-slate-900 shrink-0 flex items-center justify-between text-[10px] text-slate-500 font-light">
        <span>Soporta sintaxis Markdown estándar: ## Títulos, **Negrita**, *Cursiva*, - Listas.</span>
        <span>Autoguardado activado</span>
      </div>
    </div>
  );
}
