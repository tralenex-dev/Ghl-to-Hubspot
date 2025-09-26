// Use ES module syntax
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { first_name, last_name, email, phone } = req.body;

    const hubspotResp = await fetch(
      "https://api.hubapi.com/contacts/v1/contact",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          properties: [
            { property: "firstname", value: first_name },
            { property: "lastname", value: last_name },
            { property: "email", value: email },
            { property: "phone", value: phone },
          ],
        }),
      }
    );

    if (!hubspotResp.ok) {
      const errText = await hubspotResp.text();
      console.error("HubSpot error:", errText);
      return res.status(500).json({ error: "HubSpot API error", details: errText });
    }

    res.status(200).json({ success: true, message: "Contact sent to HubSpot" });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
