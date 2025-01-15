import { CgSpinner } from "react-icons/cg";

export function LoadingSpinner({ size = 40 }: { size?: number }) {
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center space-y-4">
          <CgSpinner className="animate-spin text-primary" size={size} />
          <p className="text-lg font-semibold">Loading...</p>
        </div>
      </div>
    </div>
  );
}
