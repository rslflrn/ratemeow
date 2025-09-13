const { google } = require("googleapis");

module.exports = async (req, res) => {
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
      range: "Sheet1!A2:E", // assumes first row is headers
    });

    res.status(200).json({ data: response.data.values || [] });
  } catch (error) {
    console.error("API ERROR:", error);
    res.status(500).json({ error: "Failed to fetch catalogue" });
  }
};
