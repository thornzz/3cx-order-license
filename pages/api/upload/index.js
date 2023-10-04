

export default async function handler(req, res) {
  try {
    const data = await req.body;

   return res.status(200).json({ success: 'data geldi',data:{messages:'hebele'}} );

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
