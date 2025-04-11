"use client"; // Mark this file as a Client Component

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Use next/navigation for client-side navigation
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { VotingAddress, VotingAddressABI } from "./constants";
import axios, { all } from "axios";

const PINATA_JWT = `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`;

const pinJSONToIPFS = async (JSONBody) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    try {
        const response = await axios.post(url, JSONBody, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: PINATA_JWT,
            },
        });
        return {
            success: true,
            pinataURL: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`,
        };
    } catch (error) {
        console.error('Error uploading data to IPFS:', error);
        return {
            success: false,
            message: error.message,
        };
    }
};

const ensureSepoliaNetwork = async () => {
    try {
        const provider = new ethers.BrowserProvider(await new Web3Modal().connect());
        const network = await provider.getNetwork();

        // Kiểm tra nếu không phải mạng Sepolia
        if (network.chainId !== 11155111n) {
            try {
                // Yêu cầu chuyển sang mạng Sepolia
                await window.ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: "0xaa36a7" }], // Chain ID của Sepolia (hexadecimal)
                });

                console.log("Switched to Sepolia network.");
                return provider; // Trả về provider đã cập nhật
            } catch (switchError) {
                // Nếu mạng Sepolia chưa được thêm vào MetaMask
                if (switchError.code === 4902) {
                    try {
                        await window.ethereum.request({
                            method: "wallet_addEthereumChain",
                            params: [
                                {
                                    chainId: "0xaa36a7",
                                    chainName: "Sepolia Testnet",
                                    rpcUrls: ["https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID"],
                                    nativeCurrency: {
                                        name: "Ethereum",
                                        symbol: "ETH",
                                        decimals: 18,
                                    },
                                    blockExplorerUrls: ["https://sepolia.etherscan.io"],
                                },
                            ],
                        });

                        console.log("Added and switched to Sepolia network.");
                        return provider; // Trả về provider đã cập nhật
                    } catch (addError) {
                        console.error("Failed to add Sepolia network:", addError);

                    }
                } else {
                    console.error("Failed to switch network:", switchError);

                }
            }
        }
        console.log("Already on Sepolia network.");
        return provider; // Trả về provider nếu đã ở mạng Sepolia
    } catch (error) {
        console.error("Error ensuring Sepolia network:", error);
    }
};

const fetchContract = (signerOrProvider) =>
    new ethers.Contract(VotingAddress, VotingAddressABI, signerOrProvider);

export const VotingContext = React.createContext();

export const VotingProvider = ({ children }) => {
    const votingTitle = "Voting Dapp";
    const router = useRouter();
    const [currentAccount, setCurrentAccount] = useState("");
    const [candidateLength, setCandidateLength] = useState(""); // Khởi tạo state candidateLength
    const pushCandidate = [];
    const candidateIndex = [];
    const [candidateArray, setCandidateArray] = useState(pushCandidate); // Khởi tạo state candidateArray

    const [hasVoted, setHasVoted] = useState(false); // Khởi tạo state hasVoted
    const [error, setError] = useState("");
    const highestVote = [];

    const pushVoter = [];
    const [voterArray, setVoterArray] = useState(pushVoter); // Khởi tạo state voterArray
    const [voterLength, setVoterLength] = useState(""); // Khởi tạo state voterLength
    const [voterAddress, setVoterAddress] = useState([]); // Khởi tạo state voterAddress

    const checkIfWalletIsConnected = async () => {
        if (!window.ethereum) return setError("Please install MetaMask.");
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length) {
            setCurrentAccount(accounts[0]);
            getHasVoted(accounts[0]);
        } else {
            setError("No accounts found.");
        }
         // Gọi hàm getHasVoted khi ví được kết nối
    }

    // useEffect(() => {getHasVoted()}, [currentAccount]);

    // Kết nối ví MetaMask
    const connectWallet = async () => {
        if (!window.ethereum) return setError("Please install MetaMask.");
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setCurrentAccount(accounts[0]);
        getHasVoted(accounts[0]); // Gọi hàm getHasVoted khi ví được kết nối
        setError(""); // Xóa lỗi khi kết nối thành công
    };



    // Tải tệp lên IPFS thông qua Pinata
    const uploadToIPFS = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
                method: "POST",
                headers: {
                    Authorization: PINATA_JWT,
                },
                body: formData,
            });

            const result = await res.json();
            const url = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
            return url;
        } catch (error) {
            console.error("Error uploading file to Pinata:", error);
            return null;
        }
    };

    // Create voter
    const createVoter = async (formInput, fileUrl, router) => {
        try {
            const { name, address, position } = formInput;
            if (!name || !address || !position) {
                setError("Please fill all fields.");
                return;
            }

            // Kết nối ví MetaMask thông qua Web3Modal
            const provider = await ensureSepoliaNetwork(); // Đảm bảo đang ở mạng Sepolia
            const signer = await provider.getSigner(); // Lấy signer từ provider
            const contract = fetchContract(signer); // Kết nối với smart contract
            console.log("Connected to contract:", contract);
            // Tải dữ liệu lên IPFS
            const data = JSON.stringify({ name, address, position, image: fileUrl });
            const pinataResponse = await pinJSONToIPFS(data);
            if (!pinataResponse.success) {
                setError("Failed to upload data to IPFS.");
                return;
            }
            else console.log("Data uploaded to IPFS:", pinataResponse);

            const url = pinataResponse.pinataURL;
            console.log("IPFS URL:", url);

            // Gửi giao dịch đến smart contract
            try {
                const voter = await contract.voterRight(address, name, fileUrl, url); // Gọi hàm hợp đồng
                console.log("Transaction sent:", voter);

                const receipt = await voter.wait(); // Đợi giao dịch được xác nhận
                console.log("Transaction receipt:", receipt);

                router.push("/VoterList");
            } catch (error) {
                console.error("Error sending transaction:", error);
                setError("Failed to send transaction. Please check your data and try again.");
            }

        } catch (error) {
            console.error("Error creating voter:", error);
            setError("Failed to create voter.");
        }
    };

    //Get voter data
    const getAllVoterData = async () => {
        try {
            pushVoter.length = 0; // Reset mảng pushVoter
            const provider = await ensureSepoliaNetwork(); // Đảm bảo đang ở mạng Sepolia
            // const signer = provider.getSigner(); // Lấy signer từ provider
            const contract = fetchContract(provider);

            //voter list
            const voterListData = await contract.getVoterList();
            setVoterAddress(voterListData); // Lưu voter list vào state
            await Promise.all( // Sử dụng Promise.all để xử lý tất cả các promise cùng một lúc
                voterListData.map(async (el) => {
                    const singleVoterData = await contract.getVoterData(el); // Lấy dữ liệu của từng voter
                    pushVoter.push(singleVoterData); // Thêm dữ liệu vào mảng pushCandidate
                })
            );
            setVoterArray([...pushVoter]);
            // Lưu voter vào state
            console.log("Voter data:", pushVoter);
            const voterList = await contract.getVoterLength();
            setVoterLength(Number(voterList));
        }
        catch (error) {
            console.error("Error getting voter data:", error);
            setError("Failed to get voter data.");
        }
    };

    // useEffect(() => {
    //     getAllVoterData(); // Gọi hàm khi component được mount
    // }, []);

    //give vote
    const giveVote = async (id) => {
        try {
            const voterAddress = id.address;
            const voterId = id.id;
            console.log("Address:", voterAddress);
            const provider = await ensureSepoliaNetwork(); // Đảm bảo đang ở mạng Sepolia
            const signer = await provider.getSigner(); // Lấy signer từ provider
            const contract = fetchContract(signer);
            const voteredList = await contract.vote(voterAddress, voterId);
            getNewCandidate();
            getAllVoterData();
            setHasVoted(true); // Đánh dấu là đã bỏ phiếu
        }
        catch (error) {
            console.error("Error giving vote:", error);
            setError("Failed to give vote.");
        }
    }

    const getHasVoted = async (address) => {
        try {
            const provider = await ensureSepoliaNetwork(); // Đảm bảo đang ở mạng Sepolia
            const contract = fetchContract(provider);
            // const voterAddress = currentAccount; // Lấy địa chỉ ví của người dùng
            const voter = await contract.getVoterData(address); // Lấy dữ liệu của voter
            if (voter[5] === true) {
                setHasVoted(true); // Nếu đã bỏ phiếu, cập nhật state hasVoted
            } else {
                setHasVoted(false); // Nếu chưa bỏ phiếu, cập nhật state hasVoted
            }
        }
        catch (error) {
            console.error("Error getting hasVoted:", error);
            setError("Failed to get hasVoted.");
        }
    }

    //----candidate section----//
    // Create voter
    const setCandidate = async (candidateForm, fileUrl, router) => {
        try {
            const { name, address, age } = candidateForm;
            if (!name || !address || !age) {
                console.log("Please fill all fields.");
                setError("Please fill all fields.");
                return;
            }

            // Kết nối ví MetaMask thông qua Web3Modal
            const provider = await ensureSepoliaNetwork(); // Đảm bảo đang ở mạng Sepolia
            const signer = await provider.getSigner(); // Lấy signer từ provider
            const contract = fetchContract(signer); // Kết nối với smart contract
            // Tải dữ liệu lên IPFS
            const data = JSON.stringify({ name, address, image: fileUrl, age });
            const pinataResponse = await pinJSONToIPFS(data);
            if (!pinataResponse.success) {
                setError("Failed to upload data to IPFS.");
                return;
            }
            else console.log("Data uploaded to IPFS:", pinataResponse);

            const url = pinataResponse.pinataURL;
            console.log("IPFS URL:", url);

            // Gửi giao dịch đến smart contract
            try {
                const candidate = await contract.setCandidate(address, age, name, fileUrl, url); // Gọi hàm hợp đồng
                console.log("Transaction sent:", candidate);

                const receipt = await candidate.wait(); // Đợi giao dịch được xác nhận
                console.log("Transaction receipt:", receipt);

                router.push("/");
            } catch (error) {
                console.error("Error sending transaction:", error);
                setError("Failed to send transaction. Please check your data and try again.");
            }

        } catch (error) {
            console.error("Error setting candidate:", error);
            setError("Failed to set candidate.");
        }
    };

    //get candidate data
    const getNewCandidate = async () => {
        try {
            pushCandidate.length = 0;
            candidateIndex.length = 0;
            const provider = await ensureSepoliaNetwork(); // Đảm bảo đang ở mạng Sepolia
            // const signer = provider.getSigner(); // Lấy signer từ provider
            const contract = fetchContract(provider);
            //all candidate
            const allCandidate = await contract.getCandidate();

            await Promise.all( // Sử dụng Promise.all để xử lý tất cả các promise cùng một lúc
                allCandidate.map(async (el) => {
                    const singleCandidateData = await contract.getCandidateData(el); // Lấy dữ liệu của từng candidate
                    pushCandidate.push(singleCandidateData);// Thêm dữ liệu vào mảng pushCandidate
                    candidateIndex.push(Number(singleCandidateData[2])); // Thêm địa chỉ vào mảng candidateIndex

                })
            );
            setCandidateArray([...pushCandidate]);// Lưu candidate vào state
            //candidate length
            const allCandidateLength = await contract.getCandidateLength();
            setCandidateLength(Number(allCandidateLength)); // Lưu candidate length vào state
            console.log(Number(allCandidateLength));
        }
        catch (error) {
            console.error("Error getting candidate data:", error);
            setError("Failed to get candidate data.");
        }
    }

    // useEffect(() => {
    //     getNewCandidate(); // Gọi hàm khi component được mount
    // })

    return (
        <VotingContext.Provider value={{
            votingTitle,
            checkIfWalletIsConnected,
            connectWallet,
            uploadToIPFS,
            createVoter,
            getAllVoterData,
            giveVote,
            setCandidate,
            getNewCandidate,
            error,
            hasVoted,
            getHasVoted,
            voterArray,
            voterLength,
            voterAddress,
            currentAccount,
            candidateLength,
            candidateArray,
        }}>
            {children}
        </VotingContext.Provider>
    );
};