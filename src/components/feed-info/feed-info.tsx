import { FC } from 'react';
import { FeedInfoUI } from '../ui/feed-info';
import { FeedInfoUIProps } from '../ui/feed-info/type';
import React from 'react';

import { TOrder } from '@utils-types';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: React.FC<FeedInfoUIProps> = (props) => (
  <FeedInfoUI {...props} />
);
