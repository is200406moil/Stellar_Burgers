import { FC, memo } from 'react';

import styles from './feed.module.css';

import { FeedUIProps } from './type';
import { OrdersList, FeedInfo } from '@components';
import { RefreshButton } from '@zlden/react-developer-burger-ui-components';
import { TOrder } from '@utils-types';

export const FeedUI: FC<FeedUIProps> = memo(({ orders, handleGetFeeds, total, totalToday }) => {
  const readyOrders = orders.filter((o) => o.status === 'done').map((o) => o.number).slice(0, 20);
  const pendingOrders = orders.filter((o) => o.status === 'pending').map((o) => o.number).slice(0, 20);
  return (
    <main className={styles.containerMain}>
      <div className={`${styles.titleBox} mt-10 mb-5`}>
        <h1 className={`${styles.title} text text_type_main-large`}>
          Лента заказов
        </h1>
        <RefreshButton
          text='Обновить'
          onClick={handleGetFeeds}
          extraClass={'ml-30'}
        />
      </div>
      <div className={styles.main}>
        <div className={styles.columnOrders}>
          <OrdersList orders={orders} basePath='/feed' />
        </div>
        <div className={styles.columnInfo}>
          <FeedInfo feed={{ total, totalToday }} readyOrders={readyOrders} pendingOrders={pendingOrders} />
        </div>
      </div>
    </main>
  );
});
