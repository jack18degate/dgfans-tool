import { Metadata } from 'next';
import TurboRangeApp from '../components/turbo-range/TurboRangeApp';

export const metadata: Metadata = {
  title: 'DGFans Tool — Turbo Range Analysis',
  description: 'Seleziona una pool per avviare la scansione radar della liquidità e simulare l\'Hyper-Yield in tempo reale su Solana Raydium e Degate.',
};

export default function TurboPage() {
  return <TurboRangeApp />;
}
