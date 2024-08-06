export default function Grid() {
  // grid pattern on dark background
  // lines 8 rem apart
  // columns 8 rem apart

  const columns = 50;
  const rows = 20;

  return (
    <div className="absolute">
      <div className="relative flex justify-center opacity-20">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={`col-${i}`} className="flex flex-col">
            {Array.from({ length: rows }).map((_, j) => (
              <div
                key={`square-${i}-${j}`}
                className="h-16 w-16 border border-zinc-600"
              ></div>
            ))}
          </div>
        ))}
      </div>
      <div className="grid-bg"></div>
    </div>
  );
}
