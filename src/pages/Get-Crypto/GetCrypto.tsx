import React from "react";
import { SafeOnRampKit, StripePack } from "@safe-global/onramp-kit";
import { Button } from "@chakra-ui/react";
import { useAccountAbstraction } from "../../store/accountAbstractionContext";

export default function GetCrypto() {
  const { safeSelected } = useAccountAbstraction();

  const fundWallet = async function () {
    const stripePack = new StripePack({
      // Get public key from Stripe: https://dashboard.stripe.com/register
      stripePublicKey: import.meta.env.VITE_STRIPE_KEY,
      // Deploy your own server: https://github.com/5afe/aa-stripe-service
      onRampBackendUrl: "https://aa-stripe.safe.global",
    });
    await stripePack.init();
    const sessionData = await stripePack.open({
      element: "#stripe-root", // Can be any CSS selector
      theme: "dark", // light | dark
      // Optional, if you want to use a specific created session
      // ---
      // sessionId: 'cos_1Mei3cKSn9ArdBimJhkCt1XC',
      // Optional, if you want to specify default options
      // ---
      // defaultOptions: {
      transaction_details: {
        wallet_address: safeSelected,
        lock_wallet_address: true,
        supported_destination_networks: ["polygon"],
        supported_destination_currencies: ["matic"],
      },
      // customer_information: {
      //   email: 'john@doe.com'
      // }
    });
  };
  return (
    <div>
      <Button
        bg={"white"}
        rounded={"2xl"}
        color={"black"}
        size={"lg"}
        mt={50}
        flex={"1 0 auto"}
        onClick={fundWallet}
      >
        Get matic
      </Button>
      <div id="stripe-root"></div>
    </div>
  );
}
