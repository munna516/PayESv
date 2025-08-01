import { NextResponse } from "next/server";
import jsPDF from "jspdf";

export async function POST(req) {
  try {
    const { transaction, userEmail } = await req.json();

    if (!transaction || !userEmail) {
      return NextResponse.json(
        { error: "Missing required data" },
        { status: 400 }
      );
    }

    // Create PDF document
    const doc = new jsPDF();
    
    // Set font
    doc.setFont("helvetica");
    
    // Add company header
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("PayESv", 20, 30);
    
    // Add invoice title
    doc.setFontSize(18);
    doc.text("INVOICE", 20, 50);
    
    // Add invoice details
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    // Invoice number and date
    doc.text(`Invoice #: ${transaction.id}`, 20, 70);
    doc.text(`Date: ${transaction.created_at ? transaction.created_at.split("T")[0] : new Date().toISOString().split("T")[0]}`, 20, 80);
    
    // Customer information
    doc.setFont("helvetica", "bold");
    doc.text("Customer Information:", 20, 100);
    doc.setFont("helvetica", "normal");
    doc.text(`Email: ${transaction.merchant_email || userEmail}`, 20, 110);
    if (transaction.customer_name) {
      doc.text(`Name: ${transaction.customer_name}`, 20, 120);
    }
    if (transaction.customer_phone) {
      doc.text(`Phone: ${transaction.customer_phone}`, 20, 130);
    }
    
    // Payment details
    doc.setFont("helvetica", "bold");
    doc.text("Payment Details:", 20, 150);
    doc.setFont("helvetica", "normal");
    doc.text(`Amount: ${transaction.amount} ${transaction.currency === "BDT" ? '৳' : '$'}`, 20, 160);
    doc.text(`Currency: ${transaction.currency}`, 20, 170);
    doc.text(`Status: ${transaction.status}`, 20, 180);
    doc.text(`Payment Method: ${transaction.payment_method || 'Online Payment'}`, 20, 190);
    
    // Transaction details
    if (transaction.transaction_id) {
      doc.text(`Transaction ID: ${transaction.transaction_id}`, 20, 200);
    }
    if (transaction.order_id) {
      doc.text(`Order ID: ${transaction.order_id}`, 20, 210);
    }
    
    // Add footer
    doc.setFontSize(10);
    doc.text("Thank you for your business!", 20, 250);
    doc.text("PayESv - Secure Payment Gateway", 20, 260);
    
    // Generate PDF buffer
    const pdfBuffer = doc.output('arraybuffer');
    
    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${transaction.id}.pdf"`,
      },
    });
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: "Failed to generate invoice" },
      { status: 500 }
    );
  }
} 