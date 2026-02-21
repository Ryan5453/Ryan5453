import React, { ReactNode } from 'react';

interface TerminalWindowProps {
  title?: string;
  children: ReactNode;
  statusBar?: ReactNode;
}

const TerminalWindow: React.FC<TerminalWindowProps> = ({
  title = 'ryan@ryan.science: ~',
  children,
  statusBar,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-tui-bg-dark">
      {/* Title Bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-2 bg-tui-bg border-b border-tui-border">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ff5f57' }} />
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#febc2e' }} />
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#28c840' }} />
        </div>
        <span className="text-xs text-tui-dim">{title}</span>
        <div className="w-[52px]" />
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="max-w-3xl mx-auto px-6 py-8">
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
