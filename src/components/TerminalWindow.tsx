import React, { ReactNode } from 'react';

interface TerminalWindowProps {
  title?: string;
  children: ReactNode;
  statusBar?: ReactNode;
  /** Tailwind max-width for the content column. Widened for pages built around a figure. */
  maxWidth?: string;
}

const TerminalWindow: React.FC<TerminalWindowProps> = ({
  title = 'ryan@ryan.science: ~',
  children,
  statusBar,
  maxWidth = 'max-w-3xl',
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-tui-bg-dark">
      {/* Title Bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-2 bg-tui-bg border-b border-tui-border">
        <div className="w-[52px]" />
        <span className="text-xs text-tui-dim">{title}</span>
        <div className="w-[52px]" />
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className={`${maxWidth} mx-auto px-6 py-8`}>
          {children}
        </div>
      </div>

      {/* Status Bar */}
      {statusBar && (
        <div className="sticky bottom-0 z-10 flex items-center justify-between px-4 py-2 bg-tui-bg border-t border-tui-border text-xs">
          {statusBar}
        </div>
      )}

      {/* CRT Scanlines */}
      <div className="scanlines" />
    </div>
  );
};

export default TerminalWindow;
