import { use, useState } from "react";
import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";
import download from "downloadjs";

export default function FileSelector() {
  const [fileSelected, setFileSelected] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    console.log(fileSelected);
    console.log(quantity);
    if (fileSelected && quantity) {
      for (let i = 0; i < quantity; i++) {
        fileSelected.arrayBuffer().then(async (buff: any) => {
          let fileBuffer = new Uint8Array(buff); // x is your uInt8Array
          // perform all required operations with x here.

          const pdfDoc = await PDFDocument.load(fileBuffer);
          const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

          const pages = pdfDoc.getPages();

          // const firstPage = pages[0];

          // // Get the width and height of the first page
          // const { width, height } = firstPage.getSize();

          // // Draw a string of text diagonally across the first page
          // firstPage.drawText("This text was added with JavaScript!", {
          //   x: 5,
          //   y: height / 2 + 300,
          //   size: 50,
          //   font: helveticaFont,
          //   color: rgb(0.95, 0.1, 0.1),
          // });

          pages.forEach((page) => {
            // // Draw a string of text diagonally across the first page
            const { width, height } = page.getSize();

            page.drawText("Este es el texto de trazabilidad." + (i + 1), {
              x: 5,
              y: height / 2 + 100,
              size: 10,
              font: helveticaFont,
              color: rgb(0.95, 0.1, 0.1),
            });
          });

          const pdfBytes = await pdfDoc.save();

          download(pdfBytes, "Archivo" + (i + 1) + ".pdf", "application/pdf");
        });
      }
    }
    setLoading(false);
  };

  const changeAge = ({ target }: any) => {
    setQuantity(target.value);
  };

  return (
    <div className="flex flex-col">
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
        Seleccione el archivo
      </label>
      <input
        className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        id="file_input"
        type="file"
        onChange={(event) => setFileSelected(event.target.files?.[0])}
        accept=".pdf,.docx"
      />
      <label>Cantidad archivos a generar:</label>
      <input
        type="number"
        value={quantity}
        min={0}
        onChange={changeAge}
      ></input>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-10"
        onClick={handleSubmit}
        disabled={!quantity || !fileSelected || loading}
      >
        Generar
      </button>
    </div>
  );
}
