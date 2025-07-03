import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect, useState, useCallback } from 'react';
import { getFeedsApi } from '../../utils/burger-api';

export const Feed: FC = () => {
  const [orders, setOrders] = useState<TOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [totalToday, setTotalToday] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeed = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFeedsApi();
      console.log('FEED DATA:', data); // debug
      setOrders(data.orders);
      setTotal(data.total);
      setTotalToday(data.totalToday);
    } catch (e) {
      setError('Ошибка загрузки ленты заказов');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
    // const interval = setInterval(fetchFeed, 5000); // polling every 5s
    // return () => clearInterval(interval);
  }, [fetchFeed]);

  if (loading) {
    return <Preloader />;
  }
  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={fetchFeed}
      total={total}
      totalToday={totalToday}
    />
  );
};
