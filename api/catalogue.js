import { google } from "googleapis";

export default async function handler(req, res) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: "1JeUsm9ebgixpjOCL4XIz5VlTC7gkeTlKmScX7-thF6g", // your sheet ID
      range: "catalogue!A2:E",
    });

    const rows = response.data.values || [];

    if (rows.length === 0) {
      return res.status(200).json({ catalogue: [] });
    }

    const catalogue = rows.map(([title, author, code, price, status]) => ({
      title,
      author,
      code,
      price,
      status,
    }));

    res.status(200).json({ catalogue });
  } catch (error) {
    console.error("API ERROR:", error); // 👈 This will show in Vercel logs
    res.status(500).json({ error: error.message });
  }
}
