import { useEffect, useState, useRef } from 'react';
import styles from './styles.module.css';
import Header from '../../components/Header';
import Return from '../../components/Return';
import ProductCard from '../../components/ProductCard';
import user from '../../img/main_img/photo_user.png';
import exits from '../../img/main_img/exit.svg'
import hover from '../../img/main_img/hover_exit.svg'
import { useNavigate } from 'react-router-dom';
import { getAllAds, getMyProfile, setNewPassUser, setUpdateUser, uploadUserPhoto } from '../../api';

export const Myprofile = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  // Хранение массива продуктов
  const [products, setProducts] = useState([]);
  // Хранение юзера
  const [users, setUsers] = useState([]);
  // Хранение юзера
  const [tempName, setTempName] = useState('');
  // Стейт для хранения ошибок
  const [error, setError] = useState('');
  // Стейт для окна смены пароля
  const [ newPassword, setNewPassword] = useState(false);
  // Для закрытия окна при клике вне окна
  const modalRef = useRef();
  // Стейт для отслеживания наведения курсора
  const [isHovered, setIsHovered] = useState(false);
  // Уведомление об обновлении пароля
  const [isPassSave, setIsPassSave] = useState(false);

  // Уведомление об обновлении пароля
  const passSaveOk = () => {
    setIsPassSave(true);
    setTimeout(function() {
      setIsPassSave(false);
    }, 10000);
  }
  // Проверка авторизации
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  // Получение токена и получение данных на странице профиля получение объявлений по id
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError('');
        // Получение токена + получение профиля юзера
        const userProfile = await getMyProfile();
        setUsers(userProfile);
        setTempName(userProfile.name)
        // Получение всех объявлений
        const allAdsData = await getAllAds();
        const filteredProducts = allAdsData.filter(product => product.user.id === Number(userProfile.id));
        setProducts(filteredProducts);
      } catch (error) {
        setError('Произошла ошибка: ' + error.message);
      }
    };
  
    fetchData();
  }, []);
  // Обновление данных юзера
  const updateUserInfo = () => {
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const role = 'user';
    const email = users.email;
    const name = document.getElementById('name').value.trim();
    const surname = document.getElementById('surname').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const city = document.getElementById('city').value.trim();
    switch(true) {
      case !name:
        nameInput.classList.add(styles.price_blink);
          setTimeout(() => {
            nameInput.classList.remove(styles.price_blink);
          }, 2000);
          break;
      case isNaN(phone):
        phoneInput.classList.add(styles.price_blink);
          setTimeout(() => {
            phoneInput.classList.remove(styles.price_blink);
          }, 2000);
          break;
      default:
        setError('');
        nameInput.style.borderColor = '';
        phoneInput.style.borderColor = '';
        setUpdateUser({ role, email, name, surname, phone, city })
        .then(() => {
          return getMyProfile();
        })
        .then((updatedProfile) => {
          setUsers(updatedProfile);
          setTempName(updatedProfile.name)
        })
          .catch((error) => {
            setError('Произошла ошибка: ' + error.message);
          });
    }
  };
  // Закрывает модальное окно
  const closeModal = () => {
    setNewPassword(false);
    setIsHovered(false);
    setError('');
  }
  // Событие при наведении
  const handleMouseEnter = () => {
    setIsHovered(true);
  }
  // Снятие события при наведении
  const handleMouseLeave = () => {
    setIsHovered(false);
  }
  // Закрывает модальное окно при клике за его пределами
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [modalRef]);
  // Обновление фото юзера
  const updatePhotoUser = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      await uploadUserPhoto(formData);
      // После успешной загрузки изображения, обновляем информацию о профиле
      const userProfile = await getMyProfile();
      setUsers(userProfile);
    }
  };
  // Функция для обновления страницы после добавления нового объявления
  const fetchAndUpdateProducts = async () => {
    try {
      const userProfile = await getMyProfile();
      setUsers(userProfile);
      // Получение всех объявлений
      const allAdsData = await getAllAds();
      const filteredProducts = allAdsData.filter(product => product.user.id === Number(userProfile.id));
      setProducts(filteredProducts);
    } catch (error) {
      setError('Произошла ошибка: ' + error.message);
    }
  };
  // Окно для смены пароля
  const clickWindowNewPassword = () => {
    setNewPassword(true);
  }
  // Сохранение нового пароля
  const saveNewPasswordClick = () => {
    const password_1 = document.getElementById('password').value;
    const password_2 = document.getElementById('newpassword').value;
    const passwordRegex = /^[a-zA-Z0-9.]+$/;
  
    switch(true) {
      case !password_1 || !password_2:
        setError('Заполните все поля!');
        break;
      case !passwordRegex.test(password_1):
        setError('Старый пароль содержит недопустимые символы!');
        break;
      case !passwordRegex.test(password_2):
        setError('Новый пароль содержит недопустимые символы!');
        break;
      default:
        setError('');
        setNewPassUser(password_1, password_2)
        .then(() => {
          closeModal();
          passSaveOk();
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  }
// Обработчик изменения имени
const handleNameChange = (e) => {
  setTempName(e.target.value); // Обновляем временное имя при вводе
};
    return (
      <div>
     <Header onAddNewAd={fetchAndUpdateProducts} />
      <div className={styles.conteiners}>
        <Return />
          <div key={users.id} className={styles.main__container}>
          <div className={styles.main__h2}>Здравствуйте, {users.name}!</div>
          <span className={styles.main__h3}>Настройка профиля</span>
          <div className={styles.main__container_profile}>
                    <div className={styles.main__container_profile_img}>
                    {users.avatar ? (
                      <img className={styles.main__container_img} src={`http://localhost:8090/${users.avatar}`} alt='photo user'/>
                    ) : (
                      <img className={styles.main__container_img} src={user} alt='photo user'/>
                    )}
                    <label htmlFor="fileInput" className={styles.customFileInput}>
                      Заменить
                    </label>
                    <input type="file" id="fileInput" accept="image/*" onChange={updatePhotoUser} className={styles.inputFile} />
                    </div>
                    <div className={styles.main__container_user}>
                      <div className={styles.main__container_info_user}>
                        <div className={styles.main__container_name}>
                          <span>Имя</span>
                          <input 
                            id='name'
                            value={tempName}
                            className={styles.main__name_input}
                            onChange={handleNameChange}
                          />
                        </div>
                        <div className={styles.main__container_name}>
                          <span>Фамилия</span>
                          <input 
                            id='surname'
                            value={users.surname} 
                            className={styles.main__name_input} 
                            onChange={(e) => setUsers({...users, surname: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className={styles.main__container_name}>
                        <span>Город</span>
                        <input 
                            id='city'
                            value={users.city}
                            className={styles.main__name_input}
                            onChange={(e) => setUsers({...users, city: e.target.value})}
                          />
                      </div>
                      <div className={styles.main__container_name}>
                        <span>Телефон</span>
                        <input 
                            id='phone'
                            value={users.phone}
                            className={styles.main__name_tel}
                            onChange={(e) => setUsers({...users, phone: e.target.value})}
                          />
                      </div>
                      <div className={styles.main__profile_pass}>
                        <button type='button' onClick={updateUserInfo} className={styles.main_block_search_button}>Сохранить</button>
                        <button type='button' onClick={clickWindowNewPassword} className={styles.main_block_pass_button}>Смена пароля</button>
                        {isPassSave && (
                          <span className={styles.main_block_newpass}>ОБНОВЛЕНО</span>
                        )}
                      </div>
                    </div>
                  </div>
          </div>
          <div className={styles.main__container}>
            <div className={styles.main__h3}>Мои товары</div>
            <div className={styles.main__content}>
            {products.map(filteredProduct => (
              <ProductCard key={filteredProduct.id} product={filteredProduct} sellerId={users.id} editLink={`/profile/${filteredProduct.id}`} />
            ))}
            </div>
          </div>
      </div>
      {newPassword && (
        <div className={styles.modal}>
          <div className={styles.modalContent} ref={modalRef}>
              <div className={styles.modal_form}>
              <span className={styles.modal_form_title}>Смена пароля</span>
                <div className={styles.modal_form_block}>
                  <span>Старый пароль</span>
                  <input id='password' type='password' className={styles.modal_form_input} placeholder='Введите старый пароль'/>
                </div>
                <div className={styles.modal_form_block}>
                  <span>Новый пароль</span>
                  <input id='newpassword' type='password' className={styles.modal_form_input} placeholder='Введите новый пароль'/>
                </div>
                <div className={styles.warning__button}>
                  <button className={ styles.del} type='button' onClick={() => saveNewPasswordClick()}>ИЗМЕНИТЬ</button>
                  <button className={styles.return} onClick={closeModal}>ОТМЕНА</button>
                </div>
              </div>
          <img
              src={isHovered ? hover : exits}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={closeModal}
              className={styles.closeButton}
              alt='exit'
            />
          </div>
          <div className={styles.main_err_plase}>
            {/* Отображение ошибки */}
            {error && (
              <div className={styles.main_err}>
                <div className={styles.main_err_massage}>{error}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    )
  }
  