import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import Header from "../../components/Header";
import user from "../../img/main_img/photo_user.png";
import exits from "../../img/main_img/exit.svg";
import hover from "../../img/main_img/hover_exit.svg";
import notImage from "../../img/main_img/no-pictures.png";
import add_photo from '../../img/main_img/add-image.png'
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Return from "../../components/Return";
import { getAds, getNewCommentText, deleteItemAds, uploadImages, setUpdateAds, deleteImageAds } from "../../api";
import { getAllCommets } from "../../api";

export const Myadv = ({ isAuthenticated }) => {
  // REDUX
  const isTokenGlobal = useSelector((state) => state.product.tokenExists);
  const navigate = useNavigate();
  // Получаем id объявления
  const { id } = useParams();
  // Стейт для изменения контента
  const [product, setProduct] = useState({ text: "" });
  // Стейт для открытия модального окна
  const [openModal, setOpenModal] = useState(false);
  // Стейт для открытия модального окна
  const [openModalTwo, setOpenModalTwo] = useState(false);
  // Для закрытия окна при клике вне окна
  const modalRef = useRef();
  // Стейт для отслеживания наведения курсора
  const [isHovered, setIsHovered] = useState(false);
  // Стейт для статичных данных
  const [products, setProducts] = useState([]);
  // Стейт для массива отзывов
  const [comments, setComments] = useState([]);
  // Стейт для хранения даты регистрации
  const [formattedSellsFromDate, setFormattedSellsFromDate] = useState("");
  // Стейт для числа отзывов
  const [totalComments, setTotalComments] = useState("");
  // Стейт для хранения ошибок
  const [error, setError] = useState("");
  // Стейт для хранения окна предупреждения
  const [warningOpenModal, getWarningOpenModal] = useState("");
  // Стейт для хранения фото перед отправкой
  const [photos, setPhotos] = useState([]);
  // Инициализация стейта для хранения удаленных изображений
  const [imagesToDelete, setImagesToDelete] = useState([]);

  // Проверка авторизации
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  // Событие при наведении
  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  // Снятие события при наведении
  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  // Открывает модальное окно
  const openModalClick = () => {
    setOpenModal(true);
  };
  // Открывает второе модальное окно
  const openModalClickTwo = () => {
    setOpenModalTwo(true);
  };
  // Открывает модальное окно предупреждения
  const openModalClickWarning = () => {
    getWarningOpenModal(true);
  }
  // Закрывает модальное окно
  const closeModal = () => {
    setOpenModal(false);
    setIsHovered(false);
    setOpenModalTwo(false);
    getWarningOpenModal(false);
    setImagesToDelete([]);
    getAds(id).then((data) => {
      setProducts([data]);
      const imageObjects = data.images;
      setPhotos(imageObjects);
      const createdDate = new Date(data.created_on);
        const formattedDate = `${createdDate.toLocaleDateString(
          "ru-RU"
        )} ${createdDate.toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        })}`;
        setProducts((prevProducts) => {
          return prevProducts.map((product) => ({
            ...product,
            formattedDate: formattedDate,
          }));
        });
        const formattedSellsDate = formatDate(data.user.sells_from);
        setFormattedSellsFromDate(formattedSellsDate);
    }).catch((error) => {
      // Обработка ошибки получения объявлений
    });
  };
  // Закрывает модальное окно при клике за его пределами
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);
  // Обработка даты
  function formatDate(dateString) {
    const months = [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря",
    ];

    const date = new Date(dateString);
    const day = date.getDate(); // Используем getDate() для получения числа дня месяца
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  }
  // Получение объявления по id
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAds(id);
        if (data.error === "Ad not found") {
          navigate("/404"); 
        } else {
          setProducts([data]);
          const imageObjects = data.images;
          setPhotos(imageObjects);
          const createdDate = new Date(data.created_on);
          const formattedDate = `${createdDate.toLocaleDateString(
            "ru-RU"
          )} ${createdDate.toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
          })}`;
          setProducts((prevProducts) => {
            return prevProducts.map((product) => ({
              ...product,
              formattedDate: formattedDate,
            }));
          });
          const formattedSellsDate = formatDate(data.user.sells_from);
          setFormattedSellsFromDate(formattedSellsDate);
        }
      } catch (error) {
      }
    };

    fetchData();
  }, [id]);
  // Cоздание нового комментария
  const setCommentUser = (id) => {
    const textInput = document.getElementById('comment');
    const text = textInput.value.trim();
    switch (true) {
      case !text:
        textInput.classList.add(styles.price_blink);
          setTimeout(() => {
            textInput.classList.remove(styles.price_blink);
          }, 2000);
          break;
      default:
        setError("");
        getNewCommentText(id, text)
          .then(() => getAllCommets(id))
          .then((comments) => {
            setComments(comments);
            const totalComments = comments.length;
            setTotalComments(totalComments);
            document.getElementById("comment").value = "";
          })
          .catch((error) => {
            setError("Ошибка при получении комментариев");
          });
    }
  };
  // Получение всех комментариев
  useEffect(() => {
    const fetchData = async () => {
      try {
          const data = await getAllCommets(id);
          setComments(data);
          const totalComments = data.length;
          setTotalComments(totalComments);
        } catch (error) {
        }
    };
    
    fetchData();
  }, [id]);
  // Удаление объявления
  const deleteMyAds = async (id) => {
    try {
      await deleteItemAds(id);
      navigate('/profile')
    } catch (error) {
      setError("Ошибка при удалении объявления");
    }
  };
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
  // Удаление фото
  const handleRemovePhoto = (index) => {
    if (photos[index].url.startsWith('data:image')) {
      // Удаляем изображение из массива photos (добавленное с компьютера)
      const newPhotos = photos.filter((_, i) => i !== index);
      setPhotos(newPhotos);
    } else {
      // Добавляем изображение в стейт для удаления
      setImagesToDelete((prevImages) => [...prevImages, photos[index]]);
      const newPhotos = photos.filter((_, i) => i !== index);
      setPhotos(newPhotos);
    }
  };
  // Редактировать объявление
  const handlePublish = async (id) => {
    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const priceInput = document.getElementById('price');
    const price = priceInput.value.trim();
    const filteredPhotos = photos.filter((photo) => photo.url.startsWith('data:image'));
    switch(true) {
      case !price || isNaN(price):
        priceInput.classList.add(styles.price_blink);
          setTimeout(() => {
            priceInput.classList.remove(styles.price_blink);
          }, 2000);
          break;
      default:
        const adData = await setUpdateAds(id, title, description, price);
        const adId = adData.id;
        const result = await uploadImages(adId, filteredPhotos);
        if (imagesToDelete.length > 0) {
          try {
            for (const image of imagesToDelete) {
              await deleteImageAds(id, image.url);
            }
            setImagesToDelete([]);
          } catch (error) {
          }}
          closeModal();
      }
  };

  return (
    <div>
      <Header />
      <div className={styles.conteiners}>
        <Return />
        {products.map((product) => (
          <div key={product.id} className={styles.main}>
            <div className={styles.main__info}>
              <div className={styles.main__info_picture}>
                <div className={styles.main__info_picture_general}>
                  {product.images[0] && product.images[0].url ? (
                    <img
                      className={styles.main__info_bas}
                      src={`http://localhost:8090/${product.images[0].url}`}
                      alt="photo product"
                    />
                  ) : (
                    <img
                      src={notImage}
                      alt="product"
                      className={styles.main__info_bas}
                    />
                  )}
                  <div className={styles.main__info_addition}>
                    {product.images
                      .slice(1)
                      .map((image, index) =>
                        image.url ? (
                          <img
                            key={index}
                            className={styles.addition}
                            src={`http://localhost:8090/${image.url}`}
                            alt={`photo ${index + 2}`}
                          />
                        ) : (
                          <div key={index}>Картинка отсутствует</div>
                        )
                      )}
                  </div>
                </div>
              </div>
              <div className={styles.main__info_text}>
                <div className={styles.main__info_text_product}>
                  <div className={styles.main__h3}>{product.title ? product.title : "Нет названия"}</div>
                  <div className={styles.main__detailed}>
                    <span>{product.formattedDate}</span>
                    <span>{product.user.city}</span>
                    {/* число отзывов */}
                    {totalComments > 0 ? (
                      <div>
                        <span
                          className={styles.main__reviews}
                          onClick={openModalClickTwo}
                        >
                          {`${totalComments} ${
                            totalComments === 1 ? "отзыв" : "отзыва"
                          }`}
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span
                          className={styles.main__reviews}
                          onClick={openModalClickTwo}
                        >
                          Нет отзывов
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.main__info_text_buttons}>
                  <div className={styles.main__h3}>{product.price} ₽</div>
                  <div className={styles.main__product_buttons}>
                    <button
                      className={`${styles.main_button} ${styles.update}`}
                      onClick={openModalClick}
                    >
                      Редактировать
                    </button>
                    <button
                      className={`${styles.main_button} ${styles.delete}`}
                      onClick={() => openModalClickWarning()}
                    >
                      Снять с публикации
                    </button>
                  </div>
                </div>
                <div className={styles.main__info_text_seller}>
                {product.user.avatar ? (
                      <img className={styles.main__container_img} src={`http://localhost:8090/${product.user.avatar}`} alt='photo user'/>
                    ) : (
                      <img className={styles.main__container_img} src={user} alt='photo user'/>
                    )}
                  <div className={styles.main__detailed}>
                    <span style={{ color: "#009EE4", fontWeight: "bold" }}>
                      {product.user.name}
                    </span>
                    <span>Продает товары с {formattedSellsFromDate}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.main__container}>
              <div className={styles.main__h3}>Описание товара</div>
                {product.description ? product.description : "Нет подробной информации"}
            </div>
          </div>
        ))}
      </div>
      {openModalTwo && (
        <div className={styles.modalTwo}>
          <div className={styles.modalContentTwo} ref={modalRef}>
            <form className={styles.modal_formTwo} key={product.id}>
              <span className={styles.modal_form_titleTwo}>Отзывы о товаре</span>
              <div className={styles.modal_form_blockTwo}>
                <span>Добавить отзыв</span>
                <textarea
                  id="comment"
                  className={styles.modal_form_inputTwo}
                  type="text"
                  placeholder="Введите отзыв"
                />
              </div>
              <button
                type="button"
                className={`${styles.main_button} ${styles.save}`}
                disabled={!isTokenGlobal}
                onClick={() => setCommentUser(id)}
              >
                Опубликовать
              </button>
              <div className={styles.modal_form_blockTwo}>
                <div className={styles.modal_form_textareaTwo}>
                  {comments.map((comment) => (
                    <div key={comment.id} className={styles.modal_block}>
                      {comment.author.avatar ? (
                        <img
                          className={styles.main__container_img}
                          src={`http://localhost:8090/${comment.author.avatar}`}
                          alt="photo user"
                        />
                      ) : (
                        <img
                          className={styles.main__container_img}
                          src={user}
                          alt="photo user"
                        />
                      )}
                      <div className={styles.modal_block_infoTwo}>
                        <div className={styles.modal_block_authorTwo}>
                          <span style={{ fontWeight: "bold" }}>
                            {comment.author.name}
                          </span>
                          <span style={{ color: "#5F5F5F" }}>
                            {new Date(comment.created_on).toLocaleDateString()}
                          </span>
                        </div>
                        <div className={styles.modal_block_comentTwo}>
                          <span style={{ fontWeight: "bold" }}>
                            Комментарий
                          </span>
                          <span>{comment.text}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </form>
            <img
              src={isHovered ? hover : exits}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={closeModal}
              className={styles.closeButton}
              alt="exit"
            />
          </div>
        </div>
      )}
      {openModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent} ref={modalRef}>
            {products.map((product) => (
              <form className={styles.modal_form} key={product.id}>
                <span className={styles.modal_form_title}>
                  Редактировать объявление
                </span>
                <div className={styles.modal_form_block}>
                  <span>Название</span>
                  <input
                    id="title"
                    className={styles.modal_form_input}
                    type="text"
                    placeholder="Название продукта"
                    defaultValue={product.title}
                  />
                </div>
                <div className={styles.modal_form_block}>
                  <span>Описание</span>
                  <textarea
                    id="description"
                    className={styles.modal_form_textarea}
                    placeholder="Описание продукта"
                    defaultValue={product.description}
                  />
                </div>
                <div className={styles.modal_form_img}>
                  <span>Фотограции товара</span>
                  <div className={styles.main__info_addition}>
                  {photos.map((photo, index) => (
                        <img key={index} onClick={() => handleRemovePhoto(index, id)} src={photo.url.startsWith('data:image') ? photo.url : `http://localhost:8090/${photo.url}`}  alt={`Photo ${index}`} className={styles.addition}/>
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
                    <input
                      id="price"
                      className={styles.modal_form_price}
                      type="text"
                      placeholder="Цена"
                      defaultValue={product.price} 
                    />
                    <span className={styles.modal_rub}> ₽ </span>             
                  </div>
                </div>
                <button type="button" onClick={() => {handlePublish(id)}} className={`${styles.main_button} ${styles.save}`}>
                  Сохранить
                </button>
              </form>
            ))}
            <img
              src={isHovered ? hover : exits}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={closeModal}
              className={styles.closeButton}
              alt="exit"
            />
          </div>
        </div>
      )}
      {warningOpenModal && (
        <div className={styles.modal__warning}>
          <div className={styles.modalContent__warning} ref={modalRef}>
            <span>Вы действительно хотите снять объявление с публикации?</span>
            <div className={styles.warning__button}>
              <button className={ styles.del} onClick={() => deleteMyAds(id)}>УДАЛИТЬ</button>
              <button className={styles.return} onClick={closeModal}>ОТМЕНА</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
