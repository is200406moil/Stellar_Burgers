import { FC, useMemo, SyntheticEvent } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { orderBurgerThunk, clearCurrentOrder } from '../../services/store';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const { bun, ingredients } = useSelector((state) => state.burgerConstructor);
  const { currentOrder, isLoading, error } = useSelector((state) => state.orders);
  const isAuth = useSelector((state) => state.user.isAuth);
  const navigate = useNavigate();

  const onOrderClick = async (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (!bun || isLoading) return;
    if (!isAuth) {
      navigate('/login');
      return;
    }
    
    const ingredientIds = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];
    
    await dispatch(orderBurgerThunk(ingredientIds));
  };

  const closeOrderModal = () => {
    dispatch(clearCurrentOrder());
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={isLoading}
      constructorItems={{ bun, ingredients }}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
      orderModalData={currentOrder ? {
        _id: '',
        status: '',
        name: '',
        createdAt: '',
        updatedAt: '',
        number: currentOrder.number,
        ingredients: []
      } : null}
      orderError={error}
    />
  );
};
