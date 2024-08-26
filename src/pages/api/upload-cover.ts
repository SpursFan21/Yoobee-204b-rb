// import type { NextApiRequest, NextApiResponse } from "next";
// import fs from "fs";
// import path from "path";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   if (req.method !== "POST")
//     res.status(405).json({ error: "Method not allowed" });

//   const { cover }: { cover: string } = req.body;

//   const base64Data = cover.replace(/^data:image\/png;base64,/, "");

//   const filePath = path.join(process.cwd(), "public", "covers", "cover.png");

//   fs.writeFile(filePath, base64Data, "base64", (err) => {
//     if (err) {
//       res.status(500).json({ error: "Failed to save cover" });
//       return;
//     }

//     res.status(200).json({ success: true });
//   });
// }
