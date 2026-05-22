"use client";

import { useState, useEffect } from 'react';
import { Eye, Download, FileText, Loader2 } from 'lucide-react';

interface PdfViewerProps {
  cvId: string;
  version: number;
}

export default function PdfViewer({ cvId, version }: PdfViewerProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
  }, [version, cvId]);

  const pdfUrl = `/api/pdf?cvId=${cvId}&v=${version}`;

  return (
    <div className="flex flex-col h-full glass-card border border-slate-800 bg-slate-950/40 rounded-3xl overflow-hidden shadow-2xl relative">
      
      {/* Barra de cabecera */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-slate-900 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <Eye className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-200 tracking-wide uppercase">Vista Previa PDF</span>
        </div>

        {/* Descargar PDF */}
        <a
          href={`/api/pdf?cvId=${cvId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-200 hover:text-white transition-all"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span>Descargar PDF</span>
        </a>
      </div>

      {/* Contenedor del Iframe */}
      <div className="flex-1 bg-[#1e293b]/10 relative flex items-center justify-center p-4">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#030712]/60 backdrop-blur-sm z-10 gap-3">
            <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
            <p className="text-slate-400 text-xs font-semibold tracking-wide uppercase">Generando PDF en tiempo real...</p>
          </div>
        )}
        
        <iframe
          src={pdfUrl}
          className="w-full h-full rounded-2xl border border-slate-900 shadow-lg bg-slate-950"
          onLoad={() => setLoading(false)}
          title="Vista Previa de CV"
        />
      </div>
    </div>
  );
}
