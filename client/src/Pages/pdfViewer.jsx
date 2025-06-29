// src/pages/PDFViewer.js
import { useLocation } from "react-router-dom";

function PDFViewer() {
  const location = useLocation();
  const pdfUrl = location.state?.url;

  if (!pdfUrl) return <p className="text-white">PDF not found.</p>;

  return (
    <div className="fixed inset-0 bg-zinc-900 z-50" onContextMenu={(e) => e.preventDefault()}>
      <iframe
        src={pdfUrl}
        title="PDF Preview"
        width="100%"
        height="100%"
        allow="autoplay"
        style={{ border: "none" }}
      />
    </div>
  );
}

export default PDFViewer;
