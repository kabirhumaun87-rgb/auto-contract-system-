import React, { useState } from 'react';
import { 
  Bot, 
  User, 
  Copy, 
  Check, 
  Sparkles, 
  AlertCircle, 
  RotateCcw,
  CheckCheck
} from 'lucide-react';
import { ChatMessage } from '../services/geminiChatService';

interface ChatMessageBubbleProps {
  message: ChatMessage;
  onRetry?: () => void;
  roleTitle?: string;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ 
  message, 
  onRetry,
  roleTitle 
}) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Render markdown-like simple formatting (headers, bold, lists, code blocks)
  const renderFormattedContent = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBuffer: string[] = [];

    lines.forEach((line, idx) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // Closing code block
          const codeContent = codeBuffer.join('\n');
          elements.push(
            <div key={`code-${idx}`} className="my-2 bg-slate-900 text-slate-100 rounded-md p-3 font-mono text-xs overflow-x-auto relative group">
              <pre>{codeContent}</pre>
            </div>
          );
          codeBuffer = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      // Headers
      if (line.startsWith('### ')) {
        elements.push(
          <h4 key={idx} className="font-bold text-sm text-slate-900 mt-2 mb-1">
            {formatInlineText(line.replace('### ', ''))}
          </h4>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h3 key={idx} className="font-bold text-base text-slate-900 mt-3 mb-1 pb-1 border-b border-slate-200">
            {formatInlineText(line.replace('## ', ''))}
          </h3>
        );
      } else if (line.startsWith('# ')) {
        elements.push(
          <h2 key={idx} className="font-bold text-lg text-slate-900 mt-3 mb-1">
            {formatInlineText(line.replace('# ', ''))}
          </h2>
        );
      } else if (line.match(/^[\*\-]\s+/)) {
        // Bullet list
        elements.push(
          <li key={idx} className="ml-4 list-disc text-xs text-slate-700 my-0.5 leading-relaxed">
            {formatInlineText(line.replace(/^[\*\-]\s+/, ''))}
          </li>
        );
      } else if (line.match(/^\d+\.\s+/)) {
        // Numbered list
        const match = line.match(/^(\d+)\.\s+(.*)/);
        if (match) {
          elements.push(
            <div key={idx} className="ml-4 flex items-start gap-1.5 text-xs text-slate-700 my-0.5 leading-relaxed">
              <span className="font-semibold text-blue-600 shrink-0">{match[1]}.</span>
              <span>{formatInlineText(match[2])}</span>
            </div>
          );
        } else {
          elements.push(<p key={idx} className="text-xs text-slate-700 my-1">{formatInlineText(line)}</p>);
        }
      } else if (line.trim() === '') {
        elements.push(<div key={idx} className="h-2" />);
      } else {
        elements.push(
          <p key={idx} className="text-xs text-slate-800 leading-relaxed my-1">
            {formatInlineText(line)}
          </p>
        );
      }
    });

    if (inCodeBlock && codeBuffer.length > 0) {
      elements.push(
        <div key="code-unclosed" className="my-2 bg-slate-900 text-slate-100 rounded-md p-3 font-mono text-xs overflow-x-auto">
          <pre>{codeBuffer.join('\n')}</pre>
        </div>
      );
    }

    return elements;
  };

  // Format bold (**text**), code (`code`), currency
  const formatInlineText = (str: string): React.ReactNode => {
    // Process markdown inline tokens
    const parts = str.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1 py-0.5 bg-slate-100 text-blue-700 rounded text-[11px] font-mono border border-slate-200">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  if (isUser) {
    return (
      <div className="flex justify-end gap-3 mb-4 group">
        <div className="max-w-2xl flex flex-col items-end">
          <div className="bg-slate-900 text-white px-4 py-2.5 rounded-2xl rounded-tr-sm shadow-sm text-xs leading-relaxed whitespace-pre-wrap selection:bg-blue-500">
            {message.content}
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-400 font-mono">
            <span>{formattedTime}</span>
            <CheckCheck className="w-3 h-3 text-blue-500" />
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-sm border border-slate-700">
          <User className="w-4 h-4 text-slate-300" />
        </div>
      </div>
    );
  }

  // Assistant message
  return (
    <div className="flex justify-start gap-3 mb-5 group">
      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
        <Sparkles className="w-4 h-4 text-white" />
      </div>

      <div className="max-w-3xl flex-1 min-w-0">
        {/* Header tags */}
        <div className="flex items-center gap-2 mb-1.5">
          <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
            Gemini Assistant
            {roleTitle && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                {roleTitle}
              </span>
            )}
          </span>
          {message.modelUsed && (
            <span className="text-[10px] font-mono text-slate-400">
              {message.modelUsed}
            </span>
          )}
          <span className="text-[10px] text-slate-400 ml-auto font-mono">{formattedTime}</span>
        </div>

        {/* Bubble Card */}
        <div className={`p-4 rounded-2xl rounded-tl-sm border shadow-sm ${
          message.isError 
            ? 'bg-rose-50 border-rose-200 text-rose-800' 
            : 'bg-white border-slate-200 text-slate-800'
        }`}>
          {message.isError ? (
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs">
                <p className="font-semibold text-rose-900 mb-1">Response Generation Failed</p>
                <p className="text-rose-700 mb-2">{message.content}</p>
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-rose-300 hover:bg-rose-50 text-rose-800 rounded text-[11px] font-medium shadow-xs transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Retry prompt
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {renderFormattedContent(message.content)}
            </div>
          )}

          {/* Action Footer */}
          {!message.isError && (
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-400">
              <span className="text-[10px] text-slate-400">Verified by Auto Contract System</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] px-2 py-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                title="Copy response to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-600 font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
