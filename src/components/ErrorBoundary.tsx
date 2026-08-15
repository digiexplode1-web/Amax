import { Component, ReactNode, ErrorInfo } from 'react';
import { RefreshCw, AlertTriangle, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends (Component as any) {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFF9F0] text-[#25201E] flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="bg-white border border-[#C7953E]/30 rounded-2xl p-8 max-w-lg shadow-xl relative overflow-hidden">
            <div className="w-16 h-16 bg-[#F4E3DD] text-[#751C2F] rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <h1 className="text-2xl font-serif font-bold text-[#751C2F] mb-2">
              Amax Crafts
            </h1>
            <p className="text-sm font-semibold text-[#C7953E] uppercase tracking-wider mb-4">
              Application Notice
            </p>

            <p className="text-[#756A64] text-sm mb-6 leading-relaxed">
              An unexpected error occurred while rendering this page. The Amax Crafts application shell has captured the error gracefully.
            </p>

            {this.state.error && (
              <div className="bg-[#FFF9F0] text-xs font-mono text-left text-red-800 p-3 rounded-lg border border-red-200 mb-6 overflow-x-auto max-h-36">
                <strong>Error:</strong> {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#751C2F] text-white rounded-lg font-medium hover:bg-[#591423] transition-colors shadow-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Retry & Reload
              </button>
              
              <a
                href="#/"
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.hash = '#/';
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#F4E3DD] text-[#751C2F] rounded-lg font-medium hover:bg-[#ebd5cd] transition-colors"
              >
                <Home className="w-4 h-4" />
                Return to Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
