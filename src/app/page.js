"use client";
import Image from "next/image";
import React, { useState, useEffect, useContext } from "react";
import Countdown from "react-countdown";
import { VotingContext } from "@/context/Voter";
import { Card } from "@/components/Card/Card";

export default function Home() {
  const { getNewCandidate,
    currentAccount,
    candidateArray,
    giveVote,
    hasVoted,
    getAllVoterData,
    checkIfWalletIsConnected,
    candidateLength,
    voterLength } = useContext(VotingContext);

  useEffect(() => {
    if (!currentAccount) {
      checkIfWalletIsConnected();
    }
    else {
      checkIfWalletIsConnected();
      getNewCandidate();
      getAllVoterData();
    }
  }, [currentAccount]);
  return (
    <div className="h-[100vh] w-[70%] mx-auto my-2 sm:width-[90%]"> {currentAccount && (
      <div className="my-3 grid grid-cols-2 gap-2">
        <div className="bg-[#231e39] p-2 rounded-lg grid grid-col-1 gap-2 items-center sm:grid-cols-2 text-[#]">
          <div className="bg-[#006aff] p-2">
            <p className="font-[600]">No Candidate: <span className="bg-[#231e39] p-1 ml-1 text-[#6596c4] rounded-lg">{candidateLength}</span></p>
          </div>
          <div className="bg-[#006aff] p-2">
            <p className="font-[600]">No Voter: <span className="bg-[#231e39] p-1 ml-1 text-[#6596c4] rounded-lg">{voterLength}</span></p>
          </div>
        </div>
        <div className="bg-[#231e39] p-[2rem] rounded-lg grid grid-col-1 gap-2 items-center sm:grid-cols-2 text-[#6596c4] relative">
          <small className="text-2xl font-semibold top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 absolute sm:text-5xl">
            <Countdown date={Date.now() + 10000000} />
          </small>
        </div>
      </div>
    )}

      <Card candidateArray={candidateArray} giveVote={giveVote} hasVoted={hasVoted}/>
    </div>
  );
}
