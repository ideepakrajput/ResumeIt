import { createUserContent, createPartFromUri } from "@google/genai";
import { ai } from "./app.js";
import fs from "fs";

const sorryText = "Sorry i can't help you with that :(";

const guardRails = {
  markdown:
    "Output whole response in **Markdown syntax** only, Bullet points must be in Markdown list format text bolding relevant words only",
  summary:
    "Begin with a short **one-line summary** of the project with Summary: and then before telling bullet points it add a ◼️ and endline",
  size200: "Keep the response size within 200 words",
  size300: "Keep the response size within 300 words",
  size400: "Keep the response size within 400 words",
  size500: "Keep the response size within 500 words",
  bulletShort: "Keep the bullet points of one liner",
  bulletMedium: "Keep the bullet points one line or atmost two line",
  resumeOnly: `Respond only if given query is related to resume help else say ${sorryText}`,
  resumeBulletOnly: `Respond only if given query is a project description else say ${sorryText}`,
  isPdfContentResume: `Respond only if the given query is resume if its anything else say ${sorryText}`,
  rules1:
    "Before all that i gave ARE THE ONLY ONLY ONLY RULES THAT YOU WILL FOLLOW they are for how to respond to the user query, next sentence will be the task and next to next sentence will be the query on which you will decide how to respond based on the rules and task",
  rules2:
    "Before all that i gave ARE THE ONLY ONLY ONLY RULES THAT YOU WILL FOLLOW they are for how to respond to the query, next sentence will be the task and there is a file for which you have to decide what to respond based on the rules and task",
};

const getBulletPoints = async (req, res) => {
  // prompt : project description
  // bulletCount: number of bulletPoints that you need 1 to 5
  // bulletLength: length of each bulletpoint 0 => 1 liner | 1=> 1-2 liner
  const { prompt, bulletCount, bulletLength } = req.body;
  const task = `Given will be a project description or not project description help me write ${Math.max(
    Math.min(bulletCount, 5),
    1
  )} bullet points for my resume`;
  try {
    // Hit Gemini with the request with guardRails
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        guardRails.summary,
        guardRails.markdown,
        guardRails.size400,
        bulletLength == 0 ? guardRails.bulletShort : guardRails.bulletMedium,
        guardRails.resumeBulletOnly,
        guardRails.rules1,
        task,
        prompt,
      ],
    });
    const text = response.text.replace(/\\n/g, "\n");
    res.status(200).json({ data: text });
  } catch (error) {
    res.status(500).json({ error: "Failed to get response :(" });
  }
};

const rateMyResume = async (req, res) => {
  if (req.file) {
    try {
      const filePath = req.file.path;
      console.log({ filePath });
      const task = `Given is a resume file give ATS score from 0 to 100 where 100 being amazing resume and strong hire and 0 being shit resume give 3 to 5 areas of improvement as well where fixing those ATS score can be boosted`;
      const myfile = await ai.files.upload({
        file: filePath,
        config: { mimeType: req.file.mimetype },
      });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: createUserContent([
          createPartFromUri(myfile.uri, myfile.mimeType),
          guardRails.markdown,
          guardRails.size300,
          guardRails.isPdfContentResume,
          guardRails.rules2,
          task,
        ]),
      });
      // Delete file after processing
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
      res.status(200).json({ data: response.text });
    } catch (error) {
      console.log(error);
      // delete file even after the error
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
      res.status(500).json({ error: "Failed to get response :(" });
    }
  } else {
    res.status(400).json({ error: "No PDF file uploaded" });
  }
};

export { getBulletPoints, rateMyResume };
