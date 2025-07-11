import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./app.css";

function App() {
  const [form, setForm] = useState({
    nombre: "",
    cedula: "",
    cargo: "",
    fecha: "",
    observaciones: "",
  });

  const [elementos, setElementos] = useState([
    { referencia: "", marca: "", serial: "" },
  ]);

  const [imagenes, setImagenes] = useState([]);

  const handleFormChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleElementoChange = (index, field, value) => {
    const updated = [...elementos];
    updated[index][field] = value;
    setElementos(updated);
  };

  const agregarElemento = () =>
    setElementos([...elementos, { referencia: "", marca: "", serial: "" }]);

  const eliminarImagen = (index) => {
    const nuevas = [...imagenes];
    nuevas.splice(index, 1);
    setImagenes(nuevas);
  };

  const generarPDF = () => {
    const doc = new jsPDF();

    const img = new Image();
    img.src = "/image.png";

    img.onload = () => {
      doc.addImage(img, "JPEG", 0, 0, 210, 297);

      let y = 20;
      const marginX = 20;
      const lineHeight = 8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(14);
      y += 15;
      doc.text("ACTA DE ENTREGA DE ELEMENTOS", 105, y, { align: "center" });

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      y += 20;
      doc.text(`Nombre del empleado: ${form.nombre}`, marginX, y);
      y += lineHeight;
      doc.text(`Número de documento de identidad: ${form.cedula}`, marginX, y);
      y += lineHeight;
      doc.text(`Cargo: ${form.cargo}`, marginX, y);

      y += lineHeight * 2;
      doc.text(
        `Por medio de la presente, se hace constar que el día ${form.fecha}, se ha entregado al empleado mencionado los siguientes elementos:`,
        marginX,
        y,
        { maxWidth: 170 }
      );

      y += lineHeight * 2;
      doc.autoTable({
        startY: y,
        head: [["REFERENCIA", "MARCA", "SERIAL"]],
        body: elementos.map((e) => [e.referencia, e.marca, e.serial]),
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185] },
        margin: { left: marginX, right: marginX },
      });

      y = doc.lastAutoTable.finalY + 10;

      doc.setFont("helvetica", "bold");
      doc.text("Condiciones de uso:", marginX, y);
      doc.setFont("helvetica", "normal");

      const condiciones = [
        "- Responsabilidad: El empleado es responsable del cuidado y conservación del elemento.",
        "- Pérdida o daño: El empleado deberá asumir el costo total de reposición.",
        "- Obligación de notificación: Deberá informar a su responsable cualquier novedad.",
        "- Devolución: Se compromete a devolver el elemento al finalizar su relación laboral.",
      ];

      condiciones.forEach((cond) => {
        y += lineHeight;
        doc.text(cond, marginX, y);
      });

      y += lineHeight * 2;
      doc.setFont("helvetica", "bold");
      doc.text("Observaciones:", marginX, y);
      y += lineHeight;
      doc.setFont("helvetica", "normal");
      doc.text(form.observaciones || "Ninguna.", marginX, y, { maxWidth: 170 });

      y += lineHeight * 3;
      const leftX = 20;
      const rightX = 115;
      doc.setFont("helvetica", "bold");
      doc.text("Firma del colaborador:", leftX, y);
      doc.text("Firma del responsable:", rightX, y);

      y += lineHeight;
      doc.setFont("helvetica", "normal");
      doc.text("______________________________", leftX, y);
      doc.text("______________________________", rightX, y);

      y += lineHeight;
      doc.text(form.nombre || "Nombre del colaborador", leftX, y);
      doc.text("Geovanni Casadiegos Rodríguez", rightX, y);

      y += lineHeight;
      doc.text(`C.C: ${form.cedula || "___________"}`, leftX, y);
      doc.text("C.C: 1090409087", rightX, y);

      y += lineHeight;
      doc.text(form.cargo || "Cargo del colaborador", leftX, y);
      doc.text("Coordinador de Sistemas y TIC", rightX, y);

      if (imagenes.length > 0) {
        const imgSize = 80;
        const padding = 10;
        const imagesPerPage = 4;

        const loadImages = imagenes.map((file) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const img = new Image();
              img.onload = () => resolve(img);
              img.src = e.target.result;
            };
            reader.readAsDataURL(file);
          });
        });

        Promise.all(loadImages).then((loadedImages) => {
          for (let i = 0; i < loadedImages.length; i += imagesPerPage) {
            doc.addPage();

            const pageImages = loadedImages.slice(i, i + imagesPerPage);
            let x = padding;
            let y = padding;

            pageImages.forEach((img, index) => {
              doc.addImage(img, "JPEG", x, y, imgSize, imgSize);
              if (index % 2 === 0) {
                x += imgSize + padding;
              } else {
                x = padding;
                y += imgSize + padding;
              }
            });
          }

          doc.save(`${form.cedula || "entrega"}-con-imagenes.pdf`);
        });
      } else {
        doc.save(`${form.cedula || "entrega"}.pdf`);
      }
    };
  };

  return (
    <div className="container">
      <h2>Generar Acta de Entrega</h2>
      <input name="nombre" placeholder="Nombre" onChange={handleFormChange} />
      <input name="cedula" placeholder="Cédula" onChange={handleFormChange} />
      <input name="cargo" placeholder="Cargo" onChange={handleFormChange} />
      <input name="fecha" type="date" onChange={handleFormChange} />
      <textarea name="observaciones" placeholder="Observaciones" onChange={handleFormChange} />

      <h4>Elementos</h4>
      {elementos.map((el, idx) => (
        <div key={idx} className="elemento">
          <input
            placeholder="Referencia"
            value={el.referencia}
            onChange={(e) => handleElementoChange(idx, "referencia", e.target.value)}
          />
          <input
            placeholder="Marca"
            value={el.marca}
            onChange={(e) => handleElementoChange(idx, "marca", e.target.value)}
          />
          <input
            placeholder="Serial"
            value={el.serial}
            onChange={(e) => handleElementoChange(idx, "serial", e.target.value)}
          />
        </div>
      ))}
      <button onClick={agregarElemento}>Agregar Elemento</button>

      <h4>Subir Imágenes</h4>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => setImagenes([...imagenes, ...Array.from(e.target.files)])}
      />

      <div className="preview" style={{ display: "flex", flexWrap: "wrap" }}>
        {imagenes.map((img, idx) => (
          <div key={idx} style={{ position: "relative", margin: "10px" }}>
            <img
              src={URL.createObjectURL(img)}
              alt={`img-${idx}`}
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <a
              onClick={() => eliminarImagen(idx)}
              style={{
                position: "absolute",
                top: "-5px",
                right: "5px",
                color: "black",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              title="Eliminar imagen"
              onMouseEnter={(e) => (e.target.style.color = "red")}
              onMouseLeave={(e) => (e.target.style.color = "black")}
            >
              ×
            </a>
          </div>
        ))}
      </div>

      <button onClick={generarPDF}>Generar PDF</button>
    </div>
  );
}

export default App;