import { useState, useCallback } from 'react';

export const usePaginatedList = (fullData, { initialCount = 30, pageSize = 10 } = {}) => {
  const [displayCount, setDisplayCount] = useState(initialCount);

  const displayedData = fullData.slice(0, displayCount);
  const hasMore = displayCount < fullData.length;

  const loadMore = useCallback(() => {
    if (hasMore) {
      setDisplayCount(prev => Math.min(prev + pageSize, fullData.length));
    }
  }, [hasMore, fullData.length, pageSize]);

  const reset = useCallback(() => setDisplayCount(initialCount), [initialCount]);

  return { data: displayedData, hasMore, loadMore, reset };
};
