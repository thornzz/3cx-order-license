import PostData from "../../utility/HttpPostUtility";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      console.log("fake license order çağrıldı", req.body);
      const data = await PostData(
        "https://api.3cx.com/public/v1/order/?readonly=true",
        req.body
      );

      return res.status(200).json(data);
    } else {
      return res.status(400).json();
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
