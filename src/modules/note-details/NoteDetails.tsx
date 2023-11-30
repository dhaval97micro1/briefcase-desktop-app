import { useCallback, useEffect, useRef, useState } from "react";
import {
  getDatabase,
  ref,
  query,
  onChildAdded,
  limitToLast,
  orderByChild,
  onChildChanged,
  onValue,
  onChildRemoved,
} from "firebase/database";
import { NoteType } from "src/helpers/types/notes.types";
import { firebaseApp } from "../../firebase";
import { getStoredUser } from "src/helpers/storage";
import NoteItem from "./components/NoteItem";
import Recorder from "src/modules/notes/components/Recorder";
import { useLocation, useNavigate } from "react-router";
import notes from "src/helpers/http/notes";
import { showError, showMsg } from "src/helpers/mics";
import Spinner from "src/components/spinner";
import WrappedContent from "src/components/WrappedContent";
import styled from "styled-components";
import useAutosizeTextArea from "src/helpers/hooks/useAutosizeTextArea";

const Wrapper = styled.div`
  textarea {
    border: none;
    resize: none;
  }
  textarea:focus {
    border-color: transparent;
    -webkit-box-shadow: none;
    box-shadow: none;
  }
  /* textarea::-webkit-scrollbar {
    display: none;
  } */
`;

const database = getDatabase(firebaseApp);

const NoteDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [note, setNote] = useState<NoteType | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [editingByText, setEditingByText] = useState<boolean>(false);
  const [noteSummary, setNoteSummary] = useState<string>("");

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(textAreaRef.current, noteSummary);

  useEffect(() => {
    if (location?.state?.noteDetails) {
      setNote(location?.state?.noteDetails);
      if (location?.state?.editMode) {
        setEditingByText(true);
        setNoteSummary(location?.state?.noteDetails?.summary);
      }
    }
  }, [location?.state.editMode, location?.state?.noteDetails]);

  const getUniqueId = useCallback(async () => {
    const userString = await getStoredUser();
    if (userString) {
      const userInfo = JSON.parse(userString);
      setUserId(userInfo.userId);
    }
  }, []);

  useEffect(() => {
    getUniqueId();
  }, [getUniqueId]);

  const messagesEndRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  };

  const goBack = () => {
    navigate(-1);
  };

  const startEditingBytext = () => {
    setNoteSummary(note?.summary || "");
    setEditingByText(true);
  };

  const onChangeSummary = (e: any) => {
    setNoteSummary(e.target.value);
  };

  const onSave = () => {
    const payload: any = {
      userId,
      note,
    };
    if (note?.id) {
      payload.note.notesId = payload.note.id;
      delete payload.note.id;
    }
    if (noteSummary) {
      payload.note.summary = noteSummary;
    }
    setLoading(true);
    !!userId &&
      !!note &&
      notes
        .saveNote(payload)
        .then(async (res) => {
          console.log("res: ", res);
          if (res?.message === "success") {
            goBack();
            setEditingByText(false);
            setNoteSummary("");
            showMsg("Note saved successfully!");
            // triggerHapticFeedback();
          } else {
            console.log("Error");
            showError("Something went wrong");
          }
          setLoading(false);
        })
        .catch((error) => {
          console.log("Error", error);
          setLoading(false);
          showError(error + "");
        });
  };

  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDelete = () => {
    const payload: any = {
      userId,
      notesId: note?.id,
    };
    setIsDeleting(true);
    !!userId &&
      !!note &&
      notes
        .deleteNote(payload)
        .then(async (res) => {
          console.log("res: ", res);
          if (res?.message === "success") {
            goBack();
            showMsg("Note deleted successfully!");
          } else {
            console.log("Error");
            showError("Something went wrong");
          }
          setIsDeleting(false);
        })
        .catch((error) => {
          console.log("Error", error);
          setIsDeleting(false);
          showError(error + "");
        });
  };

  const copy = () => {
    note?.summary && navigator.clipboard.writeText(note?.summary);
    showMsg("Note coppied!!");
  };

  const onEditComplete = (finalNote: NoteType) => {
    setEditingByText(true);
    setNoteSummary(finalNote.summary);
    setNote({
      ...note,
      ...finalNote,
    });
  };

  useEffect(() => {
    if (!!editingByText && !!noteSummary) {
      const input: any = document.getElementById("edit-note-box");
      if (input) {
        const end = input.value.length;

        input.setSelectionRange(end, end);
        input.focus();
      }
    }
  }, [editingByText, noteSummary]);

  return (
    <Wrapper className="ml-5 bg-white rounded-lg h-[calc(100vh-32px)] flex-1 flex flex-col items-start gap-2">
      <div className="flex justify-between items-end w-full pr-4">
        <div
          className="flex items-center mx-5 mt-5 gap-3 cursor-pointer hover:opacity-75"
          onClick={goBack}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="24"
            viewBox="0 0 13 24"
            fill="none"
          >
            <path
              d="M10.3752 21.2821C10.3752 21.2821 2 12 2 12C2 12 10.1399 2.39062 10.1399 2.39062"
              stroke="black"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
          <span className="font-medium">Back</span>
        </div>
        <div className="flex items-center gap-2">
          {!!editingByText && (
            <button
              disabled={loading}
              className="mr-2 rounded-md"
              onClick={onSave}
            >
              {!loading ? "Done" : <Spinner size={10} />}
            </button>
          )}
          <button onClick={handleDelete} disabled={isDeleting}>
            {!isDeleting ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
              >
                <path
                  d="M12.0197 5C11.2803 5 10.7673 5.29168 10.3891 5.59767C10.0107 5.90365 9.74634 6.19453 9.29535 6.38514C9.1356 6.44713 9.01992 6.6196 9.01696 6.8H5V7.70004H19V6.8H14.983C14.9801 6.61961 14.8644 6.44713 14.7046 6.38514C14.2505 6.19371 13.9723 5.90097 13.5977 5.59767C13.223 5.29437 12.7247 5 12.02 5H12.0197ZM12.0197 5.90004C12.5263 5.90004 12.7603 6.05577 13.0803 6.3149C13.2499 6.45226 13.4349 6.62844 13.6636 6.80012H10.3228C10.5514 6.62659 10.7365 6.45213 10.9061 6.3149C11.2233 6.05846 11.466 5.90004 12.0198 5.90004H12.0197ZM5.84816 8.15V20.5321C5.84816 21.2804 6.0316 21.9243 6.45142 22.3672C6.87125 22.8102 7.4767 23 8.1882 23H15.8247C16.5279 23 17.1314 22.8101 17.5482 22.3672C17.9649 21.9243 18.1514 21.2804 18.1514 20.5321V8.15H5.84847H5.84816ZM6.69669 9.05005H17.3029V20.5321C17.3029 21.13 17.169 21.4962 16.9515 21.7274C16.7341 21.9585 16.3855 22.1 15.8246 22.1H8.18817C7.61702 22.1 7.26705 21.9585 7.04797 21.7274C6.82901 21.4963 6.69677 21.13 6.69677 20.5321L6.69669 9.05005ZM8.60583 11.5251V19.6252H9.45436V11.5251H8.60583ZM11.5755 11.5251V19.6252H12.4241V11.5251H11.5755ZM14.5452 11.5251V19.6252H15.3938V11.5251H14.5452Z"
                  fill="#F8837C"
                />
              </svg>
            ) : (
              <Spinner size={10} />
            )}
          </button>
          <button onClick={copy}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="32"
              viewBox="0 0 28 32"
              fill="none"
            >
              <g filter="url(#filter0_d_155_3992)">
                <path
                  d="M8.67988 7.00001H5.87988V23.24H19.3199V20.44H22.1199V4.20001H8.67988V7.00001ZM18.1999 22.12H6.99988V8.12001H18.1999V22.12ZM20.9999 5.32001V19.32H19.3199V7.00001H9.79988V5.32001H20.9999Z"
                  fill="#777474"
                />
              </g>
              <defs>
                <filter
                  id="filter0_d_155_3992"
                  x="-4"
                  y="0"
                  width="36"
                  height="36"
                  filterUnits="userSpaceOnUse"
                  color-interpolation-filters="sRGB"
                >
                  <feFlood flood-opacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dy="4" />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_155_3992"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_155_3992"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>
          </button>
        </div>
      </div>
      <div className="flex flex-col w-full h-full">
        <div className="flex flex-col gap-6 flex-1 p-6">
          {!!note && (
            <div className="text-start">
              <div className="font-bold text-lg">{note.title}</div>
              {!editingByText && (
                <pre
                  className="text-base mt-2 cursor-pointer"
                  title="Tap to edit"
                  onClick={startEditingBytext}
                >
                  <WrappedContent>{note.summary}</WrappedContent>
                </pre>
              )}
              {!!editingByText && (
                <div className="w-full max-w-full flex flex-col">
                  <textarea
                    value={noteSummary}
                    onChange={onChangeSummary}
                    className="w-full p-4 rounded-lg outline-none max-h-[60vh] h-[60vh]"
                    autoFocus
                    id="edit-note-box"
                    ref={textAreaRef}
                  />
                </div>
              )}
            </div>
          )}
        </div>
        <Recorder
          editMode
          onEditComplete={onEditComplete}
          existingNote={note}
        />
      </div>
    </Wrapper>
  );
};

export default NoteDetails;
