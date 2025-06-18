const PDFDocument = require("pdfkit");
const fs = require("fs");

const generateInvoice = (order, res) => {
  const doc = new PDFDocument();
  const invoicePath = `invoices/invoice_${order._id}.pdf`;

  doc.pipe(fs.createWriteStream(invoicePath));
  doc.pipe(res); // Stream PDF to client response

  // ✅ Header
  doc.fontSize(20).text("Furniture Store Invoice", { align: "center" });
  doc.moveDown();

  // ✅ Order Details
  doc.fontSize(14).text(`Invoice ID: ${order._id}`);
  doc.text(`Customer: ${order.customerEmail}`);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`);
  doc.moveDown();

  // ✅ Table Header
  doc.fontSize(14).text("Products:", { underline: true });
  doc.moveDown();

  order.items.forEach((item, index) => {
    doc.fontSize(12).text(`${index + 1}. ${item.name} - ${item.quantity} x $${item.price}`);
  });

  doc.moveDown();
  doc.fontSize(14).text(`Total Amount: $${order.totalAmount}`, { bold: true });

  doc.end();
};

module.exports = generateInvoice;
