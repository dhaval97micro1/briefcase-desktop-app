import { FileType } from "src/helpers/types/file.types";
import WrappedContent from "../WrappedContent";

type Props = {
  file: FileType;
};

const FileTag = ({ file }: Props) => {
  return (
    <div className="flex items-center gap-2 bg-white p-2 rounded-md mb-4 whitespace-nowrap shadow-sm">
      <div className="flex items-center justify-center bg-[rgba(248,248,248,1)] text-blue-600 font-bold uppercase text-xs bg-[rgba(248,248,248,1)] rounded-lg h-14 w-14 p-4">
        {file.file_type}
      </div>
      <WrappedContent className="text-start">
        <div className="text-black font-medium">{file.file_name}</div>
      </WrappedContent>
    </div>
  );
};

export default FileTag;
