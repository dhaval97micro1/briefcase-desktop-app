import { FileType } from "src/helpers/types/file.types";
import WrappedContent from "../WrappedContent";
import apiClient from "src/helpers/http/client";
import { getStoredUser } from "src/helpers/storage";
import { useState, useEffect } from "react";
import { Cross1Icon } from "@radix-ui/react-icons";

type Props = {
	file: FileType;
	files: FileType[];
	setFiles: React.Dispatch<React.SetStateAction<FileType[]>>;
};

const FileTag = ({ file, files, setFiles }: Props) => {
	const [userId, setUserId] = useState<string>("");

	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		let userJSONified = getStoredUser();
		if (userJSONified) {
			const userInfo = JSON.parse(userJSONified);
			setUserId(userInfo.userId);
		}
	}, []);

	async function handleDeleteFile(fileId: string) {
		setLoading(true);
		try {
			await apiClient.delete(`/users/${userId}/files/${fileId}`);
			// Remove the file from the list of files
			const newFiles = files.filter((file) => file.id !== fileId);
			setFiles(newFiles);
			setLoading(false);
		} catch (error) {
			console.error(error);
			setLoading(false);
		}
	}

	const spinner = (
		<span className="relative flex h-3 w-3">
			<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
			<span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
		</span>
	);


	return (
		<div className="flex items-center gap-2 bg-white p-2 rounded-md mb-4 whitespace-nowrap shadow-sm">
			<div className="flex items-center justify-center bg-[rgba(248,248,248,1)] text-blue-600 font-bold uppercase text-xs bg-[rgba(248,248,248,1)] rounded-lg h-14 w-14 p-4">
				{file.fileClass}
			</div>
			<WrappedContent className="text-start">
				<div className="text-black font-medium">{file.fileName.replace(".json", "")}</div>
			</WrappedContent>
      {loading ? spinner : <Cross1Icon className="w-4 h-4 ml-1" onClick={() => handleDeleteFile(file.id)} />}
		</div>
	);
};

export default FileTag;
