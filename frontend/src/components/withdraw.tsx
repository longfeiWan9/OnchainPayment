import { useState } from "react";
import {
  type BaseError,
  useWaitForTransactionReceipt,
  useWriteContract,
  useReadContract,
  useAccount,
} from "wagmi";
import paymentContract from "../contracts/PaymentContract.json";
import { parseEther } from "viem";
import { ethers } from "ethers";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import LoadingBar from "../LoadingBar";

const PAYMENT_CONTRACT_ADDRESS = "0x12191e7F6D1CA2Ebb25b04B178F4EF0479CEb5F0";
const abi = paymentContract.abi;

export function Withdraw() {
  const [amount, setAmount] = useState("1.25");
  const { address, isConnected } = useAccount();
  const { data: hash, writeContract } = useWriteContract();

  const wagmiContractConfig = {
    address: PAYMENT_CONTRACT_ADDRESS,
    abi: abi,
  } as const;

  const { data: onwerAddress, isPending } = useReadContract({
    ...wagmiContractConfig,
    functionName: "getOwner",
    args: [],
  });

  const { data: balance } = useReadContract({
    ...wagmiContractConfig,
    functionName: "getContractBalance",
    args: [],
    account: address,
  });

  const handleWithdraw = async () => {
    writeContract({
      address: PAYMENT_CONTRACT_ADDRESS,
      abi: abi,
      functionName: "withdraw",
      args: [parseEther(amount)],
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  if (isPending) return <div>Loading...</div>;

  if (isConnected && onwerAddress == address) {
    return (
      <div>
        <h3
          style={{
            display: "flex",
          }}
        >
          Withdraw Token Payment
        </h3>
        <div
          style={{
            borderRadius: "15px",
            padding: "1rem 2rem",
            fontWeight: "600",
            backgroundColor: "#F5F5F5B0",
            color: "#0000005E",
            marginBottom: "1rem",
          }}
        >
          To | {address}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "#F5F5F5B0",
            border: "none",
            borderRadius: "15px",
            fontSize: "20px",
            fontWeight: "600",
            padding: "2rem 4rem",
            gap: "24px",
          }}
        >
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== "loading";
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === "authenticated");

              return (
                <div>
                  {(() => {
                    if (!connected) {
                      return (
                        <button onClick={openConnectModal} type="button">
                          Connect Wallet
                        </button>
                      );
                    }

                    return (
                      <div>
                        <button
                          onClick={openChainModal}
                          style={{
                            display: "flex",
                            gap: "5px",
                            backgroundColor: "#FFF",
                            border: "none",
                            borderRadius: "100px",
                            fontSize: "20px",
                            fontWeight: "600",
                            padding: "0.8rem 1rem",
                            marginBottom: "2rem",
                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                          }}
                          type="button"
                        >
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            style={{ width: 24, height: 24 }}
                          />
                          {chain.name}
                        </button>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <input
                            type="text"
                            placeholder={amount}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            style={{
                              border: "none",
                              borderRadius: "15px",
                              padding: "0.5rem 1rem",
                              fontWeight: "600",
                              backgroundColor: "#F5F5F5B0",
                              color: "#0000005E",
                              fontSize: "18px",
                              width: "80px",
                            }}
                          />
                          <span style={{ fontSize: "18px", fontWeight: "600" }}>
                            wFIL
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== "loading";
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === "authenticated");

              return (
                <div>
                  {(() => {
                    if (!connected) {
                      return (
                        <button onClick={openConnectModal} type="button">
                          Connect Wallet
                        </button>
                      );
                    }

                    return (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                        }}
                      >
                        <button
                          onClick={openChainModal}
                          style={{
                            display: "flex",
                            gap: "5px",
                            backgroundColor: "#4FD1C5",
                            border: "none",
                            borderRadius: "100px",
                            fontSize: "20px",
                            fontWeight: "600",
                            color: "#FFF",
                            padding: "0.8rem 1rem",
                            marginBottom: "2rem",
                            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                          }}
                          type="button"
                        >
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            style={{ width: 24, height: 24 }}
                          />
                          {account.balanceSymbol}
                        </button>
                        <div
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            marginTop: "0.5rem",
                          }}
                        >
                          Balance:{" "}
                          {parseFloat(account.balanceFormatted ?? "0").toFixed(
                            2
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
        {/* <p>
          <div>
            Contract Balance: {ethers.formatUnits(balance?.toString()!, 18)}{" "}
            wFIL
          </div>
        </p> */}
        {/* 
        <input
          type="text"
          placeholder="0.05"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />{" "}
        wFIL
        <div style={{ paddingTop: 12 }}>
          <button onClick={handleWithdraw} disabled={isPending}>
            Withdraw
          </button>
        </div>
        */}
        <div
          style={{
            paddingTop: 24,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={handleWithdraw}
            disabled={isConfirming}
            style={{
              backgroundColor: "#319795",
              border: "1px solid #ccc",
              borderRadius: "100px",
              fontSize: "20px",
              color: "#FFF",
              padding: "0.8rem 2rem",
              marginBottom: "1rem",
              cursor: "pointer",
            }}
          >
            Withdraw
          </button>
        </div>
        {isConfirming && <div>Waiting for confirmation...</div>}
        {isConfirmed && <div>Payment is withdrawed...</div>}
        {hash && <div>Transaction Hash: {hash}</div>}
      </div>
    );
  }
}
