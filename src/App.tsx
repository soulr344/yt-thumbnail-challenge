import { useMemo, useRef, useState } from "react";
import useMeasure from "react-use-measure";

function App() {
  const [hiddenImageRef, hiddenImageBounds] = useMeasure();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hiddenImageRef2 = useRef<HTMLImageElement>(null);

  const [file, setFile] = useState<File | null>();
  const [isDownloading, setIsDownloading] = useState(false);

  const fileUrl = useMemo(() => {
    return file ? URL.createObjectURL(file) : null;
  }, [file]);

  const preview = (bgColor?: string) => {
    if (!fileUrl || !canvasRef.current) return;

    const MAX_DIM = Math.max(hiddenImageBounds.width, hiddenImageBounds.height);

    const ctx = canvasRef.current.getContext("2d")!;

    ctx.fillStyle = bgColor || "white";
    ctx.fillRect(0, 0, MAX_DIM, MAX_DIM);

    const dx = (MAX_DIM - hiddenImageBounds.width) / 2;
    const dy = (MAX_DIM - hiddenImageBounds.height) / 2;

    ctx.drawImage(
      hiddenImageRef2.current!,
      dx || 0,
      dy || 0,
      hiddenImageBounds.width,
      hiddenImageBounds.height
    );
  };

  const download = () => {
    if (!canvasRef.current || !file) {
      return alert("Some Error Occured.");
    }
    setIsDownloading(true);
    setTimeout(() => {
      const a = document.createElement("a");
      a.href = canvasRef.current?.toDataURL() || "";

      a.download = `Thumbnail_${file?.name}`;

      a.hidden = true;

      document.body.append(a);
      a.click();
      a.remove();
      setIsDownloading(false);
    }, 0);
  };

  const PREVIEW_CANVAS_WIDTH = Math.max(
    hiddenImageBounds.height,
    hiddenImageBounds.width
  );

  return (
    <div className="min-h-dvh bg-neutral-800 text-white p-6">
      <div className="flex flex-col gap-6">
        <input
          type="file"
          onChange={(e) => {
            const files = e.target.files;
            const file = files?.item(0);

            setFile(file);
          }}
        ></input>
        <div className="flex gap-6">
          <button
            className="bg-orange-500 transition px-4 py-1 rounded  hover:bg-orange-600"
            onClick={() => preview()}
          >
            Preview
          </button>
          <button
            onClick={download}
            className="bg-orange-500 transition px-4 py-1 rounded  hover:bg-orange-600"
          >
            Download
          </button>
        </div>
        <p>Status: {isDownloading ? "Downloading" : null}</p>
        <div className="flex gap-6">
          <button
            className="bg-orange-500 transition px-4 py-1 rounded  hover:bg-orange-600"
            onClick={() => preview("white")}
          >
            White BG
          </button>
          <button
            onClick={() => preview("black")}
            className="bg-orange-500 transition px-4 py-1 rounded  hover:bg-orange-600"
          >
            Black BG
          </button>
        </div>
      </div>

      {file && (
        <p>
          File Uploaded {file?.name}
          <br />
          Dimensions: {hiddenImageBounds.width}x{hiddenImageBounds.height}
        </p>
      )}

      {fileUrl && (
        <div className="sr-only">
          <img
            ref={(e) => {
              hiddenImageRef(e);
              (hiddenImageRef2 as any).current = e;
            }}
            src={fileUrl}
            className="absolute"
            style={{
              // tailwind/reset
              height: "auto",
              minHeight: "auto",
              maxHeight: "unset",
              width: "auto",
              maxWidth: "unset",
              minWidth: "auto",
            }}
          />
        </div>
      )}

      <canvas
        ref={canvasRef}
        height={PREVIEW_CANVAS_WIDTH}
        width={PREVIEW_CANVAS_WIDTH}
        className="w-[400px] h-[400px]"
      ></canvas>
    </div>
  );
}

export default App;
