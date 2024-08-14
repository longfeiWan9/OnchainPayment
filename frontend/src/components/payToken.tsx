import { useState, useEffect } from "react";
import {
  useWaitForTransactionReceipt,
  useWriteContract,
  useAccount,
} from "wagmi";
import paymentContract from "../contracts/PaymentContract.json";
import { erc20Abi } from "../contracts/erc20_abi";
import { ethers } from "ethers";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import LoadingBar from "../LoadingBar";

const PAYMENT_CONTRACT_ADDRESS = "0x12191e7F6D1CA2Ebb25b04B178F4EF0479CEb5F0";
const WFIL_CONTRACT_ADDRESS = "0xaC26a4Ab9cF2A8c5DBaB6fb4351ec0F4b07356c4";
const abi = paymentContract.abi;

export function PayToken() {
  const [amount, setAmount] = useState("1.25");
  const [isApproveConfirmed, setIsApproveConfirmed] = useState(false);
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
  const [isPaymentSent, setIsPaymentSent] = useState(false);
  const { isConnected, address: payerAddress } = useAccount();
  const { data: hash, writeContract } = useWriteContract();
  const [progress, setProgress] = useState(0);

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const handlePayment = async () => {
    setIsApproveConfirmed(false);
    setIsPaymentConfirmed(false);
    setProgress(0);
    writeContract({
      address: WFIL_CONTRACT_ADDRESS,
      abi: erc20Abi,
      functionName: "approve",
      args: [PAYMENT_CONTRACT_ADDRESS, ethers.parseEther(amount)],
    });
  };

  useEffect(() => {
    if (isConfirming) {
      setProgress(50);
    }
    if (isConfirmed) {
      if (!isApproveConfirmed) {
        setIsApproveConfirmed(isConfirmed);

        if (!isPaymentSent) {
          writeContract({
            address: PAYMENT_CONTRACT_ADDRESS,
            abi,
            functionName: "pay",
            args: [ethers.parseUnits(amount, 18)],
          });
          setIsPaymentSent(true);
        }
      } else if (!isPaymentConfirmed) {
        setIsPaymentConfirmed(isConfirmed);
        setProgress(100);
      }
    }
  }, [isConfirming, isConfirmed]);

  if (isConnected) {
    return (
      <div>
        <h3
          style={{
            display: "flex",
            fontSize: "24px",
            fontWeight: "600",
          }}
        >
          Paying the Filecoin storage service with tokens
        </h3>
        {payerAddress && (
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
            Payer Address: {payerAddress}
          </div>
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            backgroundColor: "#F5F5F5B0",
            border: "none",
            borderRadius: "15px",
            fontSize: "20px",
            gap: "24px",
            fontWeight: "600",
            padding: "2rem 4rem",
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
                            placeholder="1.25"
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
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
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
                        <div style={{ fontSize: "18px", fontWeight: "600", marginTop: "0.5rem" }}>
                          Balance: {parseFloat(account.balanceFormatted ?? "0").toFixed(2)}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
        <div
          style={{
            paddingTop: 24,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={handlePayment}
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
            Send Payment
          </button>
        </div>
        {hash && <div>Transaction Hash: {hash}</div>}
        {isConfirming && <div>Waiting for confirmation...</div>}
        {isApproveConfirmed && <div>Approve is confirmed...</div>}
        {isPaymentConfirmed && <div>Payment is received...</div>}
        {progress > 0 && <LoadingBar progress={progress} />}
      </div>
    );
  }
}
