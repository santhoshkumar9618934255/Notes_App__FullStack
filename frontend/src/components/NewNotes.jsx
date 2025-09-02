import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./NewNotes.css";

const NewNotes = () => {
  const idRef = useRef();
  const titleRef = useRef();
  const contentRef = useRef();
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const [color, setColor] = useState("black");
  const [tool, setTool] = useState("draw");
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState(null);

  // Save data
const load_data = async (e) => {
    e.preventDefault();
    try {
      const canvas = canvasRef.current;
      const drawingData = canvas.toDataURL("image/png");

      const formData = new FormData();
      formData.append("id", idRef.current.value);
      formData.append("title", titleRef.current.value);
      formData.append("content", contentRef.current.value);

      if (drawingData) {
        const byteString = atob(drawingData.split(",")[1]);
        const mimeString = drawingData.split(",")[0].split(":")[1].split(";")[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        formData.append("drawing", blob, "drawing.png");
      }

      const res = await axios.post("http://localhost:8080/api/save", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Note saved:", res.data);

      // Reset inputs
      idRef.current.value = "";
      titleRef.current.value = "";
      contentRef.current.value = "";
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Navigate after success
      navigate("/dashboard");
    } catch (err) {
      console.error("Error saving note:", err);
    }
  };

  // Drawing tools
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const startDrawing = (e) => {
      if (tool === "draw" || tool === "eraser") {
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
        setIsDrawing(true);
      } else if (["rect", "circle", "square", "diamond"].includes(tool)) {
        setStartPos({ x: e.offsetX, y: e.offsetY });
      }
    };

    const draw = (e) => {
    
      if (tool === "eraser" && isDrawing) {
        ctx.globalCompositeOperation = "destination-out"; // erase pixels
        ctx.lineWidth = 20; // eraser size
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        return;
      }

      if (tool !== "draw" || !isDrawing) return;
      ctx.globalCompositeOperation = "source-over"; // normal draw
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
    };

    const stopDrawing = (e) => {
      if (tool === "draw" || tool === "eraser") {
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

  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

 

  return (
    <div className="new-notes-container">

      <div className="new-toolbar">
        <button className="new-tool-btn color-red" onClick={() => setColor("red")}></button>
        <button className="new-tool-btn color-blue" onClick={() => setColor("blue")}></button>
        <button className="new-tool-btn color-green" onClick={() => setColor("green")}></button>
        <button className="u-tool-btn color-black" onClick={() => setColor("black")}></button>
        <hr />
        <button className="new-tool-btn" onClick={() => setTool("draw")}>✏️</button>
        <button className="new-tool-btn" onClick={() => setTool("text")}>🔤</button>
        <button className="new-tool-btn" onClick={() => setTool("eraser")}>🧽</button>

        <button className="new-tool-btn eraser" onClick={clearCanvas}>🧹</button>

        <hr />
        <button className="new-tool-btn" onClick={() => setTool("rect")}>▭</button>
        <button className="new-tool-btn" onClick={() => setTool("square")}>⬛</button>
        <button className="new-tool-btn" onClick={() => setTool("circle")}>⚪</button>
        <button className="new-tool-btn" onClick={() => setTool("diamond")}>◆</button>
      </div>

      <div className="new-note-editor">
        <h2 className="add_title">Add Notes</h2>
        <input type="text" placeholder="Enter ID" ref={idRef} />

        <input type="text" placeholder="Enter Title" ref={titleRef} />

        <textarea placeholder="Enter Content" ref={contentRef}></textarea>
        <canvas
          ref={canvasRef}
          width={500}
          height={400}
          style={{ border: "1px solid black", marginTop: "20px", background: "#fff" }}
        ></canvas>
        <br />
        <button className="new-save-btn" onClick={load_data}>Add Note</button>
      </div>
    </div>
  );
};

export default NewNotes;
