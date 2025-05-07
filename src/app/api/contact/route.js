import nodemailer from "nodemailer";

export const POST = async (req) => {
  const body = await req.json();
  const { name, email, phone, subject, message } = body;
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`, // Use authenticated email
      replyTo: email, // Set reply-to to user's email
      to: process.env.EMAIL_USER,
      subject: `Contact Form Submission : ${subject}`,
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Subject: ${subject}
        
        Message:
        ${message}
      `,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    return Response.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        error: "Failed to send email",
        details: error.message,
      },
      { status: 500 }
    );
  }
};
