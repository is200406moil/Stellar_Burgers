import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';
import { FC, useEffect } from 'react';
import {
  useSelector,
  useDispatch,
  fetchUserOrders
} from '../../services/store';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const {
    userOrders: orders,
    isLoading,
    error
  } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return <ProfileOrdersUI orders={orders} />;
};
