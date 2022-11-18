import { useState } from "react";
import { PDFDocument, degrees,rgb, StandardFonts } from "pdf-lib";
import download from "downloadjs";

export default function FileSelector() {
  const [fileSelected, setFileSelected] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>();
  const [loading, setLoading] = useState(false);
  const [waterMarkText,setWaterMarkText] = useState<string>("");

  const handleSubmit = async () => {
    setLoading(true);
    if (fileSelected && quantity) {
      if (quantity > 0) {
        for (let i = 0; i < quantity; i++) {
          fileSelected.arrayBuffer().then(async (buff: any) => {
            let fileBuffer = new Uint8Array(buff); //  is your uInt8Array
            // perform all required operations with x here.

            const pdfDoc = await PDFDocument.load(fileBuffer);
            const helveticaFont = await pdfDoc.embedFont(
              StandardFonts.Helvetica
            );

            const pages = pdfDoc.getPages();

            pages.forEach((page) => {
              // // Draw a string of text diagonally across the first page
              const { width, height } = page.getSize();
              page.drawText(`${waterMarkText} ${i+1}`, {
                x: 5,
                y: (height / 2) + 300,
                size: 50,
                font: helveticaFont,
                color: rgb(0.9, 0.9, 0.9) ,
                rotate: degrees(-45),
                opacity: 0.4,
              });

            });

            const pdfBytes = await pdfDoc.save();

            download(pdfBytes, "Archivo" + (i + 1) + ".pdf", "application/pdf");
      
          });
        }
      }
    }
    setLoading(false);
  };

  const changeQuantity = ({ target }: any) => {
    setQuantity(target.value);
  };

  return (
    <div className="flex flex-col">
      <label className="text-black">Seleccione un archivo pdf:</label>

      <input
        className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        id="file_input"
        type="file"
        onChange={(event) => setFileSelected(event.target.files?.[0])}
        accept=".pdf"
      />
      <label className="text-black">Cantidad archivos a generar:</label>
      <input
        type="number"
        value={quantity}
        min={0}
        onChange={changeQuantity}
      ></input>
      <label className="text-black">Texto marca de agua:</label>
      <input
        type="text"
        value={waterMarkText}
        onChange={(e)=>setWaterMarkText(e.target.value)}
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
