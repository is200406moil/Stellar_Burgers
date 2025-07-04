import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { NavLink, useMatch } from 'react-router-dom';
import { useSelector } from '../../../services/store';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  // Вызови хуки отдельно!
  const matchProfile = useMatch('/profile');
  const matchProfileOrders = useMatch('/profile/orders');
  const matchProfileOrderNumber = useMatch('/profile/orders/:number');
  const isProfileActive = !!(
    matchProfile ||
    matchProfileOrders ||
    matchProfileOrderNumber
  );

  const isAuth = useSelector((state) => state.user.isAuth);

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to='/'
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
            end
          >
            <BurgerIcon type='primary' />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </NavLink>
          <NavLink
            to='/feed'
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
          >
            <ListIcon type='primary' />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </NavLink>
        </div>
        <div className={styles.logo}>
          <Logo className='' />
        </div>
        <div className={styles.link_position_last}>
          <NavLink
            to={isAuth ? '/profile' : '/login'}
            className={() =>
              `${styles.link} ${isProfileActive ? styles.link_active : ''}`
            }
          >
            <ProfileIcon type='primary' />
            <p className='text text_type_main-default ml-2'>
              {userName || 'Личный кабинет'}
            </p>
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
