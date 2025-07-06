import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch, fetchFeed } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const {
    feed: orders,
    total,
    totalToday,
    isLoading,
    error
  } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }
  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => dispatch(fetchFeed())}
      total={total}
      totalToday={totalToday}
    />
  );
};
