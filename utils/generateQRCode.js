const QRCode = require("qrcode");
const qrcodeTerminal = require("qrcode-terminal");
require("dotenv").config();

/**
 * Generates a QR code that points to the public employee profile URL.
 * @param {object} employee - The employee object.
 * @returns {Promise<string>} - A data URL representing the QR code image.
 */

const generateQRCode = async (employee) => {
  try {
    const BASE_URL =
      process.env.NEXT_PUBLIC_BASE_URL || "https://gbf-portal.vercel.app";

    // Use the frontend public route instead of the backend API route
    const profileUrl = `${BASE_URL}/public/employee/${employee._id}`;

    qrcodeTerminal.generate(profileUrl, { small: true });

    const qrCodeDataUrl = await QRCode.toDataURL(profileUrl);
    return qrCodeDataUrl;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("QR code generation failed");
  }
};

module.exports = { generateQRCode };
