# Swoosh
Swoosh is a decentralized payment and bill splitting application built on Ethereum. It allows users to easily send payments, request money from others, and split expenses using crypto.
Me and my team Sree, Soorya, Ian, and Nathan built this for BUILDathon at ETHDenver. This is a fork with major redesign, check out main repo for our original submission.
Won Solana best DeFi/Payments app sponsor bounty!


https://github.com/shivabalanb/swoosh/assets/77653984/31493db6-d9bd-47ff-9bbf-9e7611470bbb


## Key Features
ERC-4337 compatible wallets (for Web2 sign-in)
ThirdWeb Embedded Wallet and Paymaster for gasless transactions
Web-based application for installation-free usage
Send direct crypto payments to anyone with an Ethereum address
Create payment requests from individuals or groups and track repayment status
Split bills and expenses among friends with automatic tracking
Seamless transfers between USD stablecoins and other ERC20 tokens
Fully on-chain transaction history and account balances

## How It Works
Swoosh leverages smart contracts to manage payments and requests between parties. Users can connect their wallet to deposit crypto funds for transfers.
To send money, a user simply enters the recipient's address and payment details which creates an on-chain record.
For bill splitting, the requester can indicate required payers and amounts owed. Payers can then approve or decline requests.
As repayments occur, balances automatically update to track outstanding amounts in real time.

Smart Contract on Base Sepholia : https://base-sepolia.blockscout.com/address/0xAF36427be959C24CA7181A489a69c3Eb64Bc565C

## Stack
Back-end: Solidity (Foundry)
Front-end: ThirdWeb SDK, Next.js, Tailwind CSS
Hosting: Vercel

## Chains
Solana (Neon EVM)
Base
XDC
Injective (inEVM)
Linea
Arbitrum
Hedera

## Future Updates
Variable cost split, right now the split is even among members
"getRequestsIn', "getRequestsOut" output object redesign to be cleaner
Swoosh Pay cost split implementation
