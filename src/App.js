import '@rainbow-me/rainbowkit/dist/index.css';
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { YourComponent } from "./YourComponent";

// Configure chains & providers with the Alchemy provider.
// Two popular providers are Alchemy (alchemy.com) and Infura (infura.io) also taking public provider
// Custom additon of chain and providers : https://billyjitsu.hashnode.dev/the-rainbowkit-wagmi-guide-i-wish-i-had#heading-the-rainbowkit-wagmi-guide-i-wish-i-had
// limit network to 1 to remove dropdown 
const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism, chain.arbitrum, chain.polygonMumbai],
  [alchemyProvider({ alchemyId: "IItFVmzc5gWClV0ba3hDDdqtppKw-9OP" }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "SecureDApp_Launchpad",
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});

export default function App() {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <YourComponent />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
