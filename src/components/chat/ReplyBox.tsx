import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { FileIcon } from "@radix-ui/react-icons"; // Assuming Radix icons are used
import { getStoredUser } from "src/helpers/storage";
import apiClient from "src/helpers/http/client";

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
      for (const file of filesToUpload) {
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
        setFilesLoading(true);
        await apiClient.post(apiUrl, payload);
        setFilesLoading(false);
      }
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

  return (
    <form
      className="flex items-center w-full"
      onSubmit={onSubmit}
      id="reply-box"
    >
      {files !== null && (
        <button
          onClick={onFileClick}
          className="mr-2 p-2 rounded-full hover:bg-[#f1f0f0] transition duration-100 border border-solid border-[#f1f0f0]"
          type="button"
        >
          <FileIcon className="w-6 h-6" />
        </button>
      )}
      <input
        type="file"
        id="file-upload"
        multiple
        style={{ display: "none" }}
        onChange={onFileChange}
      />
      <input
        placeholder="Start typing…"
        value={messageText}
        onChange={onChange}
        className="w-full focus:outline-none rounded-[30px] bg-[#f1f0f0] h-[60px] px-7"
      />
      <button
        onClick={(e) => {
          onSubmit(e);
        }}
        disabled={messageText === "" || isLoading}
        className={classNames("p-2 rounded-full", {
          "cursor-pointer hover:bg-[lightgray]":
            messageText !== "" && !isLoading,
          "opacity-60": messageText === "" || isLoading,
        })}
      ></button>
    </form>
  );
};

export default ReplyBox;
