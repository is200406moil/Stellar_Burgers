import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { OrdersListProps } from './type';
import { OrdersListUI } from '@ui';

export const OrdersList: FC<OrdersListProps & { basePath?: string }> = memo(
  ({ orders, basePath }) => {
    const orderByDate = [...orders].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const location = useLocation();
    return (
      <OrdersListUI
        orderByDate={orderByDate}
        basePath={basePath}
        location={location}
      />
    );
  }
);
