import { google } from "googleapis";

export default async function handler(req, res) {
  try {
    const rawKey = process.env.GOOGLE_PRIVATE_KEY || "";
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const sheetId = process.env.GOOGLE_SHEET_ID;

    if (!rawKey || !clientEmail || !sheetId) {
      throw new Error("Missing Google Sheets environment variables");
    }

    // Convert \n to real newlines
    const formattedKey = rawKey.replace(/\\n/g, "\n");

    const auth = new google.auth.JWT(
      clientEmail,
      null,
      formattedKey,
      ["https://www.googleapis.com/auth/spreadsheets.readonly"]
    );

    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "Sheet1!A:E",
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return res.status(200).json({ books: [] });
    }

    const headers = rows[0];
    const books = rows.slice(1).map((row) => {
      const book = {};
      headers.forEach((h, i) => (book[h.toLowerCase()] = row[i] || ""));
      return book;
    });

    const availableBooks = books.filter(
      (b) => (b.status || "").toLowerCase() === "available"
    );

    res.status(200).json({ books: availableBooks });
  } catch (err) {
    console.error("API ERROR:", err);
    res.status(500).json({ error: err.message });
  }
}
