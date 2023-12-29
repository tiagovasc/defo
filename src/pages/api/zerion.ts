const zerionUrl = 'https://api.zerion.io/v1/wallets/0xf99d8717c3c2bb5a4959fab7f152eddee56580e2/portfolio?currency=usd'
const zerionAuth = 'Basic emtfZGV2X2E4NmQ4MzVmMWNmNDRlMmVhMTc5MWYyZTNjZjI0NmE4OnprX2Rldl9hODZkODM1ZjFjZjQ0ZTJlYTE3OTFmMmUzY2YyNDZhOA=='

export default async function handler(req, handlerRes) {
  // Handle the GET request
  if (req.method === 'GET') {
    // You can perform any logic here before sending the response
    try {
            await fetch(zerionUrl, {
                headers: {
                  accept: 'application/json',
                  authorization: zerionAuth
                },
                method: 'GET'
            }).then(async (res) => {
                await res.json().then(
                    (datamain) => {
                        let zerionWorth = datamain.data.attributes.total.positions;
                        handlerRes.status(200).json({ value: zerionWorth })
                    })
            });
    } catch(err) {
        handlerRes.status(400).json({ message: 'Something went wrong.' });
    }
    // Send a JSON response
  } else {
    // Handle other HTTP methods
    handlerRes.status(405).json({ error: 'Method Not Allowed' });
  }
}
