"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[REACT_ERROR_BOUNDARY_CAUGHT]", error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 border border-red-200 bg-red-50 text-red-950 rounded-lg space-y-3">
          <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
            <AlertCircle className="w-5 h-5" />
            <span>{this.props.fallbackTitle || "Component Render Failed"}</span>
          </div>
          <p className="text-xs text-red-800 font-mono">
            {this.state.error?.message || "An unexpected rendering error was caught by the boundary."}
          </p>
          <button
            onClick={this.handleReset}
            className="px-3 py-1.5 text-xs font-mono font-bold bg-red-600 hover:bg-red-700 text-white rounded flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry Component</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
