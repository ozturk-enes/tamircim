import React, { ReactElement } from 'react';
import { FlatList, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

interface MechanicCardListProps<T> {
  data: T[];
  renderItem: ({ item }: { item: T }) => ReactElement;
}

export default function MechanicCardList<T>({ data, renderItem }: MechanicCardListProps<T>) {
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item: any) => String(item.id)}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
    gap: 12,
  },
});
