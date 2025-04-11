// async function main() {
//     const [deployer] = await ethers.getSigners();
//     console.log("Deploying contracts with the account:", deployer.address);

//     const Lock = await ethers.getContractFactory("Lock");
//     const lock = await Lock.deploy(60 * 60 * 24 * 365, { value: ethers.utils.parseEther("1") });

//     console.log("Lock contract deployed to:", lock.address);
// }

// main()
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error);
//         process.exit(1);
//     });

const hre = require("hardhat");
async function main() {
    const Create = await hre.ethers.getContractFactory("Create");
    const create = await Create.deploy();

    console.log("Lock with 1 ETH deployed to:", await create.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});