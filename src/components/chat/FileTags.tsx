import React, { useState, useEffect } from "react";
import { getStoredUser } from "src/helpers/storage";
import apiClient from "src/helpers/http/client";
import { Cross1Icon } from "@radix-ui/react-icons";
interface FileTagsProps {
	fileType: string;
	filesLoading: boolean;
}

const FileTags: React.FC<FileTagsProps> = ({ fileType, filesLoading }) => {
	console.log("fileType", fileType);
	const [files, setFiles] = useState<any[]>([]);
	const [userId, setUserId] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
	useEffect(() => {
		let userJSONified = getStoredUser();
		console.log("userJSONified", userJSONified);
		if (userJSONified) {
			console.log("userJSONified is true", userJSONified);
			const userInfo = JSON.parse(userJSONified);
			console.log("userInfo UserID", userInfo.userId);
			setUserId(userInfo.userId);
		}
	}, [fileType]);

	const fetchFiles = () => {
		if (!userId) return;
		console.log("userId", userId);
		setLoading(true);

		apiClient.get(`/users/${userId}/files?file_type=${fileType}`)
			.then((response) => response.data)
			.then((data) => {
				const files = data;
				setFiles(files);
				setLoading(false);
			})
			.catch((error) => {
				console.error(error);
				setLoading(false);
			});
	};

	useEffect(() => {
		fetchFiles();
	}, [userId, filesLoading]);


	async function handleDeleteFile(fileId: string) {
		console.log("fileId", fileId);
		setLoading(true);
		try {
			await apiClient.delete(`/users/${userId}/files/${fileId}`);
			await fetchFiles();
			setLoading(false);
		} catch (error) {
			console.error(error);
			setLoading(false);
		}
	}

	return (
		<div className="overflow-x-auto bg-white  max-w-2xl no-scrollbar">
			<div className="flex p-1 ">
				{filesLoading && (
					<span className="bg-green-500 text-white px-2 py-1 rounded-full ml-2 whitespace-nowrap">
						Loading...
					</span>
				)}
				{files.map((file) => (
					<span className="bg-blue-500 text-white px-2 py-1 rounded-full mr-2 whitespace-nowrap">
						{file?.file_name}
						<Cross1Icon className="inline-block w-4 h-4 ml-1" onClick={() => handleDeleteFile(file.file_id)} />
					</span>
				))}
                {
                    !filesLoading && files.length === 0 && !loading && (
                        <span className="bg-blue-500 text-white px-2 py-1 rounded-full mr-2 whitespace-nowrap">
                            No files found
                        </span>
                    )
                } {
                    loading && (
                        <span className="bg-blue-500 text-white px-2 py-1 rounded-full mr-2 whitespace-nowrap">
                            Loading...
                        </span>
                    )
                }
			</div>
		</div>
	);
};

export default FileTags;
