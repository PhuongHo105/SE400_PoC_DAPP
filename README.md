## Getting Started

First, run to install package:
```bash
npm install
# or
yarn install
```

Second, run the development server:
# Smart Contract:
```bash
npx hardhat node
```
# Frontend NextJS:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Set up contract address:
run 
```bash 
npx hardhat run scripts/deploy.js --network sepolia
```
to get address and copy paste this to VotingAddress in /src/context/constants.js

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
