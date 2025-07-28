// src/utils/airtable.js
export async function submitToAirtable({ name, email, phone, message, }) {
  const token = import.meta.env.VITE_AIRTABLE_TOKEN;
  const base = import.meta.env.VITE_AIRTABLE_BASE;
  const table = import.meta.env.VITE_AIRTABLE_TABLE;

  const url = `https://api.airtable.com/v0/${base}/${table}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fields: { name: name, email: email, phone: phone, message: message },
    }),
  });

  if (!res.ok) throw new Error("Failed to submit to Airtable");
  return await res.json();
}