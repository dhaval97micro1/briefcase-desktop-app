import classNames from "classnames";
import { useEffect, useState } from "react";
import FileTag from "src/components/chat/FileTag";
import Spinner from "src/components/spinner";
import docs from "src/helpers/http/docs";
import { showError } from "src/helpers/mics";
import { getStoredUser } from "src/helpers/storage";
import { FileType } from "src/helpers/types/file.types";

type Props = {
  show: boolean;
  onClose: () => void;
  fileType: string;
  filesLoading: boolean;
};

const FilesMenu = ({ show, onClose, fileType, filesLoading }: Props) => {
  const [files, setFiles] = useState<FileType[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    let userJSONified = getStoredUser();
    if (userJSONified) {
      const userInfo = JSON.parse(userJSONified);
      setUserId(userInfo.userId);
    }
  }, [fileType]);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    const payload = {
      userId,
      fileType,
    };
    docs
      .getFilesList(payload)
      .then((res) => {
        // Reverse the array to show the latest files first
        res.reverse();
        setFiles(res);
        setLoading(false);
      })
      .catch((error) => {
        showError(error + "");
        setLoading(false);
      });
  }, [userId, filesLoading, fileType]);

  return (
    <div
      className={classNames(
        "transition-all duration-300 flex flex-col bg-[rgba(248,248,248,1)] rounded-lg",
        {
          "opacity-0 w-[0px] overflow-hidden p-0": !show,
          "w-[30%] p-4": show,
        }
      )}
    >
      <header className="flex items-center justify-between mb-4">
        <div className="text-lg font-semibold">Documents</div>

        <button
          className="cursor-pointer rounded-lg hover:bg-[#efecec]"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="29"
            height="29"
            viewBox="0 0 29 29"
            fill="none"
          >
            <path
              d="M20.9696 8.88619L15.3545 14.5001L20.9696 20.114H20.9695C21.1223 20.2669 21.182 20.4896 21.1261 20.6984C21.0701 20.9071 20.9071 21.0701 20.6984 21.1261C20.4896 21.182 20.2669 21.1223 20.114 20.9695L14.5001 15.3544L8.88619 20.9695C8.73336 21.1223 8.51067 21.182 8.30184 21.1261C8.09312 21.0701 7.93009 20.9071 7.87412 20.6984C7.81823 20.4896 7.87789 20.2669 8.03073 20.114L13.6459 14.5001L8.03073 8.88619C7.87789 8.73336 7.81823 8.51067 7.87412 8.30184C7.9301 8.09312 8.09313 7.93009 8.30184 7.87412C8.51066 7.81823 8.73334 7.87789 8.88619 8.03073L14.5001 13.6459L20.114 8.03073V8.03082C20.2669 7.87799 20.4896 7.81832 20.6984 7.87421C20.9071 7.93019 21.0701 8.09322 21.1261 8.30194C21.182 8.51075 21.1223 8.73343 20.9695 8.88629L20.9696 8.88619Z"
              fill="#9A9595"
            />
          </svg>
        </button>
      </header>
      {(filesLoading || loading) && (
        <div className="h-[50px] flex justify-center mb-4">
          <Spinner />
        </div>
      )}
      <div className="flex flex-col max-h-full overflow-y-auto overflow-x-hidden">
        {files.map((file: FileType) => (
          <FileTag key={file.id} file={file} files={files} setFiles={setFiles} />
        ))}
        {!filesLoading && files.length === 0 && !loading && (
          <span className="bg-blue-500 text-white px-2 py-1 rounded-full mr-2 whitespace-nowrap">
            No files found
          </span>
        )}{" "}
      </div>
    </div>
  );
};

export default FilesMenu;
