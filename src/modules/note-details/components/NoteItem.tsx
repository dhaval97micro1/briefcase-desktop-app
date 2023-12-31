import { NoteType } from "src/helpers/types/notes.types";

type Props = {
  note: NoteType;
};

const NoteItem = ({ note }: Props) => {
  return (
    <div className="flex flex-col bg-white rounded-lg shadow-[0px_3px_16px_rgba(65,58,108,0.15)] cursor-pointer hover:shadow-[0px_3px_16px_rgba(65,58,108,0.25)] hover:scale-[1.006] transition duration-100">
      <header className="p-4 bg-[rgba(217,217,217,0.38)] rounded-t-lg text-start font-bold">
        {note.title}
      </header>
      <div className="flex items-start justify-between">
        <pre className="p-4 text-start">{note.summary}</pre>
      </div>
    </div>
  );
};

export default NoteItem;
