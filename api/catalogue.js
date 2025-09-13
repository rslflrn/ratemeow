// /api/catalogue.js
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export default async function handler(req, res) {
  try {
    const response = await notion.databases.query({
      database_id: process.env.CATALOGUE_DB,
      filter: {
        property: "status",
        select: {
          equals: "available"
        }
      }
    });

    const books = response.results.map(page => {
      const props = page.properties;
      return {
        id: page.id,
        title: props.Name?.title?.[0]?.plain_text || "",
        author: props.author?.rich_text?.[0]?.plain_text || "",
        code: props.code?.rich_text?.[0]?.plain_text || "",
        price: props.price?.number || 0,
        status: props.status?.select?.name || ""
      };
    });

    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch catalogue" });
  }
}
