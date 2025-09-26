import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/", async (req, res) => {
  try {
    const data = req.body;

    console.log("GoHighLevel webhook payload:", data);

    // Build HubSpot payload
    const hubspotPayload = {
      fields: [
        { name: "0-1/firstname", value: data.first_name || "" },
        { name: "0-1/lastname", value: data.last_name || "" },
        { name: "0-1/email", value: data.email || "" },
        { name: "0-1/phone", value: data.phone || "" }
      ]
    };

    const HUBSPOT_PORTAL_ID = process.env.HUBSPOT_PORTAL_ID; // from HubSpot
    const HUBSPOT_FORM_GUID = process.env.HUBSPOT_FORM_GUID; // from HubSpot form settings

    const hubspotUrl = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_GUID}`;

    const response = await fetch(hubspotUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hubspotPayload)
    });

    const hubspotRes = await response.json();

    console.log("HubSpot response:", hubspotRes);

    res.status(200).json({ success: true, hubspotRes });
  } catch (error) {
    console.error("Error forwarding to HubSpot:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default app;
