// import fetch from "node-fetch";
import { Currency } from "@tatumio/api-client";
import { TatumFlowSDK } from "@tatumio/flow";
import Moralis from "moralis";
import dotenv from "dotenv";
import SibApiV3Sdk from "sib-api-v3-sdk";
dotenv.config();

// runSimulator();

// async function runSimulator() {
//     const name = "Sarthak Vaish";
//     const emailId = `sarthakvaish184@gmail.com`;
//     const prompt = `HI, This is a first NFT I minted. How is it?`;
//     console.time("Simulator")
//     await mintSimulator(name, emailId, prompt);
//     console.timeEnd("Simulator")
// }

const TatumApi = process.env["TATUM_API"];

const flowSDK = TatumFlowSDK({
  apiKey: TatumApi,
  testnet: true,
});

const MoralisApi = process.env["MORALIS_API"];

Moralis.start({
  apiKey: MoralisApi,
});

export async function mintSimulator(name, emailId, prompt) {
  try {
    const imageUrl = await createImage(name, emailId, prompt);
    // console.log(imageUrl);
    const uri = await formURI(imageUrl);
    // console.log(uri);
    const txHash = await nftMint(uri);
    // console.log(txHash);
    await sendMail(emailId, imageUrl, txHash, name);
    console.log("sent!")
  } catch (e) {
    console.log(e);
  }
}

async function sendMail(emailId, imageUrl, txHash, name) {
  try {
    let txUrl = `https://testnet.flowscan.org/transaction/${txHash}`;

    SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey =
      process.env["BREVO_API_KEY"];

    new SibApiV3Sdk.TransactionalEmailsApi()
      .sendTransacEmail({
        sender: { email: "glenxbuilders@gmail.com", name: "Sarthak Vaish" },
        to: [{ email: emailId, name: name }],
        params: { nft_link: imageUrl, name: "Sarthak Singhal", txUrl: txUrl },
        attachment: [{ url: imageUrl, name: "nft.png" }],
        templateId: 3,
      })
      .then(
        function(data) {
          console.log(data);
        },
        function(error) {
          console.error(error);
        }
      );
  } catch (e) {
    console.log(e);
  }
}

async function nftMint(metadata) {
  const contractAddress = process.env["TATUM_CONTRACT_ADDRESS"];
  const account = process.env["TATUM_ACCOUNT"];
  const privateKey = process.env["TATUM_PRIVATE_KEY"];

  const nftMinted = await flowSDK.nft.send.mintSignedTransaction({
    chain: Currency.FLOW,
    contractAddress,
    account,
    to: account,
    privateKey,
    url: metadata,
  });

  console.log(
    `Minted nft with transaction ID: ${nftMinted.txId} and token ID: ${nftMinted.tokenId}`
  );

  return nftMinted.txId;
}

async function formURI(url) {
  try {

    const uploadArray = [
      {
        path: "prompts.json",
        content: {
          image: url,
        },
      },
    ];

    const response = await Moralis.EvmApi.ipfs.uploadFolder({
      abi: uploadArray,
    });

    const uri = response.result[0].path;
    // console.log(uri);

    return uri;
  } catch (e) {
    console.log(e);
  }
}

async function createImage(name, emailId, prompt) {
  try {
    const BannerBearApi = process.env["BANNERBEAR_API"];
    const templateId = process.env["BANNERBEAR_TEMPLATE_ID"];
    const pfp = process.env["PFP_IMAGE"];

    let data = {
      template: templateId,
      modifications: [
        {
          name: "background",
          color: null,
        },
        {
          name: "tweet_background",
          color: null,
        },
        {
          name: "avatar",
          image_url: pfp,
        },
        {
          name: "name",
          text: name,
          color: null,
          background: null,
        },
        {
          name: "username",
          text: emailId,
          color: null,
          background: null,
        },
        {
          name: "tweet",
          text: prompt,
          color: null,
          background: null,
        },
      ],
      webhook_url: null,
      transparent: false,
      metadata: null,
    };

    let imageData = await fetch("https://api.bannerbear.com/v2/images", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BannerBearApi}`,
      },
    });

    let res1 = await imageData.json();

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(2500);

    let img = fetch(`https://api.bannerbear.com/v2/images/${res1.uid}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${BannerBearApi}`,
      },
    });

    let res = await img;
    let res2 = await res.json();

    let url = res2.image_url_png;
    // console.log(url);

    return url;
  } catch (e) {
    console.log(e);
  }
}
