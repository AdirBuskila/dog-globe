import { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/** Error boundary wrapping the Globe to catch Three.js errors gracefully */
export class GlobeErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-[#050A0E]">
          <div className="text-center max-w-md px-6">
            <h2 className="text-[#E8EDF0] text-xl font-semibold mb-2">
              Something went wrong
            </h2>
            <p className="text-[#E8EDF0]/50 text-sm mb-4">
              The 3D globe encountered an error. Try refreshing the page.
            </p>
            <pre className="text-red-400/60 text-xs overflow-auto max-h-32 mb-4">
              {this.state.error?.message}
            </pre>
            <button
              className="px-4 py-2 rounded-lg bg-[#00FFB3]/20 text-[#00FFB3]
                border border-[#00FFB3]/30 hover:bg-[#00FFB3]/30 transition-colors"
              onClick={() => window.location.reload()}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
