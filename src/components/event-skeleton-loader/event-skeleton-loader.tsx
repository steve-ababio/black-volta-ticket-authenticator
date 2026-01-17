export function EventsSkeleton() {
    return (
      <>
        <style>
          {`
            @keyframes shimmer {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
  
            @keyframes cardEnter {
              from {
                opacity: 0;
                transform: translateY(24px) scale(0.96);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
          `}
        </style>
  
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{ animationDelay: `${i * 120}ms` }}
              className="
                bg-white rounded-2xl overflow-hidden shadow-lg
                animate-[cardEnter_0.5s_ease-out_forwards]
                opacity-0
              "
            >
              {/* Image skeleton */}
              <div
                className="
                  relative h-[360px]
                  bg-[linear-gradient(100deg,#e5e7eb_40%,#f3f4f6_50%,#e5e7eb_60%)]
                  bg-[length:200%_100%]
                  animate-[shimmer_1.4s_linear_infinite]
                "
              >
                <div className="absolute top-4 left-4 w-14 h-14 rounded-xl bg-gray-300" />
                <div className="absolute top-4 right-4 w-16 h-7 rounded-full bg-gray-300" />
              </div>
  
              {/* Content */}
              <div className="p-5 space-y-4">
                <div
                  className="
                    h-5 w-2/3 rounded-md
                    bg-[linear-gradient(100deg,#e5e7eb_40%,#f3f4f6_50%,#e5e7eb_60%)]
                    bg-[length:200%_100%]
                    animate-[shimmer_1.4s_linear_infinite]
                  "
                />
  
                {[1, 2].map((row) => (
                  <div key={row} className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-gray-300" />
                    <div
                      className="
                        h-3 rounded
                        w-1/2
                        bg-[linear-gradient(100deg,#e5e7eb_40%,#f3f4f6_50%,#e5e7eb_60%)]
                        bg-[length:200%_100%]
                        animate-[shimmer_1.4s_linear_infinite]
                      "
                    />
                  </div>
                ))}
  
                <div
                  className="
                    h-11 rounded-xl mt-4
                    bg-[linear-gradient(100deg,#e5e7eb_40%,#f3f4f6_50%,#e5e7eb_60%)]
                    bg-[length:200%_100%]
                    animate-[shimmer_1.4s_linear_infinite]
                  "
                />
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }
  