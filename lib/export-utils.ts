import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

export async function exportToHTML(content: string, fileName: string = 'document') {
  const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fileName}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.7;
            color: #1f2937;
            max-width: 1200px;
            margin: 0 auto;
            padding: 3rem 2rem;
            background: #ffffff;
        }

        h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin: 2rem 0 1rem 0;
            color: #1e40af;
        }

        h2 {
            font-size: 2rem;
            font-weight: 600;
            margin: 1.5rem 0 0.75rem 0;
            color: #3b82f6;
        }

        h3 {
            font-size: 1.5rem;
            font-weight: 600;
            margin: 1.25rem 0 0.5rem 0;
            color: #10b981;
        }

        p {
            margin: 0.75rem 0;
        }

        code {
            background: #f3f4f6;
            padding: 0.2rem 0.4rem;
            border-radius: 0.25rem;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 0.9em;
            color: #3b82f6;
        }

        pre {
            background: #1e293b;
            color: #e2e8f0;
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            margin: 1rem 0;
        }

        pre code {
            background: transparent;
            color: inherit;
            padding: 0;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        th, td {
            border: 1px solid #e5e7eb;
            padding: 0.75rem;
            text-align: left;
        }

        th {
            background-color: #f9fafb;
            font-weight: 600;
            color: #374151;
        }

        tr:nth-child(even) {
            background-color: #f9fafb;
        }

        blockquote {
            border-left: 4px solid #3b82f6;
            padding-left: 1rem;
            margin: 1rem 0;
            color: #6b7280;
            font-style: italic;
        }

        a {
            color: #3b82f6;
            text-decoration: underline;
        }

        a:hover {
            color: #2563eb;
        }

        ul, ol {
            margin: 0.75rem 0;
            padding-left: 2rem;
        }

        li {
            margin: 0.5rem 0;
        }

        img {
            max-width: 100%;
            height: auto;
            border-radius: 0.5rem;
            margin: 1rem 0;
        }

        .footer {
            margin-top: 4rem;
            padding-top: 2rem;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 0.9rem;
        }

        .footer a {
            color: #3b82f6;
            text-decoration: none;
            font-weight: 500;
        }

        .footer a:hover {
            text-decoration: underline;
        }

        @media print {
            body {
                padding: 1rem;
            }

            .footer {
                page-break-before: always;
            }
        }
    </style>
</head>
<body>
    ${content}

    <div class="footer">
        <p>Made with ❤️ by <a href="https://www.linkedin.com/in/sagar-kumar-iit-kgp/" target="_blank">Sagar Kumar</a></p>
        <p style="margin-top: 0.5rem; font-size: 0.85rem;">Generated with MD Converter Pro</p>
    </div>
</body>
</html>
  `;

  const blob = new Blob([htmlTemplate], { type: 'text/html;charset=utf-8' });
  saveAs(blob, `${fileName}.html`);
}

export async function exportToPDF(elementId: string, fileName: string = 'document') {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Add footer before export
  const footer = document.createElement('div');
  footer.style.cssText = 'margin-top: 4rem; padding-top: 2rem; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280;';
  footer.innerHTML = `
    <p>Made with ❤️ by <a href="https://www.linkedin.com/in/sagar-kumar-iit-kgp/" style="color: #3b82f6; text-decoration: none;">Sagar Kumar</a></p>
    <p style="margin-top: 0.5rem; font-size: 0.85rem;">Generated with MD Converter Pro</p>
  `;
  element.appendChild(footer);

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 10;

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save(`${fileName}.pdf`);
  } finally {
    // Remove footer after export
    element.removeChild(footer);
  }
}

export async function exportToDOC(content: string, fileName: string = 'document') {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            h1 { color: #1e40af; font-size: 24pt; }
            h2 { color: #3b82f6; font-size: 18pt; }
            h3 { color: #10b981; font-size: 14pt; }
            table { width: 100%; border-collapse: collapse; margin: 1em 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            code { background-color: #f4f4f4; padding: 2px 4px; font-family: Courier New; }
            pre { background-color: #f4f4f4; padding: 10px; border-radius: 4px; }
        </style>
    </head>
    <body>
        ${content}
        <div style="margin-top: 3em; padding-top: 2em; border-top: 2px solid #ddd; text-align: center; color: #666;">
            <p>Made with ❤️ by <a href="https://www.linkedin.com/in/sagar-kumar-iit-kgp/">Sagar Kumar</a></p>
            <p style="font-size: 0.9em;">Generated with MD Converter Pro</p>
        </div>
    </body>
    </html>
  `;

  // Convert HTML to DOC using blob
  const blob = new Blob(
    [
      '\ufeff',
      '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">',
      '<head><meta charset="utf-8"></head>',
      '<body>',
      htmlContent,
      '</body>',
      '</html>',
    ],
    { type: 'application/msword;charset=utf-8' }
  );

  saveAs(blob, `${fileName}.doc`);
}
