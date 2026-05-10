"use server";

import { google } from "googleapis";
import { Readable } from "stream";

export async function uploadAudioToDrive(formData: FormData) {
  const file = formData.get("audio") as File;
  const buffer = Buffer.from(await file.arrayBuffer());

  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  });

  const drive = google.drive({ version: "v3", auth });

  try {
    const response = await drive.files.create({
      requestBody: {
        name: `roleplay-${Date.now()}.webm`,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!],
      },
      media: {
        mimeType: "audio/webm",
        body: Readable.from(buffer),
      },
      fields: "id",
    });

    return response.data.id; // This returns the ID to your frontend
  } catch (err) {
    console.error("Google Drive Upload Error:", err);
    throw new Error("Failed to upload to Drive");
  }
}
