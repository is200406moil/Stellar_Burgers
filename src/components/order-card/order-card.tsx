import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';

import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';

const maxIngredients = 6;

export const OrderCard: FC<OrderCardProps & { to?: string; state?: any }> =
  memo(({ order, to, state }) => {
    const location = useLocation();
    const ingredients = useSelector((state) => state.ingredients.items);

    const orderInfo = useMemo(() => {
      if (!ingredients.length) return null;

      const ingredientsInfo = order.ingredients.reduce(
        (acc: TIngredient[], item: string) => {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) return [...acc, ingredient];
          return acc;
        },
        []
      );

      const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);

      const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);

      const remains =
        ingredientsInfo.length > maxIngredients
          ? ingredientsInfo.length - maxIngredients
          : 0;

      const date = new Date(order.createdAt);
      return {
        ...order,
        ingredientsInfo,
        ingredientsToShow,
        remains,
        total,
        date
      };
    }, [order, ingredients]);

    if (!orderInfo) return null;

    return (
      <OrderCardUI
        orderInfo={orderInfo}
        maxIngredients={maxIngredients}
        locationState={{ background: state?.backgroundLocation ?? location }}
        to={to}
        state={state}
      />
    );
  });
