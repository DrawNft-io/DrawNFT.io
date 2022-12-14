import { FC, useEffect, useRef, useState } from 'react';
import NavBar from '../components/Navbar';
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas';
import MintModal from '../components/mintModal/MintModal';

const Home: FC = () => {
  const [canvasBrushColor, setCanvasBrushColor] = useState<string>('#000000');
  const [canvasBrushRadius, setCanvasBrushRadius] = useState<number>(10);

  const [isCanvasDrawingMode, setIsCanvasDrawingMode] = useState<boolean>(true);

  const [showModal, setShowModal] = useState<boolean>(false);

  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [image, setImage] = useState<string | undefined>();
  const [cacheToLocalStorage, setCacheToLocalStorage] = useState<boolean>(true);

  useEffect(() => {
    try {
      const canvasPaths = localStorage.getItem('canvasPaths');
      if (canvasPaths) {
        canvasRef?.current?.clearCanvas();
        canvasRef?.current?.loadPaths(JSON.parse(canvasPaths));
      }
    } catch (e: any) {
      console.error(e);
    }
  }, []);

  return (
    <>
      <MintModal
        showModal={showModal}
        setShowModal={setShowModal}
        image={image}
      />
      <NavBar />

      <div className="w-full h-full lg:h-screen lg:flex">
        <div className="w-full relative overflow-hidden lg:w-2/3 bg-gradient-to-tr from-blue-800 to-purple-700 flex justify-around items-center">
          <div className="hidden lg:block z-10 absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
          <div className="hidden lg:block z-10 absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
          <div className="hidden lg:block z-10 absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
          <div className="hidden lg:block z-10 absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
          <div
            className={`z-10 border-2 border-sky-700 ${
              isCanvasDrawingMode ? 'cursor-pen' : 'cursor-eraser'
            }`}
          >
            <ReactSketchCanvas
              ref={canvasRef}
              strokeColor={canvasBrushColor}
              strokeWidth={canvasBrushRadius}
              eraserWidth={canvasBrushRadius}
              backgroundImage="draw-background.webp"
              exportWithBackgroundImage={false}
              width="650px"
              height="650px"
              onChange={async () => {
                const exportPaths = canvasRef.current?.exportPaths;
                if (exportPaths && cacheToLocalStorage) {
                  try {
                    localStorage.setItem(
                      'canvasPaths',
                      JSON.stringify(await exportPaths())
                    );
                  } catch (e: any) {
                    alert(
                      'The website no longer saves drawings. Reloading will cause any changes to be lost. Please enable local storage to save your drawings automatically.'
                    );
                    setCacheToLocalStorage(false);
                  }
                }
              }}
            />
          </div>
        </div>
        <div className="w-full relative overflow-hidden lg:flex justify-around items-center lg:w-1/3 p-12">
          <div className="mx-auto w-full bg-white">
            <h1 className="text-xl font-bold capitalize mb-2">
              Canvas Settings
            </h1>
            <hr />
            <div className="mt-4">
              <label>Brush Radius</label>
              <input
                onChange={(e) => {
                  const MAX_BRUSH_SIZE = 100;
                  const MIN_BRUSH_SIZE = 1;

                  setCanvasBrushRadius(
                    Math.max(
                      Math.min(MAX_BRUSH_SIZE, Number(e.target.value)),
                      MIN_BRUSH_SIZE
                    )
                  );
                }}
                id="brush-size"
                type="number"
                aria-label="ChangeBrushSize"
                defaultValue={canvasBrushRadius}
                className="border border-black w-full py-2 px-2 mt-2 focus:outline-none focus:ring"
              />
            </div>
            <div className="mt-4">
              <label>Brush Color</label>
              <input
                onChange={(e) => {
                  setCanvasBrushColor(e.target.value);
                }}
                id="color"
                type="color"
                aria-label="ChangeBrushColor"
                defaultValue={canvasBrushColor}
                className="w-full px-2 py-1 mt-2 focus:outline-none focus:ring"
              />
            </div>
            <button
              className="w-full bg-gray-700 mt-6 py-2 rounded text-white font-semibold mb-2"
              onClick={() => {
                const eraseMode = canvasRef.current?.eraseMode;
                if (eraseMode) {
                  setIsCanvasDrawingMode(true);
                  eraseMode(false);
                }
              }}
            >
              Drawing Mode
            </button>
            <button
              className="w-full bg-gray-700 mt-6 py-2 rounded text-white font-semibold mb-2"
              onClick={() => {
                const eraseMode = canvasRef.current?.eraseMode;
                if (eraseMode) {
                  eraseMode(true);
                  setIsCanvasDrawingMode(false);
                }
              }}
            >
              Erasing Mode
            </button>
            <button
              className="w-full bg-yellow-500 mt-6 py-2 rounded text-white font-semibold mb-2"
              onClick={() => {
                const undo = canvasRef.current?.undo;
                if (undo) {
                  undo();
                }
              }}
            >
              Undo
            </button>
            <button
              className="w-full bg-yellow-500 mt-6 py-2 rounded text-white font-semibold mb-2"
              onClick={() => {
                const redo = canvasRef.current?.redo;
                if (redo) {
                  redo();
                }
              }}
            >
              Redo
            </button>
            <button
              className="w-full bg-red-500 mt-6 py-2 rounded text-white font-semibold mb-2"
              onClick={() => {
                const clearCanvas = canvasRef.current?.clearCanvas;
                if (clearCanvas) {
                  clearCanvas();
                }
              }}
            >
              Erase
            </button>
            <button
              className="w-full bg-green-500 mt-6 py-2 rounded text-white font-semibold mb-2"
              onClick={() => {
                const createImage = async () => {
                  const exportImage = canvasRef.current?.exportImage;

                  if (exportImage) {
                    setImage(await exportImage('png'));
                  }
                };

                createImage().then(() => {
                  setShowModal(true);
                });
              }}
            >
              I am done with my masterpiece!
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
