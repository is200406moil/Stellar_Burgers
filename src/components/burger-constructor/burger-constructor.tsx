import { FC, useMemo, SyntheticEvent, useState } from 'react';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch, orderBurgerThunk } from '../../services/store';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const { bun, ingredients } = useSelector((state) => state.burgerConstructor);
  const isAuth = useSelector((state) => state.user.isAuth);
  const navigate = useNavigate();

  const [orderRequest, setOrderRequest] = useState(false);
  const [orderModalData, setOrderModalData] = useState<TOrder | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  const onOrderClick = async (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (!bun || orderRequest) return;
    if (!isAuth) {
      navigate('/login');
      return;
    }
    setOrderRequest(true);
    setOrderError(null);
    const ingredientIds = [bun._id, ...ingredients.map((item) => item._id), bun._id];
    const result = await dispatch(orderBurgerThunk(ingredientIds));
    setOrderRequest(false);
    if (orderBurgerThunk.fulfilled.match(result)) {
      setOrderModalData({
        _id: '',
        status: '',
        name: '',
        createdAt: '',
        updatedAt: '',
        number: result.payload.order.number,
        ingredients: []
      });
    } else {
      setOrderError(result.payload as string || 'Ошибка оформления заказа');
    }
  };

  const closeOrderModal = () => setOrderModalData(null);

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce((s: number, v: TConstructorIngredient) => s + v.price, 0),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
      orderError={orderError}
    />
  );
};
