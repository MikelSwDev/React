import { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../config/constants';
import { getCharacters } from '../services/charactersService';
import CharacterCard from '../components/CharacterCard';
import StateMessage from '../components/StateMessage';

function Separator() {
  return <View style={styles.separator} />;
}

function EmptyList() {
  return <StateMessage message="No hay personajes que mostrar." />;
}

export default function CharactersScreen() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    async function loadFirstPage() {
      console.log('Cargando personajes...');
      setLoading(true);
      setError(null);
      try {
        const data = await getCharacters({ page: 1 });
        console.log('Personajes recibidos:', data.results.length);
        setCharacters(data.results);
        setPage(1);
        setHasNextPage(data.hasNextPage);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadFirstPage();
  }, [reloadKey]);

  function handleRetry() {
    setReloadKey((key) => key + 1);
  }

  async function loadMore() {
    if (loading || loadingMore || refreshing || !hasNextPage) return;
    console.log('Cargando página', page + 1);

    setLoadingMore(true);
    setError(null);
    try {
      const nextPage = page + 1;
      const data = await getCharacters({ page: nextPage });
      setCharacters((prev) => [...prev, ...data.results]);
      setPage(nextPage);
      setHasNextPage(data.hasNextPage);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    setError(null);
    try {
      const data = await getCharacters({ page: 1 });
      setCharacters(data.results);
      setPage(1);
      setHasNextPage(data.hasNextPage);
    } catch (err) {
      setError(err.message);
    } finally {
      setRefreshing(false);
    }
  }

  function renderFooter() {
    if (loadingMore) {
      return <ActivityIndicator style={styles.footer} color={COLORS.primary} />;
    }
    if (error && characters.length > 0) {
      return <Text style={styles.footerError}>{error}</Text>;
    }
    return null;
  }

  let content;
  if (loading) {
    content = <ActivityIndicator style={styles.loader} size="large" color={COLORS.primary} />;
  } else if (error && characters.length === 0) {
    content = <StateMessage message={error} actionLabel="Reintentar" onAction={handleRetry} />;
  } else {
    content = (
      <FlatList
        data={characters}
        renderItem={({ item }) => <CharacterCard character={item} />}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={Separator}
        ListEmptyComponent={EmptyList}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter()}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rick and Morty</Text>

      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: 16 },
  title: {
    color: COLORS.primary,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 12,
    marginBottom: 12,
  },
  input: {
    backgroundColor: COLORS.card,
    color: COLORS.text,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  loader: { marginTop: 40 },
  separator: { height: 10 },
  listContent: { paddingBottom: 24 },
  footer: { marginVertical: 16 },
  footerError: { color: COLORS.danger, textAlign: 'center', marginVertical: 16 },
  placeholder: { color: COLORS.textMuted, fontSize: 16, marginTop: 24 },
});
