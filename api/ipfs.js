export default async function handler(req, res) {
  const { cid } = req.query;
  if (!cid) return res.status(400).send('Missing cid');

  const gateways = [
    `https://api.universalprofile.cloud/ipfs/${cid}`,
    `https://cloudflare-ipfs.com/ipfs/${cid}`,
    `https://ipfs.io/ipfs/${cid}`,
    `https://gateway.pinata.cloud/ipfs/${cid}`,
  ];

  for (const url of gateways) {
    try {
      const response = await fetch(url);
      if (!response.ok) continue;
      const buffer = await response.arrayBuffer();
      const contentType = response.headers.get('content-type') || 'image/jpeg';
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 's-maxage=86400');
      return res.send(Buffer.from(buffer));
    } catch (e) {
      continue;
    }
  }

  res.status(404).send('Image not found');
}
