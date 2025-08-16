import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/invoice.css";

const Invoice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.orderDetails;

  if (!order)
    return (
      <>
        <Navbar />
        <div className="invoice-container">
          <p>No invoice data available.</p>
        </div>
        <Footer />
      </>
    );

  const handleDownloadPDF = () => {
    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    const rowHeight = 25;

    // Title
    doc.setFontSize(20);
    doc.setTextColor("#007bff");
    doc.text(`Invoice - Order #${order.orderId}`, pageWidth / 2, 50, {
      align: "center",
    });

    doc.setFontSize(12);
    doc.setTextColor("#000");
    doc.text(`Date: ${order.orderDate}`, margin, 80);
    doc.text(
      `Loyalty Applied: ${
        order.items.some((i) => i.redeemApplied) ? "Yes" : "No"
      }`,
      margin,
      95
    );

    // Table header
    doc.setFillColor(0, 123, 255); // blue header
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    const startY = 130;
    doc.rect(margin, startY - 15, pageWidth - margin * 2, rowHeight, "F");
    doc.text("Item", margin + 10, startY);
    doc.text("Qty x Price", pageWidth / 2, startY, { align: "center" });
    doc.text("Total", pageWidth - margin - 10, startY, { align: "right" });

    // Table items
    doc.setTextColor(0);
    let y = startY + 15;
    order.items.forEach((item, index) => {
      // Alternate row color
      if (index % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(margin, y - 15, pageWidth - margin * 2, rowHeight, "F");
      }

      doc.text(item.product.productName, margin + 10, y);
      doc.text(
        `${item.quantity} x ₹${item.product.productPrice.toFixed(2)}`,
        pageWidth / 2,
        y,
        { align: "center" }
      );
      doc.text(`₹${item.finalPrice}`, pageWidth - margin - 10, y, {
        align: "right",
      });

      y += rowHeight;
    });

    // Total amount
    y += 10;
    doc.setFontSize(14);
    doc.setTextColor("#28a745");
    doc.text(`Total Amount: ₹${order.totalAmount}`, pageWidth - margin - 10, y, {
      align: "right",
    });

    // Footer
    doc.setFontSize(10);
    doc.setTextColor("#555");
    doc.text("Thank you for your purchase!", pageWidth / 2, y + 40, {
      align: "center",
    });

    doc.save(`Invoice_${order.orderId}.pdf`);
  };

  return (
    <>
      <Navbar />
      <div className="invoice-container">
        <div className="invoice-header">
          <div className="invoice-header-left">
            <h2>eMart</h2>
            <p>SM VITA, Mumbai</p>
            <p>Email: smvita@support.com</p>
          </div>
          <div className="invoice-header-right">
            <p>
              <strong>Invoice #: </strong>
              {order.orderId}
            </p>
            <p>
              <strong>Date: </strong>
              {order.orderDate}
            </p>
            <p>
              <strong>Loyalty Applied: </strong>
              {order.items.some((i) => i.redeemApplied) ? "Yes" : "No"}
            </p>
          </div>
        </div>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty x Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.cartItemId}>
                <td>{item.product.productName}</td>
                <td>
                  {item.quantity} x ₹{item.product.productPrice.toFixed(2)}
                </td>
                <td>₹{item.finalPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="invoice-total">
          <h2>Total: ₹{order.totalAmount}</h2>
        </div>

        <div className="invoice-buttons">
          <button className="btn-home" onClick={() => navigate("/")}>
            Go Home
          </button>
          <button className="btn-download" onClick={handleDownloadPDF}>
            Download Invoice
          </button>
        </div>

        <div className="invoice-footer">
          Thank you for shopping with us! We hope to see you again soon.
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Invoice;
