import PokemonList from '@/components/PokemonList/PokemonList.tsx';
import ClientProviders from '@/shared/store/ClientProviders.tsx';
import { createServerStoreForPokemons } from '@/shared/store/serverStore.ts';

export default async function HomePage() {
  const preloadedState = await createServerStoreForPokemons(1);

  return (
    <ClientProviders preloadedState={preloadedState}>
      <PokemonList />
    </ClientProviders>
  );
}
