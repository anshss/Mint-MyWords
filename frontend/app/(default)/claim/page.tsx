"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function FeaturesBlocks() {
  const [nftData, setNftData] = useState<any[]>([]);
  const { isLoaded, isSignedIn, user } = useUser();

  const [address, setAddress] = useState("")

  const [open, setOpen] = useState(false);
  const [nftAddress, setNftAddres] = useState("")

  function setNft(address: string){
    setNftAddres(address)
    setOpen(true);
  }


  const handleClose = () => {
    setOpen(false);
  };

  async function handelClaim(){
    handleClose()
    if (!user?.primaryEmailAddress?.emailAddress) return;

    const response = await axios.patch(
      "https://mint-my-words.onrender.com/users/" + user?.primaryEmailAddress?.emailAddress + "/nft/claimed/" + nftAddress, { receiverAddress: address}
    );
    console.log(response);
  }


  //   async function claimNft(tokenId, receiverAddress){
  // localhost:3001/users/sarthakvaish184@gmail.com/nft/claimed/4u2vo45YWngQW3JjPvgJidnyDvJcvnvASmd4dTfz657j

  //   }

  useEffect(() => {
    async function fetchData(email: string) {
      const response = await axios.get(
        "https://mint-my-words.onrender.com/users/fetchnft/" +
        email
      );
      return response.data;
    }

    if (user?.primaryEmailAddress?.emailAddress){
      fetchData(user.primaryEmailAddress?.emailAddress).then((data) => setNftData(data));
    }
  }, [user?.emailAddresses]);

  console.log(nftData);
  return (
    <section className="relative">
      <div className="absolute left-0 right-0 bottom-0 m-auto w-px p-px h-20 bg-gray-200 transform translate-y-1/2"></div>
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <h2 className="h2 mb-4">Claim Your NFTs</h2>
            <p className="text-xl text-gray-600">
              Sign in with your Solana wallets to prove ownership of the
              address, then you can claim these claimable NFTs by hitting the
              claim button.
            </p>
          </div>

          {/* Items */}
          <div className="max-w-sm mx-auto grid gap-10 md:grid-cols-2 lg:grid-cols-3 items-start md:max-w-2xl lg:max-w-none">
            {nftData.map((item) => (
              <NftCard nftData={item} key={item.tokenId} setopen={setNft} />
            ))}
          </div>
        </div>
      </div>

      <div className="max-md">
    
      <Dialog fullWidth open={open} onClose={handleClose}>
        <DialogTitle>Claim NFT</DialogTitle>
        <DialogContent>
       
          <TextField
            autoFocus
            margin="dense"
            id="address"
            label="Recepient Address"
            type="text"
            fullWidth
            variant="outlined"
            value={address}
            onChange={(e) => {setAddress(e.target.value)}}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handelClaim}>Claim</Button>
        </DialogActions>
      </Dialog>
    </div>
    </section>
  );
}

function NftCard({ nftData, setopen }: any) {
  let imageUrl = "";

  if (nftData.imageUrl) {
    imageUrl = nftData.imageUrl;
  } else {
    imageUrl =
      "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930";
  }

  console.log(nftData);
  return (
    <div className="relative flex flex-col items-center p-6 bg-white rounded shadow-xl">
      <img src={imageUrl} className="w-full aspect-square " />
      {/* <h4 className="text-xl font-bold leading-snug tracking-tight mb-1 mt-3">
        Your NFT
      </h4> */}
      <p className="text-gray-600 text-ellipsis whitespace-nowrap overflow-hidden w-full mt-2">
        NFT Address: {nftData.tokenId}
      </p>
      <div className="w-full">
        {nftData.claimed ? (
          <div className="p-1 px-8 text-white bg-blue-600 hover:bg-blue-700 mt-2 rounded-md text-sm inline-block">
            Already Claimed
          </div>
        ) : (
          <button onClick={() => setopen(nftData.tokenId)} className="p-1 px-8 text-white bg-blue-600 hover:bg-blue-700 mt-2 rounded-md text-sm">
            Claim
          </button>
        )}
      </div>
    </div>
  );
}


function FormDialog() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Subscribe</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}