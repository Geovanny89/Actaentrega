import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./app.css"; // Estilos externos

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

  const handleFormChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleElementoChange = (index, field, value) => {
    const updated = [...elementos];
    updated[index][field] = value;
    setElementos(updated);
  };

  const agregarElemento = () =>
    setElementos([...elementos, { referencia: "", marca: "", serial: "" }]);

  const generarPDF = () => {
    const doc = new jsPDF();

    const img = new Image();
    img.src = "/image.png"; // Debe estar en public/

    img.onload = () => {
      doc.addImage(img, "JPEG", 0, 0, 210, 297); // Fondo o encabezado

      let y = 20;
      const marginX = 20;
      const lineHeight = 8;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);

      // Fecha alineada a la derecha
      doc.text(`San José de Cúcuta, ${form.fecha}`, 210 - marginX, y, {
        align: "right",
      });

      // Título centrado
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      y += 15;
      doc.text("ACTA DE ENTREGA DE ELEMENTOS", 105, y, { align: "center" });

      // Datos del colaborador
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      y += 20;
      doc.text(`Nombre del empleado: ${form.nombre}`, marginX, y);
      y += lineHeight;
      doc.text(`Número de documento de identidad: ${form.cedula}`, marginX, y);
      y += lineHeight;
      doc.text(`Cargo: ${form.cargo}`, marginX, y);

      // Introducción
      y += lineHeight * 2;
      doc.text(
        `Por medio de la presente, se hace constar que el día ${form.fecha}, se ha entregado al empleado mencionado los siguientes elementos:`,
        marginX,
        y,
        { maxWidth: 170 }
      );

      // Tabla
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

      // Condiciones
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

      // Observaciones
      y += lineHeight * 3;

// Coordenadas para columnas
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


      doc.save(`${form.cedula}.pdf`);
    };
  };

  return (
    <div className="container">
      <h2>Generar Acta de Entrega</h2>
      <input name="nombre" placeholder="Nombre" onChange={handleFormChange} />
      <input name="cedula" placeholder="Cédula" onChange={handleFormChange} />
      <input name="cargo" placeholder="Cargo" onChange={handleFormChange} />
      <input
        name="fecha"
        type="date"
        onChange={handleFormChange}
        placeholder="Fecha"
      />
      <textarea
        name="observaciones"
        placeholder="Observaciones"
        onChange={handleFormChange}
      />

      <h4>Elementos</h4>
      {elementos.map((el, idx) => (
        <div key={idx} className="elemento">
          <input
            placeholder="Referencia"
            value={el.referencia}
            onChange={(e) =>
              handleElementoChange(idx, "referencia", e.target.value)
            }
          />
          <input
            placeholder="Marca"
            value={el.marca}
            onChange={(e) => handleElementoChange(idx, "marca", e.target.value)}
          />
          <input
            placeholder="Serial"
            value={el.serial}
            onChange={(e) =>
              handleElementoChange(idx, "serial", e.target.value)
            }
          />
        </div>
      ))}

      <button onClick={agregarElemento}>Agregar Elemento</button>
      <button onClick={generarPDF}>Generar PDF</button>
    </div>
  );
}

export default App;
