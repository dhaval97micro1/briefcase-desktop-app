import HorizontalLineSkeleton from "./HorizontalLineSkeleton";
const NotesLoader = () => {
  return (
    <div className="flex-1">
      <div className="flex flex-col bg-white rounded-lg shadow-[0px_3px_16px_rgba(65,58,108,0.15)] m-6">
        <header className="p-4 bg-[rgba(217,217,217,0.38)] rounded-t-lg text-start font-bold">
          <HorizontalLineSkeleton size="22" clipPath="clip-path1" />
        </header>
        <div className="p-4">
          <HorizontalLineSkeleton size="16" clipPath="clip-path2" />
          <div className="mt-2" />
          <HorizontalLineSkeleton size="16" clipPath="clip-path3" />
        </div>
      </div>
      <div className="flex flex-col bg-white rounded-lg shadow-[0px_3px_16px_rgba(65,58,108,0.15)] m-6 mt-2">
        <header className="p-4 bg-[rgba(217,217,217,0.38)] rounded-t-lg text-start font-bold">
          <HorizontalLineSkeleton size="22" clipPath="clip-path1" />
        </header>
        <div className="p-4">
          <HorizontalLineSkeleton size="16" clipPath="clip-path2" />
          <div className="mt-2" />
          <HorizontalLineSkeleton size="16" clipPath="clip-path3" />
          <div className="mt-2" />
          <HorizontalLineSkeleton size="16" clipPath="clip-path4" />
        </div>
      </div>
      <div className="flex flex-col bg-white rounded-lg shadow-[0px_3px_16px_rgba(65,58,108,0.15)] m-6 mt-2">
        <header className="p-4 bg-[rgba(217,217,217,0.38)] rounded-t-lg text-start font-bold">
          <HorizontalLineSkeleton size="22" clipPath="clip-path1" />
        </header>
        <div className="p-4">
          <HorizontalLineSkeleton size="16" clipPath="clip-path2" />
          <div className="mt-2" />
          <HorizontalLineSkeleton size="16" clipPath="clip-path3" />
        </div>
      </div>
    </div>
  );
};

export default NotesLoader;
