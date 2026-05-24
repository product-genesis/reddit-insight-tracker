const API_KEY = "HIDDEN";

function analyzeRedditPosts() {

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const rows = sheet.getDataRange().getValues();

  for (let i = 1; i < 2; i++) {

    const title = rows[i][0]; // Column A = TITLE
    const content = rows[i][4]; // Column E = CONTENT
    const painPointCell = rows[i][5]; // Column F = Pain Point

    // Skip already analyzed rows
    if (painPointCell) continue;

    const prompt = `
    Analyze this Reddit discussion.

    Title:
    ${title}

    Content:
    ${content}

    Return:
    1. Pain Point
    2. Emotional Tone
    3. Content Idea

    Keep answers SHORT.
    `;

    const payload = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    };

   const response = UrlFetchApp.fetch(
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=" + API_KEY,
  {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  }
);

    const result = JSON.parse(response.getContentText());

    const text = result.candidates[0].content.parts[0].text;

    // Put full response temporarily into Pain Point column
    sheet.getRange(i + 1, 6).setValue(text);

  }
}
