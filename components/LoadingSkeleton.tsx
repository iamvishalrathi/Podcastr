import React from 'react'

const LoadingSkeleton = () => {
    return (
        <div className="absolute inset-0 overflow-hidden backdrop-blur-sm">
            {/* Enhanced gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-black-1/40 to-black-1/20">
                <div className="h-full w-full animate-[shimmer_2s_infinite] bg-[length:200%_100%]
        bg-gradient-to-r from-transparent via-orange-1/10 to-transparent" />
            </div>

            {/* Premium loading animation */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-32 h-32">
                    {/* Outer rotating ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-orange-1/20 animate-[spin_3s_linear_infinite]" />

                    {/* Inner pulsing circle */}
                    <div className="absolute inset-4 rounded-full bg-gradient-to-br from-orange-1/20 to-orange-400/20 
          animate-pulse backdrop-blur-xl" />

                    {/* Center icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                            className="w-12 h-12 text-orange-1/30"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Enhanced grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),
        linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]
        bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]" />
        </div>
    );
}

export default LoadingSkeleton
