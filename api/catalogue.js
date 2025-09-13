import { google } from "googleapis";

export default async function handler(req, res) {
  try {
    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/spreadsheets.readonly"]
    );

    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: "Sheet1!A2:E", // assuming your headers are in row 1
    });

    const rows = response.data.values || [];

    const books = rows.map(row => ({
      title: row[0] || "",
      author: row[1] || "",
      code: row[2] || "",
      price: row[3] || "",
      status: row[4] || "",
    })).filter(book => book.status.toLowerCase() === "available");

    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch catalogue" });
  }
}
