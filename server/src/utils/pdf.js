import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

export async function generatePrescriptionPDF(presc) {
  const outDir = path.join(process.cwd(), 'server', 'uploads');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const filePath = path.join(outDir, `prescription-${presc._id}.pdf`);
  const doc = new PDFDocument();
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);
  doc.fontSize(18).text('Telemedicine Prescription', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Patient: ${presc.patientId}`);
  doc.text(`Doctor: ${presc.doctorId}`);
  doc.moveDown();
  doc.text('Items:');
  presc.items.forEach((item, idx) => {
    doc.text(`${idx + 1}. ${item.name} - ${item.dosage} - ${item.frequency} - ${item.duration}`);
  });
  if (presc.notes) {
    doc.moveDown();
    doc.text(`Notes: ${presc.notes}`);
  }
  doc.end();
  await new Promise((resolve) => stream.on('finish', resolve));
  return `/uploads/prescription-${presc._id}.pdf`;
}
