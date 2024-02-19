# Stargraze NFT Automatic Minter

This project automates the minting process for NFTs on the Stargraze launchpad. It's designed to help users automatically mint NFTs at a specified time, ensuring that they can participate in launches without manually monitoring and executing transactions.

## Features

- Automated minting at a specific time
- Customizable minting parameters (number of mints, contract address, mint price, and minting time)
- Easy to use and configure

## Installation

Before you begin, make sure you have [Node.js](https://nodejs.org/) installed on your machine. Then, follow these steps to install and set up the automatic minter:

1. Run `npm i` to install the required dependencies.
2. Configure the `constants.js` file with your details (explained in the next section).
3. Start the automatic minter by running `npm run start`.

## Configuration

Before running the minter, you need to configure your minting details in the `constants.js` file. Here's what you need to fill in:

1. MNEMONIC - your mnemonic phrase. Not a private key! 
2. NUM_MINTS - how many NFTS should be minted. Defaults to 1, but you can increase it. (Note: the script can not mint more than allowed by a launchpad)
3. CONTRACT_ADRESS - address of the collection's contract.
4. MINT_PRICE - mint price in stars (for a single NFT)
5. START_HOUR - start hour of the mint
6. START_MINUTE - guess

### Note on contract:
To get it: 
1. Go to the launchpad page (link should look like stargaze.zone/l/*)
2. Press "See on Marketplace" button (bottom, right under the MINT button)
3. It takes you to stargaze.zone/m/*. Locate the collection name (top left corner). Press the little copy button right near the name.
4. Paste the contract into constants.js (contract should look like "stars1.....")
