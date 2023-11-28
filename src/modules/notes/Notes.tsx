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
import Recorder from "./components/Recorder";

const database = getDatabase(firebaseApp);

const Notes = () => {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const sortNotes = (notes: any) => {
    return notes.sort((a: any, b: any) => {
      const dateA = a.updatedAt || a.createdAt;
      const dateB = b.updatedAt || b.createdAt;
      return dateB - dateA; // Assuming dates are Unix timestamps
    });
  };

  const listenToFirebaseForNewMessages = useCallback(async (userId: string) => {
    const messagesRef = ref(database, `messages/notes/${userId}`);
    const messagesQuery = query(messagesRef, orderByChild("timestamp")); // Limit to the last 100 messages);
    const unsubscribe = onChildAdded(messagesQuery, (snapshot) => {
      const message = snapshot.val();
      console.log(JSON.stringify(message));
      setNotes((prev) => sortNotes([message, ...prev])); // Use the sorting function
    });

    const notesUpdationQuery = query(messagesRef);
    const unsubscribeOnChange = onChildChanged(
      notesUpdationQuery,
      async (snapshot) => {
        const message = snapshot.val();
        setNotes((prevNotes) =>
          prevNotes.map((note) => (note.id === message.id ? message : note))
        );
      }
    );

    const unsubscribeOnValue = onValue(messagesRef, (snapshot) => {
      if (!snapshot.exists()) {
        setLoading(false); // Hide the loader if no messages exist for the user
      }
    });

    const unsubscribeonChildRemoved = onChildRemoved(
      messagesRef,
      (snapshot) => {
        const message = snapshot.val();
        setNotes((prevNotes) =>
          prevNotes.filter((note) => note.id !== message.id)
        );
      }
    );
  }, []);

  const getUniqueId = useCallback(async () => {
    const userString = await getStoredUser();
    if (userString) {
      const userInfo = JSON.parse(userString);
      setUserId(userInfo.userId);
      listenToFirebaseForNewMessages(userInfo.userId);
    }
  }, [listenToFirebaseForNewMessages]);

  useEffect(() => {
    getUniqueId();
  }, [getUniqueId]);

  const messagesEndRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="ml-5 bg-white rounded-lg h-[calc(100vh-32px)] flex-1 flex flex-col items-start gap-2">
      <div className="flex flex-col w-full h-full">
        <div className="notes-list flex flex-col gap-6 flex-1 overflow-auto p-6 shadow-sm">
          {notes?.map((note: NoteType) => (
            <NoteItem note={note} />
          ))}
        </div>
        <Recorder userId={userId} />
      </div>
    </div>
  );
};

export default Notes;
