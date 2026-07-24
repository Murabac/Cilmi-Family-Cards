"use client";

import { Component, type ReactNode } from "react";

export class SceneErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex h-full items-center justify-center p-6 text-center">
          <div>
            <p className="font-bold text-[#F0E6D6]">3D view failed</p>
            <p className="mt-1 text-sm text-[#8FA8B5]">{this.state.error.message}</p>
            <button
              type="button"
              className="mt-3 rounded-full bg-[#E07A3D] px-4 py-2 text-sm font-bold text-[#F0E6D6]"
              onClick={() => this.setState({ error: null })}
            >
              Retry
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
