import React, { useEffect, useState } from "react";
import classNames from "classnames";
import MicRecorder from "mic-recorder-to-mp3";
import { getStoredUser } from "src/helpers/storage";
import apiClient from "src/helpers/http/client";
import KeyboardIcon from "./KeyboardIcon";
import { BASE_API_URL } from "src/consts/API_URLS";
import axios from "axios";

type Props = {
  messageText: string;
  setMessageText: (value: string) => void;
  onSend: (msg: string) => void;
  isLoading?: boolean;
  files: File[] | null; // New state for files
  setFiles: (files: File[]) => void; // Function to update files state
  setFilesLoading: (filesLoading: boolean) => void; // Function to update files loading state
  openSidePanel?: () => void; // Function to update files loading state
};

const recorder = new MicRecorder({
  bitRate: 128,
});

const ReplyBox = ({
  onSend,
  messageText,
  setMessageText,
  isLoading,
  files,
  setFiles,
  setFilesLoading,
  openSidePanel,
}: Props) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [showKeyboard, setShowKeyboard] = useState<boolean>(false);
  const [isRecording, setRecording] = useState<boolean>(false);
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);

  useEffect(() => {
    let userJSONified = getStoredUser();
    if (userJSONified) {
      const userInfo = JSON.parse(userJSONified);
      setUserId(userInfo.userId);
    }
  }, []);

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (!messageText) {
      return;
    }
    onSend(messageText);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (selectedFiles.length === 0) {
        // Optionally, notify the user that their files were rejected.
        alert("Invalid file type.");
        return;
      }

      setFiles(selectedFiles);
      await uploadFiles(selectedFiles);
    }
  };

  const uploadFiles = async (filesToUpload: File[]) => {
    openSidePanel && openSidePanel();
    if (filesToUpload && userId) {
      setFilesLoading(true);
      const uploadPromises = filesToUpload.map(async (file) => {
        const file_b64 = await toBase64(file);
        const file_name = file.name;
        // Extracting file extension
        const file_extension = file_name.split(".").pop();

        const payload = {
          file_b64,
          file_name,
          file_type: file_extension,
        }; // Using file_extension instead of file_type
        const apiUrl = `/users/${userId}/files/upload`;
        return apiClient.post(apiUrl, payload);
      });

      await Promise.all(uploadPromises);
      setFilesLoading(false);
    }
  };

  const toBase64 = (file: any) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Extracting only the Base64 encoded string
        // @ts-ignore
        const base64String = reader.result.replace(/^data:.+;base64,/, ""); // @ts-nocheck
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });

  const onFileClick = () => {
    document.getElementById("file-upload")?.click();
  };
  const toggleKeyboard = () => {
    setShowKeyboard((prev) => !prev);
  };

  const onRecord = () => {
    if (isRecording) {
      onStopRecord();
    } else {
      onStartRecord();
    }
    setRecording((prev) => !prev);
  };

  const onStartRecord = async () => {
    const audio = new Audio("/audios/start.mp3");
    audio.play();
    recorder
      .start()
      .then(() => {
        setRecording(true);
        // something else
      })
      .catch((e: any) => {
        console.error(e);
        setRecording(false);
      });
  };

  const onStopRecord = async () => {
    const audio = new Audio("/audios/start.mp3");
    audio.play();
    setIsSummarizing(true);
    recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]: any) => {
        // do what ever you want with buffer and blob
        // Example: Create a mp3 file and play
        const file = new File(buffer, "new-recording.mp3", {
          type: blob.type,
          // name: "audio.mp4",
        });
        uploadToApi(file);
        console.log(JSON.stringify(file));
        // setFile(file);
      });
  };

  const uploadToApi = async (file: any) => {
    const apiUrl = `${BASE_API_URL}/transcribe`;

    // const filePath = path;

    const formData: any = new FormData();
    formData.append("key", file);

    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setIsSummarizing(false);
      console.log("response: " + JSON.stringify(response.data));
      if (response?.data?.text) {
        onSend(response?.data?.text);
      } else {
        // showError('Something went wrong');
      }
    } catch (error: any) {
      console.error("Error:", error);
      // showError(error?.message);
      setIsSummarizing(false);
    }
  };

  return (
    <form
      className="flex items-end w-full mb-4"
      onSubmit={onSubmit}
      id="reply-box"
    >
      {files !== null && (
        <button
          onClick={onFileClick}
          className="mr-2 p-2 rounded-full hover:bg-[#f1f0f0] transition duration-100"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
          >
            <path
              d="M12.6819 17.9346H27.6819C27.9053 17.9346 28.1115 17.8155 28.2232 17.6221C28.3348 17.4288 28.3348 17.1905 28.2232 16.9971C28.1115 16.8038 27.9052 16.6846 27.6819 16.6846H12.6819C12.4586 16.6846 12.2522 16.8038 12.1407 16.9971C12.029 17.1905 12.029 17.4288 12.1407 17.6221C12.2523 17.8155 12.4586 17.9346 12.6819 17.9346Z"
              fill="#1F1F1F"
            />
            <path
              d="M27.7373 21.6686H12.7373C12.514 21.6686 12.3077 21.7878 12.196 21.9811C12.0844 22.1745 12.0844 22.4128 12.196 22.6061C12.3077 22.7995 12.514 22.9186 12.7373 22.9186H27.7373C27.9606 22.9186 28.1668 22.7995 28.2785 22.6061C28.3901 22.4128 28.3901 22.1745 28.2785 21.9811C28.1668 21.7878 27.9606 21.6686 27.7373 21.6686Z"
              fill="#1F1F1F"
            />
            <path
              d="M31.7726 25.4873V13.5803C31.792 13.3946 31.7239 13.2104 31.5882 13.0821L21.5896 4.33214C21.5792 4.32316 21.5646 4.32394 21.5538 4.31561C21.482 4.26092 21.3989 4.22277 21.3108 4.20402C21.2663 4.19503 21.2219 4.18618 21.1775 4.17706H9.86346C9.38339 4.17758 8.92309 4.36834 8.58362 4.7078C8.24416 5.04713 8.05316 5.50726 8.05249 5.98736V31.1157C8.05301 31.5959 8.24403 32.0562 8.58349 32.3958C8.92295 32.7353 9.38322 32.9265 9.86342 32.9271H25.8974C26.3433 34.1967 27.2305 35.2636 28.3973 35.9336C29.5641 36.6037 30.9328 36.8321 32.254 36.5771C33.5752 36.3223 34.7607 35.6011 35.5946 34.5452C36.4285 33.4892 36.855 32.1688 36.7967 30.8246C36.7384 29.4804 36.1988 28.2019 35.2766 27.2222C34.3544 26.2425 33.1107 25.6268 31.7726 25.4875L31.7726 25.4873ZM21.8029 6.17898L29.5129 12.927H22.3629V12.9268C22.2142 12.9266 22.0717 12.8673 21.9666 12.762C21.8616 12.6568 21.8026 12.5141 21.8026 12.3654L21.8029 6.17898ZM9.86327 31.677C9.71445 31.6768 9.57174 31.6176 9.46667 31.5124C9.36147 31.4071 9.30235 31.2643 9.30235 31.1155V5.98719C9.30261 5.83863 9.36186 5.69618 9.46693 5.59109C9.57214 5.48602 9.71459 5.42703 9.8633 5.4269H20.5523V12.3656C20.5528 12.8458 20.7438 13.3061 21.0833 13.6456C21.4228 13.9852 21.883 14.1764 22.3632 14.177H30.5809V25.4873C29.4585 25.6052 28.3985 26.0614 27.5413 26.7954H12.6976C12.4743 26.7954 12.2679 26.9145 12.1564 27.1079C12.0446 27.3014 12.0446 27.5395 12.1564 27.7329C12.268 27.9264 12.4743 28.0454 12.6976 28.0454H26.4393C25.8621 28.9421 25.5541 29.9856 25.5518 31.052C25.5608 31.2614 25.5816 31.4701 25.6143 31.677L9.86327 31.677ZM31.1768 35.427C30.0165 35.427 28.9038 34.966 28.0833 34.1456C27.2627 33.3252 26.8018 32.2124 26.8018 31.052C26.8018 29.8917 27.2627 28.7789 28.0833 27.9583C28.9037 27.1379 30.0165 26.677 31.1768 26.677C32.3372 26.677 33.45 27.1379 34.2704 27.9583C35.0909 28.7789 35.5518 29.8917 35.5518 31.052C35.5505 32.2119 35.089 33.3238 34.2689 34.144C33.4488 34.9642 32.3367 35.4257 31.1768 35.427Z"
              fill="#1F1F1F"
            />
            <path
              d="M34.19 30.243L31.7828 27.8456C31.7288 27.7939 31.6656 27.7522 31.5967 27.7229C31.591 27.7203 31.5885 27.7138 31.5827 27.7114H31.5784V27.7112C31.4776 27.6733 31.3687 27.6624 31.2625 27.6795C31.2362 27.6827 31.2103 27.6878 31.1848 27.6947C31.0825 27.7185 30.9884 27.7687 30.9114 27.84L30.9027 27.8447L28.4294 30.2886V30.2887C28.3094 30.4047 28.2407 30.5641 28.2389 30.731C28.2371 30.8981 28.3021 31.0588 28.4195 31.1775C28.537 31.2963 28.697 31.3631 28.8641 31.3631C29.0311 31.3629 29.1911 31.2961 29.3085 31.1773L30.7195 29.7833L30.7268 33.8163V33.8164C30.7271 33.9819 30.7931 34.1406 30.9103 34.2575C31.0275 34.3746 31.1863 34.4402 31.3518 34.4402H31.3531C31.5189 34.4399 31.6777 34.3737 31.7947 34.2562C31.9116 34.1389 31.9772 33.9798 31.9768 33.814L31.9698 29.796L33.3087 31.1295C33.4255 31.2497 33.5858 31.3179 33.7534 31.3188C33.921 31.3199 34.0819 31.2535 34.2001 31.1346C34.3183 31.0157 34.3838 30.8544 34.3819 30.6868C34.3799 30.5191 34.3108 30.3593 34.19 30.2431L34.19 30.243Z"
              fill="#1F1F1F"
            />
          </svg>
        </button>
      )}
      <input
        type="file"
        id="file-upload"
        multiple
        style={{ display: "none" }}
        onChange={onFileChange}
      />
      <div className="flex flex-col w-full justify-center items-center overflow-hidden">
        <div
          className={classNames(
            "group rounded-full cursor-pointer transition duration-100",
            {
              "animate-pulse bg-gray-100": isRecording,
            }
          )}
          onClick={onRecord}
        >
          <svg
            width="87"
            height="87"
            viewBox="0 0 87 87"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="43.5"
              cy="43.5"
              r="42.5"
              stroke="#BBBBBB"
              stroke-width="1"
              className="stroke-[#BBBBBB] group-hover:stroke-black duration-100 transition"
            />
            <circle
              cx="43.5"
              cy="43.5"
              r="38.25"
              className={classNames("fill-white", {
                "fill-red-500": isRecording,
              })}
            />
            <path
              d="M42.2286 57.5335V57.0961L41.795 57.038C35.5533 56.2008 30.7184 50.8525 30.7184 44.3852C30.7184 43.6829 31.287 43.1143 31.9893 43.1143C32.6915 43.1143 33.2601 43.6829 33.2601 44.3852C33.2601 50.0317 37.8535 54.625 43.5 54.625C49.1465 54.625 53.7398 50.0314 53.7398 44.3852C53.7398 43.6829 54.3084 43.1143 55.0107 43.1143C55.6948 43.1143 56.252 43.6538 56.2804 44.3309V44.3852C56.2804 50.8503 51.4456 56.2007 45.2038 57.038L44.7702 57.0961V57.5335V61.208V61.708H45.2702H47.0411C47.7433 61.708 48.3119 62.2766 48.3119 62.9788C48.3119 63.6811 47.7433 64.2497 47.0411 64.2497H39.9577C39.2555 64.2497 38.6869 63.6811 38.6869 62.9788C38.6869 62.2766 39.2555 61.708 39.9577 61.708H41.7286H42.2286V61.208V57.5335Z"
              stroke="#959595"
              fill="#F3F3F3"
              className="fill-[#F3F3F3] group-hover:stroke-black duration-100 transition"
            />
            <path
              d="M50.9685 43.5C50.9685 47.6175 47.6177 50.9685 43.5 50.9685C39.3825 50.9685 36.0315 47.6177 36.0315 43.5V30.2185C36.0315 26.101 39.3825 22.75 43.5 22.75C47.6175 22.75 50.9685 26.1007 50.9685 30.2185V43.5Z"
              stroke="#959595"
              fill="#F3F3F3"
              className="fill-[#F3F3F3] group-hover:stroke-black duration-100 transition"
            />
          </svg>
        </div>
        <input
          placeholder="Start typing…"
          value={messageText}
          onChange={onChange}
          className={classNames(
            "w-full transition-all duration-200 outline-none focus:outline-none rounded-[30px] bg-[#f1f0f0] h-[54px] px-7 mt-5",
            {
              "h-0 mt-0": !showKeyboard,
            }
          )}
        />
      </div>
      <button className="ml-4 mb-2" onClick={toggleKeyboard}>
        <KeyboardIcon />
      </button>
    </form>
  );
};

export default ReplyBox;
