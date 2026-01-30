import { configureChains } from 'wagmi';
import { bsc, bscTestnet, mainnet, polygon, linea, lineaTestnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { ParticleAuthConnector } from './particalAuth';
import { PARTICLE_APP_ID, PARTICLE_CLIENT_KEY, PARTICLE_PROJECT_ID } from '@/constants';

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, bsc, bscTestnet, polygon, linea, lineaTestnet],
  [
    // Use explicit JSON-RPC endpoints to avoid Cloudflare RPC issues in some regions.
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id === mainnet.id) {
          return { http: 'https://eth.llamarpc.com' };
        }
        if (chain.id === polygon.id) {
          return { http: 'https://polygon.llamarpc.com' };
        }
        if (chain.id === bsc.id) {
          return { http: 'https://bsc-dataseed.binance.org' };
        }
        if (chain.id === bscTestnet.id) {
          return { http: 'https://data-seed-prebsc-1-s1.binance.org:8545' };
        }
        if (chain.id === linea.id) {
          return { http: 'https://rpc.linea.build' };
        }
        if (chain.id === lineaTestnet.id) {
          return { http: 'https://rpc.goerli.linea.build' };
        }
        return null;
      },
    }),
    publicProvider(),
  ],
);

export const metaMaskConnector = new MetaMaskConnector({ chains });

export const walletConnectConnector = new WalletConnectConnector({
  chains,
  options: { projectId: 'af716327386d5071687fc3727a00e321' },
});

export const bitKeepConnector = new InjectedConnector({
  chains,
  options: {
    name: 'BitKeep',
    getProvider: () => {
      if (typeof window !== 'undefined') {
        return window.bitkeep?.ethereum;
      }
    },
    shimDisconnect: true,
  },
});

export const particleAuthConnector = new ParticleAuthConnector({
  options: {
    projectId: PARTICLE_PROJECT_ID,
    clientKey: PARTICLE_CLIENT_KEY,
    appId: PARTICLE_APP_ID,
  },
});

export const tokenPocketConnector = new InjectedConnector({
  chains,
  options: {
    name: 'TokenPocket',
    getProvider: () => {
      if (typeof window !== 'undefined' && window.ethereum?.isTokenPocket) {
        return window.ethereum;
      }
    },
    shimDisconnect: true,
  },
});
