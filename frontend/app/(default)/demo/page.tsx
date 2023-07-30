"use client";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import toast, { Toaster } from "react-hot-toast";

const BASE_URL = "https://mint-my-words.onrender.com/users/";

export default function FeaturesBlocks() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [imagetype, setAge] = React.useState<string>("");
  const [imagePrompt, setimagePrompt] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false)
  const handleChange = (event: SelectChangeEvent<typeof imagetype>) => {
    setAge(event.target.value);
  };

  async function mintNft() {
    if (!imagetype) {
      toast.error("Choose Image type");
      return false
    }
    if (!imagePrompt) {
      toast.error("Enter Image Prompt");
      return false
    }

    if (!user?.primaryEmailAddress?.emailAddress){
        toast.error("You are not logged in. Login to continue");
        return false
    }
    if (!user?.fullName){
        toast.error("Your Name is not given in your Gmail.");
        return false
    }

    const profileName = user.fullName
    const profileEmail = user?.primaryEmailAddress?.emailAddress

    try {
      setLoading(true)
      
      await mintNFTSimulator(profileName, profileEmail, imagePrompt, imagetype);
      setLoading(false)
      toast.success("success! You will receive NFT on yoru mail within a minute");
    } catch (error: any) {
        setLoading(false)
        toast.error("Error: "+ error.message);
        console.log(error);
    }
  }

  
  async function mintNFTSimulator(name: string, email: string, prompt: string, type: string) {
    try {
      const user = await checkUserExistence(name, email);
      console.log("user", user)
      if (type === "ai"){
        const nft = await mintAINft(email, prompt);
        console.log("minted ai nft", nft);
      }
      else{
        const nft = await mintBannerNFT(email, prompt);
        console.log("minted banner nft", nft);
      }
    } catch (error) {
      throw error;
    }
  }
  
  async function checkUserExistence(name: string, email: string) {
    try {
      const response = await axios.get(BASE_URL + email);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return createUser(name, email);
      } else {
        throw error;
      }
    }
  }
  async function createUser(name: string, email: string) {
    try {
      let obj = {
        name,
        email,
      };
      const response = await axios.post(BASE_URL + "create", obj);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async function mintAINft(email: string, prompt: string) {
    try {
      let obj = {
        prompt,
      };
  
      const response = await axios.post(BASE_URL + email + "/create/ai", obj);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async function mintBannerNFT(email: string, prompt: string) {
    try {
      let obj = {
        prompt,
      };
  
      const response = await axios.post(BASE_URL + email + "/create/banner", obj);
      return response.data;
    } catch (error) {
      throw error;
    }
  }



  return (
    <section className="relative">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
            <h2 className="h2 mb-4">Test Our Project</h2>
            <p className="text-xl text-gray-600">
              Since our Alexa skill is still not published, You can test our
              service using this demo form. Just Enter prompt and select image
              type, we will your send NFT by mail.
            </p>
          </div>

          <div className="max-w-xl mx-auto pb-12 md:pb-20">
            <FormControl fullWidth>
              <InputLabel id="demo-controlled-open-select-label">
                Type
              </InputLabel>
              <Select
                labelId="demo-controlled-open-select-label"
                id="demo-controlled-open-select"
                value={imagetype}
                label="Type"
                onChange={handleChange}
              >
                <MenuItem value={"ai"}>AI</MenuItem>
                <MenuItem value={"tweet"}>Tweet-like</MenuItem>
              </Select>
            </FormControl>

            <TextField
              id="outlined-textarea"
              label="Prompt"
              placeholder="Description of Image you want to mint"
              multiline
              fullWidth
              rows={2}
              value={imagePrompt}
              onChange={(e) => setimagePrompt(e.target.value)}
              sx = {{marginTop: 2}}
            />
            <div className="mt-8 w-full flex justify-center items-center">
              <button
                onClick={mintNft}
                disabled={loading}
                className="py-4 px-10 mx-auto text-white bg-blue-600 hover:bg-blue-700  rounded-md text-sm disabled:opacity-60"
              >
                Mint NFT
              </button>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </section>
  );
}
