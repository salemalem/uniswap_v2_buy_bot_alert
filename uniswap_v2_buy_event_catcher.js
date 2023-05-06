import { ethers } from "https://cdn.ethers.io/lib/ethers-5.4.6.esm.min.js";
// import { ENS } from "https://esm.sh/gh/ensdomains/ensjs-v3@main/packages/ensjs/src/index.ts";
// https://stackoverflow.com/questions/69617564/web3-get-name-from-address
import { telegramSendToGroup } from "./telegram_send_to_group.js";

import UNISWAP_V2_PAIR_ABI from "./abi/uniswap_v2_pair.abi.json"  assert { type: "json" };

const provider = new ethers.providers.InfuraProvider('mainnet', 'd4a52007f10e41d2afa76c5ad167f6bf');
const signer = new ethers.Wallet('851f32538bf5ad27379149ddd3774f098b2a21ee742bc9eab8524d08a12065b8', provider);

// const uniswap_v2_pair_address = "0xA43fe16908251ee70EF74718545e4FE6C5cCEc9f";
const uniswap_v2_pair_address = "0x8E47734ae54A66f9C76505EF8CE318A9eCf5C587";

const uniswap_v2_pair_contract = new ethers.Contract(uniswap_v2_pair_address, UNISWAP_V2_PAIR_ABI, signer);

console.log("Listening for Buy events...");

const eventSwap = 'Swap';
const filter = uniswap_v2_pair_contract.filters[eventSwap]();

/*
// Get all past buy events of the uniswap v2 pair contract
uniswap_v2_pair_contract.queryFilter(filter, 0, 0x1060280) // from 0 block to latest
  .then((events) => {
    // Loop through each event and log the details
    events.forEach((event) => {
      const buyAmount = event.args[2] / 10 ** 18;
      if (buyAmount !== 0) {
        console.log(`Buy event received:`);
        console.log(`  Transaction hash: ${event.transactionHash}`);
        console.log(`  Buy amount in ETH: ${buyAmount}`);
        console.log(`  Buyer: ${event.args[5]}`);
        // console.log(event);
      }
    });
  })
  .catch((error) => {
    console.error(error);
  });
*/
const etherscanUrl = "https://etherscan.com/tx/";
uniswap_v2_pair_contract.on(filter, async (...args) => {
  const buyAmount = args[2] / 10 ** 18;
  if (buyAmount !== 0) {
    console.log(`Buy event received:`);
    const viewOnExplorer = `[Tx](${etherscanUrl}${args[6].transactionHash})`;
    const buyer = args[5];
    let message = `${buyer} bought $BAEPE for ${buyAmount} $ETH | ${viewOnExplorer}} \n`;
    console.log(message);
    const msgSent = await telegramSendToGroup(message);
    console.log('Message sent to telegram group');
    console.log(msgSent);
  }
});

