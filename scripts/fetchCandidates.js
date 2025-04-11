const hre = require("hardhat");

async function main() {
    const VotingContract = await hre.ethers.getContractAt(
        "Create",
        "0xF9A6F90FFa6a6c58160c002C1fcF24F2296f64e5"
    );

    const candidates = await VotingContract.getCandidate();
    console.log("Candidates Addresses:", candidates);

    await VotingContract.vote(candidates[0], 1); // Gọi hàm vote với địa chỉ của ứng cử viên đầu tiên


    console.log(`Candidate at ${candidates[0]}:`, await VotingContract.candidates(candidates[0]).voteCount);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});