import mongoose from "mongoose"

const NFTmappingScheama = mongoose.Schema({
    name: {
        type: String,
        requird: [true, "Please provide name"]
    },
    email: {
        type: String,
        requird: [true, "Please provide email"],
        unique: true 
    },
    NFT: [{ tokenId: String, date: Date, claimed: Boolean }],
})


export default mongoose.model("NFTs", NFTmappingScheama)
// module.exports = mongoose.model("NFTs", NFTmappingScheama)