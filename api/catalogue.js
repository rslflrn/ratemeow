import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "method not allowed" });
  }

  try {
    const response = await notion.databases.query({
      database_id: process.env.CATALOGUE_DB,
      filter: {
        property: "status",
        select: { equals: "available" }
      }
    });

    const books = response.results.map(page => {
      const props = page.properties;
      return {
        id: page.id,
        title: props.title?.title?.[0]?.plain_text || "",
        author: props.author?.rich_text?.[0]?.plain_text || "",
        price: props.price?.number || 0,
        status: props.status?.select?.name || ""
      };
    });

    return res.status(200).json(books);
  } catch (err) {
    console.error("catalogue error:", err);
    return res.status(500).json({ error: "failed to fetch catalogue" });
  }
}
