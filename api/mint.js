import { TatumSolanaSDK } from "@tatumio/solana";
import { Currency } from "@tatumio/api-client";
import { sleepSeconds } from "@tatumio/shared-abstract-sdk";
import Moralis from "moralis";
import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { Configuration, OpenAIApi } from 'openai'
dotenv.config();

const SLEEP_SECONDS = 2;

const senderAddress = process.env["MINTER_ADDRESS"];
const senderPrivateKey = process.env["MINTER_PRIVATE_KEY"];
const TatumApi = process.env["TATUM_API"];
const MoralisApi = process.env["MORALIS_API"];
const openaiApi = process.env["OPENAI_API"];

const solanaSDK = TatumSolanaSDK({
    apiKey: TatumApi,
});

Moralis.start({
  apiKey: MoralisApi,
});

const configuration = new Configuration({
    apiKey: openaiApi,
});
const openai = new OpenAIApi(configuration);

// runMintSimulator();

// testMint()

// async function testMint() {
//     const uri = "https://ipfs.moralis.io:2053/ipfs/QmfVsGoqHLYXjudaaiFnuUu7PiTDoLnXbuS5A3Vh924W2d/prompts.json"
//     const { nftAddress, txId } = await nftMint(uri);
//     console.log(`Minted NFT: ${nftAddress} in tx: ${txId}`);
// }

// async function runMintSimulator() {
//     const name = "Sarthak Vaish";
//     const emailId = `sarthakvaish184@gmail.com`;
//     const prompt = `HI, This is a first NFT I minted. How is it?`;
//     console.time("Simulator");
//     await mintSimulator(name, emailId, prompt);
//     console.timeEnd("Simulator");
// }

// async function runClaimNftSimulator() {
//     const nftAddress = "3VXaCkTyuqqeUU9bSE2HytcVkE7xqh3RoAm3AaiiUuFh";
//     const receiverAddress = "BTBPKRJQv7mn2kxBBJUpzh3wKN567ZLdXDWcxXFQ4KaV";
//     claimNftSimulator(nftAddress, receiverAddress);
// }

async function mintThisImage(name, emailId, imageUrl) {
    const uri = await formURI(imageUrl);
    console.log("uri", uri);
    const { nftAddress, txId } = await nftMint(uri);
    console.log(`Minted NFT: ${nftAddress} in tx: ${txId}`);
    // add table email, nftAddress
    await sendMail(emailId, imageUrl, nftAddress, name);
    return nftAddress;
}

export async function mintBannerSimulator(name, emailId, prompt) {
    const imageUrl = await createImage(name, emailId, prompt);
    console.log("image", imageUrl);
    const nftAddress = await mintThisImage(name, emailId, imageUrl)
    return nftAddress;
}

export async function mintAiSimulator(name, emailId, prompt) {
    const imageUrl = await generateAIImage(prompt)
    const nftAddress = await mintThisImage(name, emailId, imageUrl)
    return nftAddress;
}


export async function claimNftSimulator(nftAddress, receiverAddress) {
    const txId = await claimNft(receiverAddress, nftAddress);
    console.log(`Transferred NFT: ${nftAddress} in tx: ${txId}`);
}

async function nftMint(uri) {
    try {
        const { txId, nftAddress } =
            await solanaSDK.nft.send.mintSignedTransaction({
                to: senderAddress,
                from: senderAddress,
                fromPrivateKey: senderPrivateKey,
                metadata: {
                    name: "Prompt_NFT",
                    symbol: "PN",
                    sellerFeeBasisPoints: 0,
                    uri: uri,
                    creators: [
                        {
                            address: senderAddress,
                            share: 100, // means that creator owns 100% of NFT
                            verified: true, // means that this creator is signed transaction
                        },
                    ],
                },
            });

        await sleepSeconds(SLEEP_SECONDS);
        return { nftAddress, txId };
    } catch (error) {
        console.log(error);
    }
}

export async function fetchNftImage(nftAddress) {
    try {
        const metadata = await solanaSDK.nft.getNFTMetadataURI(
            Currency.SOL,
            nftAddress
        );
        
        const imageData = await fetch(metadata?.onchainData?.uri)
        const imageUrl = await imageData.json();

        return imageUrl.image;
    } catch (error) {
        console.log(error);
    }
}

export async function fetchAllNft(NFTs){
    console.log("NFT", NFTs)
    const promises = NFTs.map(async (nft) => {
        const imageUrl = await fetchNftImage(nft.tokenId);
        const newNftData = {...(nft.toJSON()), imageUrl}
        return newNftData
    })

    const allNftData = await Promise.all(promises);
    return allNftData
}

async function claimNft(receiverAddress, nftAddress) {
    try {
        const { txId } =
            await solanaSDK.nft.send.transferSignedTransaction({
                to: receiverAddress,
                from: senderAddress,
                fromPrivateKey: senderPrivateKey,
                contractAddress: nftAddress,
            });
        await sleepSeconds(SLEEP_SECONDS);
        return txId;
    } catch (error) {
        console.log(error);
    }
}

export async function createImage(name, emailId, prompt) {
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

async function sendMail(emailId, imageUrl, nftAddress, name) {
    try {
        let txUrl = `https://explorer.solana.com/address/${nftAddress}?cluster=devnet`;

        SibApiV3Sdk.ApiClient.instance.authentications["api-key"].apiKey =
            process.env["BREVO_API_KEY"];

        new SibApiV3Sdk.TransactionalEmailsApi()
            .sendTransacEmail({
                sender: {
                    email: "glenxbuilders@gmail.com",
                    name: "Mint My Words",
                },
                to: [{ email: emailId, name: name }],
                params: {
                    nft_link: imageUrl,
                    name: name,
                    txUrl: txUrl,
                },
                attachment: [{ url: imageUrl, name: "nft.png" }],
                templateId: 3,
            })
            .then(
                function (data) {
                    console.log(data);
                },
                function (error) {
                    console.error(error);
                }
            );
    } catch (e) {
        console.log(e);
    }
}

export async function generateAIImage(prompt) {
    const res = await openai.createImage({
        prompt: prompt,
        n: 1,
        size: "1024x1024",
    })

    const imgUrl = res.data.data[0].url
    console.log("Successfully Generated Image from DALLE.", imgUrl)
    return imgUrl
}