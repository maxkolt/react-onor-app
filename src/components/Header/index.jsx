import styles from './styles.module.css';
import { useEffect, useRef, useState } from 'react';
import exits from '../../img/main_img/exit.svg'
import hover from '../../img/main_img/hover_exit.svg'
import logo from '../../img/main_img/logo_modal.svg'
import add_photo from '../../img/main_img/add-image.png'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getNewMyAds, sendAuthenticationToServer, sendRegistrationDataToServer, uploadImages } from '../../api';
import { setTokenExists } from '../../store/actions/creators/productCreators';

const Header = ({ onAddNewAd }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Стейт для открытия модального окна
  const [openModal, setOpenModal] = useState(false);
  // Стейт для модального окна размещения обьявления
  const [openModalTwo, setOpenModalTwo] = useState(false);
  // Стейт для отслеживания наведения курсора
  const [isHovered, setIsHovered] = useState(false);
  // Стейт формы регистрации
  const [isOpenFormRegistration, setIsOpenFormRegistration] = useState(false);
  // Стейт для показа попап при успешной регистрации
  const [openPopup, setOpenPopup] = useState(false)
  // Для закрытия окна при клике вне окна
  const modalRef = useRef();
  // Стейт для хранения ошибок
  const [error, setError] = useState('');
  // REDUX
  const isTokenGlobal = useSelector(state => state.product.tokenExists);
  // Стейт для хранения фото перед отправкой
  const [photos, setPhotos] = useState([]);

  // Открывает модальное окно
  const openModalClick = () => {
    setOpenModal(true);
  }
  // Открывает модальное окно размещения обьявления
  const openModalClickTwo = () => {
    setOpenModalTwo(true);
  }
  // Закрывает модальное окно
  const closeModal = () => {
    setOpenModal(false);
    setOpenModalTwo(false);
    setIsHovered(false);
    setIsOpenFormRegistration(false);
    setError('');
    setOpenPopup(false);
    setPhotos([]);
  }
  // Событие при наведении
  const handleMouseEnter = () => {
    setIsHovered(true);
  }
  // Снятие события при наведении
  const handleMouseLeave = () => {
    setIsHovered(false);
  }
  // Показ формы регистрации
  const hendleClickOpenFormReg = () => {
    setError(''); 
    if (isOpenFormRegistration) {
      handleRegisterUser();
    } else {
      setIsOpenFormRegistration(true);
    }
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
  // Регистрация
  const handleRegisterUser = () => {
    const role = 'user';
    const email = document.getElementById('email').value.trim();
    const newPassword = document.getElementById('password').value;
    const repeatPassword = document.getElementById('repeatPassword').value;
    const name = document.getElementById('name').value.trim();
    const surname = document.getElementById('surname').value.trim();
    const phone = document.getElementById('phone').value.trim(); 
    const city = document.getElementById('city').value.trim();
    const emailFormat = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const phonePattern = /^\d+$/;
    switch (true) {
      case !email:
        setError('Введите email');
        break;
      case !email.match(emailFormat):
        setError('Введите корректный email');
        break;
      case newPassword !== repeatPassword:
        setError('Пароли не совпадают!');
        break;
      case !newPassword || !repeatPassword:
        setError('Введите пароли!');
        break;
      case !name:
        setError('Введите имя');
        break;
      case phone.match(phonePattern):
        setError('Введите корректный номер телефона!');
        break;
      default:
        setError('');
        const responce = async () => {
          try {
            const serverResponse = await sendRegistrationDataToServer({
              password: newPassword,
              role,
              email,
              name,
              surname,
              phone,
              city,
            });
            setError(''); 
            setIsOpenFormRegistration(false);
            setOpenPopup(true);
          } catch (error) {
            setError(error.message);
          }
        };
        responce();
    }
  };
  // Авторизация
  const handleAuthorizUser = ()=> {
    const email = document.getElementById('email').value.trim();
    const newPassword = document.getElementById('password').value.trim();
    switch(true) {
      case !email:
        setError('Введите email');
        break;
      case !newPassword:
        setError('Введите пароль');
        break;
      default:
        setError('');
        const getToken = async () => {
          try {
            const serverResponse = await sendAuthenticationToServer({
              password: newPassword,
              email,
            });
  
            if (serverResponse.access_token && serverResponse.refresh_token) {
              localStorage.setItem('accessToken', serverResponse.access_token);
              localStorage.setItem('refreshToken', serverResponse.refresh_token);
              dispatch(setTokenExists(true));
              closeModal();
            } else {
              setError('Ошибка при регистрации');
              dispatch(setTokenExists(false));
            }
          } catch (error) {
            console.log(error)
            setError(error.message);
          }
          
        };
        getToken();
    }
  }
  // Выйти
  const LogOutYourAccount = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    dispatch(setTokenExists(false))
  }
  // Обработка состояния картинок
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    
    // Проверка на тип файла, например, можно ограничить только изображениями
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        const newPhoto = {
          url: reader.result,
          file: file,
        };
        setPhotos([...photos, newPhoto]);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Пожалуйста, выберите изображение.');
    }
  };
  // Новое объявление
  const handlePublish = async () => {
    const titleInput = document.getElementById('title');
    const title = titleInput.value.trim();
    const description = document.getElementById('description').value.trim();
    const priceInput = document.getElementById('price');
    const price = priceInput.value.trim();
    switch(true) {
      case !title:
        titleInput.classList.add(styles.price_blink);
          setTimeout(() => {
            titleInput.classList.remove(styles.price_blink);
          }, 2000);
          break;
      case !price || isNaN(price):
        priceInput.classList.add(styles.price_blink);
          setTimeout(() => {
            priceInput.classList.remove(styles.price_blink);
          }, 2000);
          break;
      
      default:
        const adData = await getNewMyAds(title, description, price);
        const adId = adData.id;
        const result = await uploadImages(adId, photos);
        if (onAddNewAd) {
          onAddNewAd();
          closeModal();
        }
        closeModal();
    } 
  };

// Удаление фото
const handleRemovePhoto = (index) => {
  const newPhotos = photos.filter((_, i) => i !== index);
  setPhotos(newPhotos);

  // Очистка значения поля ввода типа "file"
  const fileInputs = document.querySelectorAll('input[type="file"]');
  if (fileInputs[index]) {
    fileInputs[index].value = ''; // Очищаем значение поля ввода
  }
};

  return (
    <div className={styles.wrapper}>
      <div className={styles.main_head}>
      {isTokenGlobal ? (
          <div className={styles.main_buttons}>
            <button className={styles.main_button} onClick={openModalClickTwo}>Разместить объявление</button>
            <button className={styles.main_button} onClick={() => navigate('/profile')}>Личный кабинет</button>
            <button className={styles.main_button_exit} onClick={LogOutYourAccount}>Выйти</button>
          </div>
        ) : (
          <button className={styles.main_button} onClick={openModalClick}>Вход в личный кабинет</button>
        )}
      </div>
      {openModal && (
        <div className={styles.modal} >
          <div className={styles.main_err_plase}>
            {openPopup && (
              <div className={styles.main_done}>
                <div className={styles.main_done_massage }>Вы прошли регистрацию, пожалуйста войдите с систему!</div>
              </div>
            )} 
          </div>
          <div className={styles.modalContent} ref={modalRef}>
            <form className={styles.modal_form}>
              <img src={logo} alt='logo'/>
              <input className={styles.modal_form_input} id='email' type='text' placeholder='email'></input>
              <input className={styles.modal_form_input} id='password' type='password' placeholder='Пароль'></input>
              {isOpenFormRegistration && (
                <div className={styles.modal_form}>
                  <input className={styles.modal_form_input} id='repeatPassword' type='password' placeholder='Повторите пароль'></input>
                  <input className={styles.modal_form_input} id='name' type='text' placeholder='Имя'></input>
                  <input className={styles.modal_form_input} id='surname' type='text' placeholder='Фамилия (необязательно)'></input>
                  <input className={styles.modal_form_input} id='phone' type='text' placeholder='Номер (необязательно)'></input>
                  <input className={styles.modal_form_input} id='city' type='text' placeholder='Город (необязательно)'></input>
                </div>
              )}
              <div className={styles.modal_form_button}>
              {isOpenFormRegistration === false && (
                <button type="button" className={styles.modal_button} onClick={handleAuthorizUser}>Войти</button>
              )}
              <button
                type="button"
                className={isOpenFormRegistration ? styles.modal_button : styles.modal_button_two} 
                onClick={hendleClickOpenFormReg}
              >
              Зарегистрироваться
              </button>
              </div>
            </form>
            
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
      
      {openModalTwo && (
                <div className={styles.modal_two}>
                <div className={styles.modalContent_two} ref={modalRef}>
 
                    <form className={styles.modal_form_two}>
                      <span className={styles.modal_form_title}>Новое объявление</span>
                      <div className={styles.modal_form_block}>
                        <span>Название</span>
                        <input className={styles.modal_form_input_two} id='title' type='text' placeholder='Название продукта' />
                      </div>
                      <div className={styles.modal_form_block}>
                        <span>Описание</span>
                        <textarea 
                          id='description'
                          className={styles.modal_form_textarea} 
                          placeholder='Описание продукта' 
                        />
                      </div>
                      <div className={styles.modal_form_img}>
                        <span>Фотографии товара</span>
                        <div className={styles.main__info_addition}>

                        {photos.map((photo, index) => (
                          <div className={styles.deleteImg} key={index}>
                            <img title='Кликните, чтобы удалить фото' src={photo.url} alt={`Photo ${index}`} className={styles.addition}/>
                            <button className={styles.but_deleteImg}  onClick={() => handleRemovePhoto(index)}>УДАЛИТЬ</button>
                          </div>
                        ))}
                        {[...Array(Math.max(0, 5 - photos.length))].map((_, index) => (
                        <div key={index}>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageUpload} 
                            style={{ display: 'none' }}
                          />
                          <label>
                            <img 
                              src={add_photo} 
                              alt="Добавить фото" 
                              onClick={() => document.querySelectorAll('input[type="file"]')[index].click()} 
                              className={styles.addition}
                            />
                          </label>
                        </div>
                      ))}
                    </div>
                      </div>
                      <div className={styles.modal_form_block}>
                        <span>Цена</span>
                        <div>
                          <input id='price' className={styles.modal_form_price} type='text' placeholder='Цена'/>
                          <span className={styles.modal_rub}> ₽ </span>
                        </div>
                      </div>
                      <button type='button' onClick={handlePublish} className={`${styles.main_button} ${styles.save}`} disabled={!isTokenGlobal}>
                      Опубликовать
                    </button>
                    </form>
                  <img
                    src={isHovered ? hover : exits}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={closeModal}
                    className={styles.closeButton}
                    alt='exit'
                  />
                </div>
              </div>
      )}
    </div>
  );
}

export default Header;
