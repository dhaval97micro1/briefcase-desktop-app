import classNames from "classnames";
import { useState } from "react";
import MicRecorder from "mic-recorder-to-mp3";
import axios from "axios";
import { BASE_API_URL } from "src/consts/API_URLS";
import { NoteType } from "src/helpers/types/notes.types";
import { useNavigate } from "react-router";
import Spinner from "src/components/spinner";

const recorder = new MicRecorder({
  bitRate: 128,
});

type Props = {
  editMode?: boolean;
  userId?: string;
  onEditComplete?: (note: NoteType) => void;
};

const Recorder = ({ editMode, userId, onEditComplete }: Props) => {
  const navigate = useNavigate();
  const [isRecording, setRecording] = useState<boolean>(false);
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);

  const onPress = () => {
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
    const apiUrl = `${BASE_API_URL}/users/${userId}/notes`;
    // const filePath = path;

    const formData: any = new FormData();
    formData.append("key", file);
    // if (editMode && !!existingNote) {
    //   formData.append('existingNotes', existingNote.summary);
    //   formData.append('isEditing', true);
    // }

    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setIsSummarizing(false);
      console.log("response: " + JSON.stringify(response.data));
      if (response?.data) {
        if (!editMode) {
          goToReviewScreen(response?.data);
        } else {
          onEditComplete && onEditComplete(response?.data);
        }
      } else {
        // showError('Something went wrong');
      }
    } catch (error: any) {
      console.error("Error:", error);
      // showError(error?.message);
      setIsSummarizing(false);
    }
  };

  const goToReviewScreen = (noteDetails: NoteType) => {
    navigate("/note-details", {
      state: {
        noteDetails,
        editMode: true,
      },
    });
  };

  return (
    <div className="flex flex-col items-center p-4">
      {!isSummarizing ? (
        <>
          <div
            className={classNames("rounded-full cursor-pointer group", {
              "bg-red-600 animate-pulse duration-[10ms]": isRecording,
            })}
            onClick={onPress}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              viewBox="0 0 90 90"
              fill="none"
            >
              <path
                d="M31.6499 30.7875V47.0625C31.6499 54.1189 37.3811 59.85 44.4374 59.85C51.4937 59.85 57.2249 54.1188 57.2249 47.0625V30.7875C57.2249 23.7311 51.4937 18 44.4374 18C37.3811 18 31.6499 23.7312 31.6499 30.7875ZM54.8999 30.7875V47.0625C54.8999 52.8284 50.2033 57.525 44.4374 57.525C38.6715 57.525 33.9749 52.8284 33.9749 47.0625V30.7875C33.9749 25.0216 38.6715 20.325 44.4374 20.325C50.2033 20.325 54.8999 25.0216 54.8999 30.7875Z"
                className={classNames("", {
                  "fill-black group-hover:fill-gray-500": !isRecording,
                  "fill-white ": isRecording,
                })}
              />
              <path
                d="M27 47.0624C27 56.281 34.2075 63.8373 43.275 64.4418V71.4749H36.3V73.7999H52.575V71.4749H45.6V64.4418C54.6675 63.8374 61.875 56.281 61.875 47.0624V45.8999H59.55V47.0624C59.55 55.3975 52.7726 62.1749 44.4375 62.1749C36.1024 62.1749 29.325 55.3975 29.325 47.0624V45.8999H27V47.0624Z"
                className={classNames("", {
                  "fill-black group-hover:fill-gray-500": !isRecording,
                  "fill-white": isRecording,
                })}
              />
              <circle cx="45" cy="45" r="44.5" stroke="black" />
            </svg>
          </div>
          <div className="text-sm mt-2 font-bold">
            {!isRecording
              ? !editMode
                ? "Tap to start new note"
                : "Tap to edit note"
              : "Tap to stop"}
          </div>
        </>
      ) : (
        <div className="h-[80px] flex items-center justify-center">
          <Spinner size={10} /> Summarizing...
        </div>
      )}
    </div>
  );
};

export default Recorder;
