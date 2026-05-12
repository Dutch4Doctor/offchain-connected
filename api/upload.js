export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  const jwt = process.env.PINATA_JWT;
  if (!jwt) return res.status(500).send('Missing Pinata JWT');

  try {
    const { imageData } = req.body;
    if (!imageData) return res.status(400).send('Missing imageData');

    // Convert base64 to buffer
    const base64 = imageData.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64, 'base64');

    // Upload to Pinata
    const formData = new FormData();
    const blob = new Blob([buffer], { type: 'image/png' });
    formData.append('file', blob, 'offchain-connected-badge.png');
    formData.append('pinataMetadata', JSON.stringify({ name: 'Offchain Connected Badge' }));

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: { Authorization: `Bearer ${jwt}` },
      body: formData,
    });

    if (!response.ok) return res.status(500).send('Pinata upload failed');

    const data = await response.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({ cid: data.IpfsHash });
  } catch (e) {
    res.status(500).send('Upload error: ' + e.message);
  }
}
