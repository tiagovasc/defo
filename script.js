async function fetchVaultWorth() {
    // Token data as provided
    const tokenDetails = [
        {
            name: 'Morpheus stETH',
            ticker: '$STETH',
            amount: 9, // Updated amount
            usdValue: 23688,
            sale: 'Open Market',
            details: ''
        },
        {
            name: 'PENDLE',
            ticker: '$PENDLE',
            amount: 2367.553 + 704.479, // Combined amount
            usdValue: 10121.40 + 2983.59, // Combined USD value
            sale: 'Open Market',
            details: ''
        },
        {
            name: 'SEDA',
            ticker: '$SEDA',
            amount: 292103.9524,
            usdValue: 12067.08,
            sale: 'Open Market',
            details: ''
        },
        {
            name: 'USDC',
            ticker: 'USDC',
            amount: 5055.0278,
            usdValue: 5055.53,
            sale: 'Open Market',
            details: ''
        },
        {
            name: 'Ethereum',
            ticker: '$ETH',
            amount: 0.6354,
            usdValue: 1670.97,
            sale: 'Open Market',
            details: ''
        },
        {
            name: 'Avalanche',
            ticker: '$AVAX',
            amount: 10.6,
            usdValue: 304.01,
            sale: 'Open Market',
            details: ''
        },
        {
            name: 'The Sprawl',
            ticker: '$TBD',
            amount: 666666, // Updated amount
            usdValue: 10000,
            sale: 'Seed round', // Updated sale
            details: 'Price: $0.015, VAL: $15M' // New details
        },
        {
            name: 'SAFE YIELDS',
            ticker: '$SSAY',
            amount: 4915, // Updated amount
            usdValue: 3932,
            sale: 'Pre-sale', // Updated sale
            details: 'Price: $0.85, VAL: $20M' // New details
        }
    ];

    // Calculate the total vault worth
    const vaultWorth = tokenDetails.reduce((acc, token) => acc + token.usdValue, 0);
    return { vaultWorth, tokenDetails };
}

async function updatePage() {
    const { vaultWorth, tokenDetails } = await fetchVaultWorth();

    // Display the rounded vault worth
    document.getElementById('vaultWorth').innerText = `$${Math.round(vaultWorth).toLocaleString('en-US')}`;

    // Sort the tokenDetails array from highest to lowest USD value
    tokenDetails.sort((a, b) => b.usdValue - a.usdValue);

    // Display portfolio details in the table
    const portfolioTableBody = document.getElementById('portfolioTableBody');
    portfolioTableBody.innerHTML = '';
    tokenDetails.forEach(token => {
        const row = document.createElement('tr');

        // Name
        const nameCell = document.createElement('td');
        nameCell.innerText = token.name;
        row.appendChild(nameCell);

        // Ticker
        const tickerCell = document.createElement('td');
        tickerCell.innerText = token.ticker;
        row.appendChild(tickerCell);

        // Token Amount (rounded)
        const amountCell = document.createElement('td');
        if (token.amount !== 'N/A') {
            const amountRounded = Math.round(token.amount);
            amountCell.innerText = amountRounded.toLocaleString('en-US');
        } else {
            amountCell.innerText = 'N/A';
        }
        row.appendChild(amountCell);

        // USD Value (rounded)
        const usdValueCell = document.createElement('td');
        usdValueCell.innerText = `$${Math.round(token.usdValue).toLocaleString('en-US')}`;
        row.appendChild(usdValueCell);

        // Sale
        const saleCell = document.createElement('td');
        saleCell.innerText = token.sale;
        row.appendChild(saleCell);

        // Details (new column)
        const detailsCell = document.createElement('td');
        detailsCell.innerText = token.details;
        row.appendChild(detailsCell);

        portfolioTableBody.appendChild(row);
    });

    // Remove footnotes since they are no longer needed

    const nftConfig = {
        "Emerald": {
            "initialSupply": 36,
            "burned": 4,
            "shares": 27,
            "startingFloorPrice": 585.17
        },
        "Diamond": {
            "initialSupply": 55,
            "burned": 9,
            "shares": 9,
            "startingFloorPrice": 195.06
        },
        "Ruby": {
            "initialSupply": 109,
            "burned": 3,
            "shares": 3,
            "startingFloorPrice": 65.02
        },
        "Sapphire": {
            "initialSupply": 141,
            "burned": 14,
            "shares": 1,
            "startingFloorPrice": 21.67
        }
    };

    let totalInitialShares = 0;
    let totalCirculatingShares = 0;
    let totalBurnedShares = 0;
    let totalNFTsBurned = 0;

    // Calculate total initial shares, total circulating shares, total burned shares, and total NFTs burned
    Object.values(nftConfig).forEach(nft => {
        const initialShares = nft.initialSupply * nft.shares;
        const burnedShares = nft.burned * nft.shares;
        const circulatingShares = initialShares - burnedShares;
        totalInitialShares += initialShares;
        totalCirculatingShares += circulatingShares;
        totalBurnedShares += burnedShares;
        totalNFTsBurned += nft.burned;
    });

    // Calculate value per share before and after deflation
    const valuePerShareBeforeDeflation = vaultWorth / totalInitialShares;
    const valuePerShareAfterDeflation = vaultWorth / totalCirculatingShares;

    // Variables to hold the floor price increase percentage
    let floorPriceIncreasePercentage = 0;

    // Update NFT values on the page with rounded prices
    Object.entries(nftConfig).forEach(([type, nft]) => {
        const sharesPerNFT = nft.shares;

        // Starting Floor Price (Given)
        const startingFloorPrice = nft.startingFloorPrice;

        // Current Floor Price (before deflation)
        const currentFloorPrice = sharesPerNFT * valuePerShareBeforeDeflation;

        // Deflationary Floor Price (after deflation)
        const deflationaryFloorPrice = sharesPerNFT * valuePerShareAfterDeflation;

        // Update the HTML elements with rounded values
        document.getElementById(`${type.toLowerCase()}Starting`).innerText = `$${Math.round(startingFloorPrice)}`;
        document.getElementById(`${type.toLowerCase()}Current`).innerText = `$${Math.round(currentFloorPrice)}`;
        document.getElementById(`${type.toLowerCase()}Deflationary`).innerText = `$${Math.round(deflationaryFloorPrice)}`;

        // Calculate floor price increase percentage for Ruby NFT
        if (type === 'Ruby') {
            floorPriceIncreasePercentage = (((deflationaryFloorPrice - startingFloorPrice) / startingFloorPrice) * 100).toFixed(2);
        }
    });

    // Calculate total supply reduction percentage
    const totalSupplyReductionPercentage = ((totalBurnedShares / totalInitialShares) * 100).toFixed(2);

    // Update footer with total NFTs burned, total supply reduced percentage, and floor price increase
    const footerText = `
        ${totalNFTsBurned} NFTs burned. Total supply reduced by ${totalSupplyReductionPercentage}%.<br>
        Floor price increased by ${floorPriceIncreasePercentage}% since inception.
    `;

    document.getElementById('footer').innerHTML = footerText;
}

updatePage();
