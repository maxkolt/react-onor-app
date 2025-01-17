// Хост
const host = "http://localhost:8090/";

// PUT
// Обновление токена
export const refreshAccessToken = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await fetch(`${host}auth/login`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_token: accessToken,
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error("Ошибка при обновлении токена");
    }

    const data = await response.json();
    if (data.access_token && data.refresh_token) {
      localStorage.setItem("accessToken", data.access_token);
      localStorage.setItem("refreshToken", data.refresh_token);
      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      };
    } else {
      throw new Error("Токен не был получен после обновления");
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return; 
    } else {
      throw error;
    }
  }
};
// Обновление пароля
export const setNewPassUser = async (password_1, password_2) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(`${host}user/password`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password_1: password_1,
        password_2:password_2,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else if (response.status === 401) {
      await refreshAccessToken();
      return await setNewPassUser(password_1, password_2);
    } else if (response.status === 400) {
      throw new Error("Вы ввели неверный пароль");
    } else if (response.status === 422) {
      throw new Error("Данные неверного формата");
    } else {
      throw new Error("Ошибка при отправке данных на сервер");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

// GET
// Все объявления
export const getAllAds = async () => {
  try {
    const response = await fetch(`${host}ads`, {
      method: "GET",
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Failed to fetch data");
    }
  } catch (error) {
    throw error;
  }
};
// Объявление по id
export const getAds = async (id) => {
  try {
    const response = await fetch(`${host}ads/${id}`, {
      method: "GET",
    });
    if (response.status === 404) {
      return { error: "Ad not found" }; // Возвращаем объект с сообщением об ошибке
    }
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Failed to fetch data");
    }
  } catch (error) {
    throw error;
  }
};
// Все комментарии к объявлению
export const getAllCommets = async (id) => {
  try {
    const response = await fetch(`${host}ads/${id}/comments`, {
      method: "GET",
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Failed to fetch data");
    }
  } catch (error) {
    throw error;
  }
};
// Текущий юзер
export const getMyProfile = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(`${host}user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (response.ok) {
      return await response.json();
    } else if (response.status === 401) {
      await refreshAccessToken();
      return await getMyProfile();
    } else {
      throw new Error("Failed to fetch data");
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return; 
    } else {
      throw error;
    }
  }
};

// POST
// Регистрация пользователя
export const sendRegistrationDataToServer = async ({
  password,
  role,
  email,
  name,
  surname,
  phone,
  city,
}) => {
  try {
    const response = await fetch(`${host}auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: password,
        role: role,
        email: email,
        name: name,
        surname: surname,
        phone: phone,
        city: city,
      }),
    });

    if (response.status === 201) {
      const data = await response.json();
      return data;
    } else if (response.status === 400) {
      throw new Error("Данный email уже существует");
    } else if (response.status === 422) {
      throw new Error("Данные неверного формата");
    } else {
      throw new Error("Ошибка при отправке данных на сервер");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};
// Аутентификация пользователя
export const sendAuthenticationToServer = async ({ password, email }) => {
  try {
    const response = await fetch(`${host}auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: password,
        email: email,
      }),
    });

    if (response.status === 401) {
      const errorData = await response.json();
      if (errorData.detail === "Incorrect password") {
        throw new Error("Неверный пароль");
      } else if (errorData.detail === "Incorrect email") {
        throw new Error("Неверный email");
      }
    }

    if (!response.ok) {
      throw new Error("Ошибка при отправке данных на сервер");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};
// Отправка комментария
export const getNewCommentText = async (id, text) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(`${host}ads/${id}/comments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else if (response.status === 401) {
      await refreshAccessToken();
      return await getNewCommentText(id, text);
    } else {
      throw new Error("Ошибка при отправке данных на сервер");
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return; 
    } else {
      throw error;
    }
  }
};
// Загрузка аватара пользователя
export const uploadUserPhoto = async (formData) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    // Установка правильного Content-Type c указанием границы
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${accessToken}`);

    const response = await fetch(`${host}user/avatar`, {
      method: "POST",
      headers: headers,
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
    } else if (response.status === 401) {
      await refreshAccessToken();
      return await uploadUserPhoto(formData);
    } else {
      throw new Error("Failed to fetch data");
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return; 
    } else {
      throw error;
    }
  }
};
// Отправка обвления без фото
export const getNewAdWithoutPhotos = async ({title, description, price}) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const priceValue = parseInt(price);
    const response = await fetch(`${host}adstext`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        title: String(title),  // Преобразуем явно в строку
        description: String(description),  // Преобразуем явно в строку
        price: priceValue,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else if (response.status === 401) {
      await refreshAccessToken();
      return await getNewAdWithoutPhotos(title, description, price);
    } else {
      throw new Error("Ошибка при отправке данных на сервер");
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return; 
    } else {
      throw error;
    }
  }
};
// Отправка нового объявления
export const getNewMyAds = async (title, description, price ) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const url = `${host}ads?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&price=${encodeURIComponent(price)}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else if (response.status === 401) {
      await refreshAccessToken();
      return await getNewMyAds(title, description, price );
    } else {
      throw new Error("Ошибка при отправке данных на сервер");
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return; 
    } else {
      throw error;
    }
  }
};
// Функция для отправки изображений на сервер
export const uploadImages = async (adId, photos) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const promises = photos.map(async (photo, index) => {
      const formData = new FormData();
      formData.append('file', photo.file);
      const response = await fetch(`${host}ads/${adId}/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error(`Ошибка при отправке изображения ${index + 1} на сервер`);
      }
    });

    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return; 
    } else {
      throw error;
    }
  }
};

// PATCH
// Данные текущего юзера
export const setUpdateUser = async ({
  role,
  email,
  name,
  surname,
  phone,
  city,
}) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(`${host}user`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: role,
        email: email,
        name: name,
        surname: surname,
        phone: phone,
        city: city,
      }),
    });

    if (response.ok) {
      return await response.json();
    } else if (response.status === 401) {
      await refreshAccessToken();
      return await setUpdateUser({ role, email, name, surname, phone, city });
    } else {
      throw new Error("Failed to update user data");
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return; 
    } else {
      throw error;
    }
  }
};
// Обновление объявления (текстовая часть)
export const setUpdateAds = async ( id, title, description, price ) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(`${host}ads/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        description: description,
        price: price,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else if (response.status === 401) {
      await refreshAccessToken();
      return await setUpdateAds( id, title, description, price );
    } else {
      throw new Error("Ошибка при отправке данных на сервер");
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return; 
    } else {
      throw error;
    }
  }
};

// DELETE
// Удаление объявления
export const deleteItemAds = async (id) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await fetch(`${host}ads/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else if (response.status === 401) {
      await refreshAccessToken();
      return await deleteItemAds(id);
    } else {
      throw new Error("Ошибка при отправке данных на сервер");
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return; 
    } else {
      throw error;
    }
  }
};
// Удаление картинки из объявления
export const deleteImageAds = async ( id, fileUrl ) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const url = `${host}ads/${id}/image?file_url=${encodeURIComponent(fileUrl)}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else if (response.status === 401) {
      await refreshAccessToken();
      return await deleteImageAds( id, fileUrl );
    } else {
      throw new Error("Ошибка при отправке данных на сервер");
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return; 
    } else {
      throw error;
    }
  }
};
