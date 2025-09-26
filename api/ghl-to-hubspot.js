// api/ghl-to-hubspot.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { first_name, last_name, email, phone } = req.body;

    // HubSpot Form info
    const portalId = process.env.HUBSPOT_PORTAL_ID;
    const formGuid = process.env.HUBSPOT_FORM_GUID;

    const url = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`;

    const hubspotResp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fields: [
          { name: "0-1/firstname", value: first_name },
          { name: "0-1/lastname", value: last_name },
          { name: "0-1/email", value: email },
          { name: "0-1/phone", value: phone }
        ],
        context: {
          pageUri: "https://www.tralenex.com/",
          pageName: "GoHighLevel → HubSpot Form Submission"
        }
      })
    });

    if (!hubspotResp.ok) {
      const errText = await hubspotResp.text();
      console.error("HubSpot Form error:", errText);
      return res.status(500).json({ error: "HubSpot API error", details: errText });
    }

    res.status(200).json({ success: true, message: "Form submission sent to HubSpot" });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
