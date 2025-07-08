import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./app.css"; // Importa los estilos externos

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
    img.src = "/image.png"; // Asegúrate de que esté en public/

    img.onload = () => {
      doc.addImage(img, "JPEG", 0, 0, 210, 297);

      doc.setFontSize(12);
      doc.text("San José de Cúcuta, " + form.fecha, 20, 20);
      doc.setFontSize(14);
      doc.text("ACTA DE ENTREGA DE ELEMENTOS", 60, 30);

      doc.setFontSize(12);
      doc.text(`Nombre del empleado: ${form.nombre}`, 20, 45);
      doc.text(`Número de documento de identidad: ${form.cedula}`, 20, 52);
      doc.text(`Cargo: ${form.cargo}`, 20, 59);

      doc.text(
        "Por medio de la presente, se hace constar que el día " +
          form.fecha +
          ", se ha entregado al empleado mencionado los siguientes elementos:",
        20,
        70,
        { maxWidth: 170 }
      );

      doc.autoTable({
        startY: 80,
        head: [["REFERENCIA", "MARCA", "SERIAL"]],
        body: elementos.map((e) => [e.referencia, e.marca, e.serial]),
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185] },
      });

      let y = doc.lastAutoTable.finalY + 10;
      doc.text("Condiciones de uso:", 20, y);
      y += 8;
      doc.text(
        "- Responsabilidad: El empleado es responsable del cuidado y conservación del elemento.",
        20,
        y
      );
      y += 7;
      doc.text(
        "- Pérdida o daño: El empleado deberá asumir el costo total de reposición.",
        20,
        y
      );
      y += 7;
      doc.text(
        "- Obligación de notificación: Deberá informar a su responsable cualquier novedad.",
        20,
        y
      );
      y += 7;
      doc.text(
        "- Devolución: Se compromete a devolver el elemento al finalizar su relación laboral.",
        20,
        y
      );
      y += 12;
      doc.text("Observaciones: " + form.observaciones, 20, y);
      y += 20;

      doc.text("Firma del colaborador: ______________________", 20, y);
      doc.text("C.C: " + form.cedula, 140, y);
      y += 15;
      doc.text("Firma del responsable: ______________________", 20, y);
      doc.text("C.C: ____________________", 140, y);

      doc.save("acta_entrega.pdf");
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
            onChange={(e) =>
              handleElementoChange(idx, "marca", e.target.value)
            }
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
