// /api/catalogue.js
import { google } from "googleapis";

export default async function handler(req, res) {
  try {
    console.log("DEBUG: Starting catalogue fetch...");

    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const sheetId = process.env.SHEET_ID;

    console.log("DEBUG: Client Email =", clientEmail);
    console.log("DEBUG: Sheet ID =", sheetId);
    console.log("DEBUG: Private Key Length =", privateKey?.length);

    if (!clientEmail || !privateKey || !sheetId) {
      return res
        .status(500)
        .json({ error: "Missing Google Sheets environment variables." });
    }

    const auth = new google.auth.JWT(clientEmail, null, privateKey, [
      "https://www.googleapis.com/auth/spreadsheets.readonly",
    ]);

    const sheets = google.sheets({ version: "v4", auth });

    // Adjust range: use your sheet tab name (default: Sheet1)
    const range = "Sheet1!A:E";

    console.log("DEBUG: Fetching range =", range);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    });

    const rows = response.data.values;
    console.log("DEBUG: Rows fetched =", rows ? rows.length : 0);

    if (!rows || rows.length === 0) {
      return res.status(200).json({ books: [], debug: "No rows found." });
    }

    // Log the first row for debugging
    console.log("DEBUG: First row =", rows[0]);

    // Map into objects (assuming header: title | author | code | price | status)
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

    return res.status(200).json({ books: availableBooks, debug: rows[0] });
  } catch (err) {
    console.error("ERROR in /api/catalogue:", err);
    return res.status(500).json({ error: err.message });
  }
}
