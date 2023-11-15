import React, { useState, useEffect } from "react";
import { getStoredUser } from "src/helpers/storage";

interface FileTagsProps {
	fileType: string;
	filesLoading: boolean;
}

const FileTags: React.FC<FileTagsProps> = ({ fileType, filesLoading }) => {
	console.log("fileType", fileType);
	const [files, setFiles] = useState<string[]>([]);
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

	useEffect(() => {
		if (!userId) return;
		console.log("userId", userId);
        setLoading(true);
		fetch(
			`${"http://localhost:3000"}/dev/api/users/${userId}/files?file_type=${fileType}`
		)
			.then((response) => response.json())
			.then((data) => {
				const files = data.map(
					(file: any) => file?.file_name || "File"
				);
				setFiles(files);
                setLoading(false);
			})
			.catch((error) => {
				console.error(error);
                setLoading(false);
			});
            
	}, [userId, filesLoading]);

	return (
		<div className="overflow-x-auto bg-white  max-w-2xl no-scrollbar">
			<div className="flex p-1 ">
				{filesLoading && (
					<span className="bg-green-500 text-white px-2 py-1 rounded-full ml-2 whitespace-nowrap">
						Loading...
					</span>
				)}
				{files.map((fileName) => (
					<span className="bg-blue-500 text-white px-2 py-1 rounded-full mr-2 whitespace-nowrap">
						{fileName}
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
