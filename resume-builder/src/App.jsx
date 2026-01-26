import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import html2pdf from "html2pdf.js";

// Default sections
const defaultSections = [
  { id: "skills", label: "Skills", content: "Type your skills here..." },
  { id: "experience", label: "Experience", content: "Type your experience here..." },
  { id: "education", label: "Education", content: "Type your education here..." },
];

function App() {
  const [sections, setSections] = useState(defaultSections);

  // Drag & drop handler
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(sections);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setSections(items);
  };

  // Export to PDF
  const exportPDF = () => {
    const element = document.getElementById("resume");
    html2pdf()
      .set({
        margin: 10,
        filename: "My_Resume.pdf",
        html2canvas: { scale: 2, logging: true },
        jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
      })
      .from(element)
      .save()
      .then(() => alert("PDF exported! Check your Downloads folder."));
  };

  // Add new section
  const addSection = () => {
    const newSection = {
      id: Date.now().toString(),
      label: "New Section",
      content: "Type content here...",
    };
    setSections([...sections, newSection]);
  };

  // Remove section
  const removeSection = (id) => {
    setSections(sections.filter((s) => s.id !== id));
  };

  return (
    <div style={{ fontFamily: "Poppins, sans-serif", padding: 20, background: "#f0f2f5", minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center", color: "#333" }}>Professional Resume Builder</h1>

      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <button
          onClick={exportPDF}
          style={{
            padding: "10px 25px",
            fontSize: 16,
            cursor: "pointer",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: 5,
            marginRight: 10,
          }}
        >
          Export PDF
        </button>
        <button
          onClick={addSection}
          style={{
            padding: "10px 25px",
            fontSize: 16,
            cursor: "pointer",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: 5,
          }}
        >
          Add Section
        </button>
      </div>

      <div
        id="resume"
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: 30,
          backgroundColor: "#fff",
          borderRadius: 12,
          boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        }}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="resume-sections">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {sections.map((section, index) => (
                  <Draggable key={section.id} draggableId={section.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          padding: 20,
                          marginBottom: 20,
                          background: "#f9f9f9",
                          borderLeft: "5px solid #007bff",
                          borderRadius: 8,
                          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                          ...provided.draggableProps.style,
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <h2 style={{ marginBottom: 10, color: "#007bff" }}>{section.label}</h2>
                          <button
                            onClick={() => removeSection(section.id)}
                            style={{
                              background: "red",
                              color: "white",
                              border: "none",
                              borderRadius: 5,
                              padding: "5px 10px",
                              cursor: "pointer",
                            }}
                          >
                            Delete
                          </button>
                        </div>
                        <textarea
                          value={section.content}
                          onChange={(e) => {
                            const newSections = [...sections];
                            newSections[index].content = e.target.value;
                            setSections(newSections);
                          }}
                          style={{
                            width: "100%",
                            minHeight: 80,
                            padding: 12,
                            fontSize: 15,
                            borderRadius: 6,
                            border: "1px solid #ccc",
                            resize: "vertical",
                          }}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
