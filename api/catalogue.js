// /api/catalogue.js
import { google } from "googleapis";

export default async function handler(req, res) {
  try {
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const sheetId = process.env.SHEET_ID;

    if (!clientEmail || !privateKey || !sheetId) {
      return res.status(500).json({ error: "Missing Google Sheets environment variables." });
    }

    const auth = new google.auth.JWT(clientEmail, null, privateKey, [
      "https://www.googleapis.com/auth/spreadsheets.readonly",
    ]);

    const sheets = google.sheets({ version: "v4", auth });

    // 👇 Use your actual tab name: "catalogue"
    const range = "catalogue!A:E";

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return res.status(200).json({ books: [], debug: "No rows found." });
    }

    // First row is headers: [title, author, code, price, status]
    const books = rows.slice(1).map((row) => ({
      title: row[0] || "",
      author: row[1] || "",
      code: row[2] || "",
      price: row[3] || "",
      status: row[4] || "",
    }));

    // Only return available books
    const availableBooks = books.filter(
      (book) => book.status.toLowerCase() === "available"
    );

    return res.status(200).json({ books: availableBooks });
  } catch (err) {
    console.error("ERROR in /api/catalogue:", err);
    return res.status(500).json({ error: err.message });
  }
}
