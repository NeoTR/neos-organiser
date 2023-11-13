import React from "react";
import { useState, useEffect } from "react";
import { AiOutlineDoubleRight, AiFillDelete, AiOutlineFullscreen, AiOutlineFullscreenExit, AiOutlineFieldTime } from "react-icons/ai";
import { MdTypeSpecimen } from "react-icons/md";
import ReactQuill from "react-quill";
import axios from "axios";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

import "../../node_modules/quill/dist/quill.snow.css";
import "../../node_modules/quill/dist/quill.core.css";
import "../../node_modules/quill/dist/quill.bubble.css";

export default function Notes() {
  const [selectedNote, setSelectedNote] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const modules = {
    toolbar: [[{ header: [1, 2, false] }], ["bold", "italic", "underline", "strike", "blockquote"], [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }], ["link", "image"], ["clean"]],
  };

  const formats = ["header", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image"];

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/notes")
      .then((response) => {
        setNotes(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
      });
  }, []);

  const handleNoteChange = (content, delta, source, editor) => {
    setSelectedNote((prevNote) => ({ ...prevNote, content: editor.getHTML() }));
  };

  const handleDelete = () => {
    setIsLoading(true);
    axios
      .delete(`http://localhost:3000/api/notes/${selectedNote.id}`)
      .then((response) => {
        setSelectedNote(null);
        setIsPanelOpen(false);
        axios
          .get("http://localhost:3000/api/notes")
          .then((response) => {
            setNotes(response.data);
            setIsLoading(false);
          })
          .catch((error) => console.error("Error:", error));
        setIsLoading(false);
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleBlur = () => {
    axios
      .put(`http://localhost:3000/api/notes/${selectedNote.id}`, selectedNote)
      .then((response) => {
        setSelectedNote(response.data);
        setNotes((prevNotes) => prevNotes.map((note) => (note.id === response.data.id ? response.data : note)));
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleCreateNote = () => {
    const date = dayjs().format("MM/DD/YYYY");
    axios
      .post("http://localhost:3000/api/notes/add", { name: "New Note", content: "", type: "Note", id: uuidv4(), date: date })
      .then((response) => {
        setNotes((prevNotes) => [...prevNotes, { name: "New Note", content: "", type: "Note", id: uuidv4(), date: date }]);
        setSelectedNote(response.data);
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleNameChange = (newName) => {
    axios
      .put(`http://localhost:3000/api/notes/${selectedNote.id}`, { ...selectedNote, name: newName })
      .then((response) => {
        setSelectedNote(response.data);
        setNotes((prevNotes) => prevNotes.map((note) => (note.id === response.data.id ? response.data : note)));
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleTypeChange = (newType) => {
    axios
      .put(`http://localhost:3000/api/notes/${selectedNote.id}`, { ...selectedNote, type: newType })
      .then((response) => {
        setSelectedNote(response.data);
        setNotes((prevNotes) => prevNotes.map((note) => (note.id === response.data.id ? response.data : note)));
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleNoteClick = (noteId) => {
    setSelectedNote(notes.find((note) => note.id === noteId));
    setIsPanelOpen(true);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setIsFullScreen(false);
  };

  return (
    <div>
      {isLoading ? (
        <div className="w-full h-screen flex justify-center items-center">
          <div class="inline-block h-24 w-24 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
        </div>
      ) : (
        <div>
          <div className="w-full p-12">
            <div className="flex flex-col w-1/2">
              <div className="flex items-center">
                <img src="https://notion-emojis.s3-us-west-2.amazonaws.com/prod/svg-twitter/270f-fe0f.svg" className="w-10 h-10 mr-2" alt="" />
                <h1 className="font-bold text-[2rem]">Notes</h1>
              </div>
              <p className="py-4">Use this page to capture notes from all of your interests. Check off your notes once you've reviewed them once. Notes are automatically dated when you create them. Click into an item to add unlimited notes, bookmarks, images, videos, even a table of contents. Notes are tagged by category, making it easy to organize your thoughts. Some users prefer to name their tags after specific subjects or themes.</p>
            </div>
            <div>
              <div>
                <button onClick={handleCreateNote} className="my-2">
                  Create Note
                </button>
                <table className="w-1/2">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notes.map((note) => (
                      <tr key={note.id} onClick={() => handleNoteClick(note.id)} style={{ cursor: "pointer", backgroundColor: selectedNote === note.id ? "#ddd" : "#fff" }}>
                        <td>{note.id}</td>
                        <td>{note.name}</td>
                        <td>{note.type}</td>
                        <td>{note.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* pop up panel */}
          <div className={`panel ${isPanelOpen ? "w-1/3" : "w-0"} fixed right-0 h-full bg-white overflow-auto ${isFullScreen ? "w-full top-0 flex justify-center" : "top-16"}`}>
            <div className="menu-buttons p-5 text-[1.5rem] space-x-3 text-gray-400">
              <button onClick={closePanel}>
                <AiOutlineDoubleRight />
              </button>
              <button onClick={toggleFullScreen}>{isFullScreen ? <AiOutlineFullscreen /> : <AiOutlineFullscreenExit />}</button>
              <button onClick={handleDelete}>
                <AiFillDelete />
              </button>
            </div>
            <div className={`container ${isFullScreen ? "py-10" : ""}`}>
              <div className="note-info p-8">
                {selectedNote && (
                  <>
                    <h1 contentEditable suppressContentEditableWarning onBlur={(e) => handleNameChange(e.currentTarget.textContent)} className="text-[3rem] text-gray-700 font-bold">
                      {selectedNote.name}
                    </h1>
                    <div className="flex flex-col-2 space-x-5 items-center mt-4">
                      <div className="space-y-2">
                        <p className="text-gray-400">
                          <AiOutlineFieldTime className="text-[1.5rem]" />
                        </p>
                        <p className="text-gray-400">
                          <MdTypeSpecimen className="text-[1.5rem]" />
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-400">{selectedNote.date}</p>
                        <p contentEditable suppressContentEditableWarning onBlur={(e) => handleTypeChange(e.currentTarget.textContent)} className="text-gray-400">
                          {selectedNote.type}
                        </p>
                      </div>
                    </div>
                    <div className="border-b w-full mt-4 mx-auto"></div>
                  </>
                )}
              </div>
              <div className="text p-8">
                <ReactQuill theme="snow" class="my-editor" value={selectedNote ? selectedNote.content : ""} modules={modules} formats={formats} onChange={handleNoteChange} onBlur={handleBlur} />{" "}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
