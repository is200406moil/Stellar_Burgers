import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import {
  useSelector,
  useDispatch,
  updateUserThunk
} from '../../services/store';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const { user, isLoading, error } = useSelector((state) => state.user);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });
  const [updateError, setUpdateError] = useState<string | undefined>(undefined);

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== (user?.name || '') ||
    formValue.email !== (user?.email || '') ||
    !!formValue.password;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setUpdateError(undefined);
    const dataToSend: { name?: string; email?: string; password?: string } = {};
    if (formValue.name !== user?.name) dataToSend.name = formValue.name;
    if (formValue.email !== user?.email) dataToSend.email = formValue.email;
    if (formValue.password) dataToSend.password = formValue.password;
    if (Object.keys(dataToSend).length === 0) return;
    const result = await dispatch(updateUserThunk(dataToSend));
    if (updateUserThunk.rejected.match(result)) {
      setUpdateError((result.payload as string) || 'Ошибка обновления профиля');
    } else {
      setFormValue((prev) => ({ ...prev, password: '' }));
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
    setUpdateError(undefined);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={updateError || error || undefined}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
