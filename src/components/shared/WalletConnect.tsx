"use client";

import { useState, useRef, useEffect } from "react";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Name,
  Identity,
} from '@coinbase/onchainkit/identity';
import { useUpdateWalletAddress } from "@apis/users/updateWalletAddress/mutation";
import { useAccount } from "wagmi";

export function WalletComponents() {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { mutate: updateWalletAddress, error } = useUpdateWalletAddress();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      const params = { walletAddress: address };
      updateWalletAddress(
        params,
        {
          onError: (error) => {
            console.error('Failed to update wallet address:', error);
          },
        }
      );
    }
  }, [address, isConnected, updateWalletAddress]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex justify-end" ref={wrapperRef}>
      <Wallet>
        <div 
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
        >
          <ConnectWallet>
            <Name />
          </ConnectWallet>
        </div>
        {isOpen && (
          <WalletDropdown>
            <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
              <Name />
              <Address />
            </Identity>
            <WalletDropdownDisconnect />
          </WalletDropdown>
        )}
      </Wallet>
    </div>
  );
}