import React from 'react';
import { ScrollView, View, ActivityIndicator } from 'react-native';
import { spacing } from '../theme';
import { useTheme } from '../ThemeContext';

export const PaginatedScrollView = ({ hasMore, onLoadMore, children, ...scrollViewProps }) => {
  const { colors } = useTheme();

  const handleScroll = (event) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    if (contentOffset.y + layoutMeasurement.height >= contentSize.height - 50) {
      onLoadMore?.();
    }
    scrollViewProps.onScroll?.(event);
  };

  return (
    <ScrollView
      {...scrollViewProps}
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
      {children}
      {hasMore && (
        <View style={{ alignItems: 'center', paddingVertical: spacing.md }}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}
    </ScrollView>
  );
};
