import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./UpdateNotes.css";

const UpdateNotes = () => {
  const { id } = useParams();
  const titleRef = useRef();
  const contentRef = useRef();
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const [color, setColor] = useState("black");
  const [tool, setTool] = useState("draw");
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState(null);

  // Fetch note data on component mount
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/getNotes/${id}`);
        const note = res.data;

        if (titleRef.current) titleRef.current.value = note.title || "";
        if (contentRef.current) contentRef.current.value = note.content || note.context || "";

        if (note.drawing && canvasRef.current) {
          const ctx = canvasRef.current.getContext("2d");
          const img = new Image();

          // ✅ Fix for tainted canvas
          img.crossOrigin = "anonymous";
          img.src = `http://localhost:8080/uploads/${note.drawing}`;
          img.onload = () =>
            ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
          img.onerror = () => console.error("Failed to load image for canvas.");
        }
      } catch (err) {
        console.error("Error fetching note:", err);
      }
    };
    fetchNote();
  }, [id]);

  // Updated note function (safe canvas to Blob)
  const updateNote = async (e) => {
    e.preventDefault();
    try {
      const canvas = canvasRef.current;
      const drawingData = canvas ? canvas.toDataURL("image/png") : null;

      const formData = new FormData();
      formData.append("id", id);
      formData.append("title", titleRef.current.value);
      formData.append("content", contentRef.current.value);

      // ✅ Convert canvas to Blob safely
      if (drawingData && drawingData !== "data:,") {
        try {
          const res = await fetch(drawingData);
          const blob = await res.blob();
          formData.append("drawing", blob, "drawing.png");
        } catch (err) {
          console.error("Error converting canvas to Blob:", err);
        }
      }

      await axios.put(`http://localhost:8080/api/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Note updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Error updating note:", err);
      alert("Failed to update note!");
    }
  };

  // Drawing tools
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const startDrawing = (e) => {
      if (tool === "draw") {
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
        setIsDrawing(true);
      } else if (["rect", "circle", "square", "diamond"].includes(tool)) {
        setStartPos({ x: e.offsetX, y: e.offsetY });
      }
    };

    const draw = (e) => {
      if (tool !== "draw" || !isDrawing) return;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
    };

    const stopDrawing = (e) => {
      if (tool === "draw") {
        setIsDrawing(false);
        ctx.closePath();
      } else if (startPos && ["rect", "circle", "square", "diamond"].includes(tool)) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;

        const { x, y } = startPos;
        const w = e.offsetX - x;
        const h = e.offsetY - y;

        if (tool === "rect") ctx.strokeRect(x, y, w, h);
        else if (tool === "square") {
          const side = Math.min(Math.abs(w), Math.abs(h));
          ctx.strokeRect(x, y, side * Math.sign(w), side * Math.sign(h));
        } else if (tool === "circle") {
          const radius = Math.sqrt(w * w + h * h);
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, 2 * Math.PI);
          ctx.stroke();
        } else if (tool === "diamond") {
          ctx.beginPath();
          ctx.moveTo(x, y - h / 2);
          ctx.lineTo(x + w / 2, y);
          ctx.lineTo(x, y + h / 2);
          ctx.lineTo(x - w / 2, y);
          ctx.closePath();
          ctx.stroke();
        }

        setStartPos(null);
      }
    };

    const addText = (e) => {
      if (tool !== "text") return;
      const text = prompt("Enter text:");
      if (text) {
        ctx.fillStyle = color;
        ctx.font = "20px Arial";
        ctx.fillText(text, e.offsetX, e.offsetY);
      }
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);
    canvas.addEventListener("click", addText);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseleave", stopDrawing);
      canvas.removeEventListener("click", addText);
    };
  }, [color, tool, isDrawing, startPos]);

  return (
    <div className="u-notes-container">
      <div className="u-toolbar">
        <button className="u-tool-btn color-red" onClick={() => setColor("red")}></button>
        <button className="u-tool-btn color-blue" onClick={() => setColor("blue")}></button>
        <button className="u-tool-btn color-green" onClick={() => setColor("green")}></button>
         <button className="u-tool-btn color-black" onClick={() => setColor("black")}></button>
        <hr />
        <button className="u-tool-btn" onClick={() => setTool("draw")}>✏️</button>
        <button className="u-tool-btn" onClick={() => setTool("text")}>🔤</button>
        <hr />
        <button className="u-tool-btn" onClick={() => setTool("rect")}>▭</button>
        <button className="u-tool-btn" onClick={() => setTool("square")}>⬛</button>
        <button className="u-tool-btn" onClick={() => setTool("circle")}>⚪</button>
        <button className="u-tool-btn" onClick={() => setTool("diamond")}>◆</button>
      </div>

      <div className="u-note-editor">
        <h2 className="u-update_title">Update Note</h2>
        <input type="text" placeholder="Enter Title"  className="u-Title" ref={titleRef} />
        <textarea placeholder="Enter Content"  className="u-content" ref={contentRef}></textarea>
        <canvas
          ref={canvasRef}
          width={500}
          height={400}
          style={{ border: "1px solid black", marginTop: "20px", background: "#fff" }}
        ></canvas>
        <br />
        <button className="u-save-btn" onClick={updateNote}>Update Note</button>
      </div>
    </div>
  );
};

export default UpdateNotes;
