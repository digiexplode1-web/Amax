import { Component, ReactNode, ErrorInfo } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AdminErrorBoundary extends (Component as any) {
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
    console.error("ADMIN RENDER ERROR:", error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FFF9F0] p-6 flex flex-col items-center justify-center font-sans text-[#25201E]">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-[#F4E3DD] shadow-xl text-center space-y-4">
            <div className="w-14 h-14 bg-red-100 text-[#751C2F] rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-serif font-bold text-[#25201E]">Admin Panel Render Notice</h2>
            <p className="text-xs text-[#756A64]">
              An unexpected error occurred while displaying this admin view.
            </p>
            {this.state.error?.message && (
              <div className="bg-red-50 p-3 rounded-lg text-left text-xs font-mono text-red-800 border border-red-200 overflow-x-auto max-h-32">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-5 py-2.5 bg-[#751C2F] text-white text-xs font-bold rounded-xl hover:bg-[#591423] transition-colors inline-flex items-center gap-2 cursor-pointer shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Admin Area
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
