// **** Переменные ****
const initialCards = [
    {
      name: 'Архыз',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg'
    },
    {
      name: 'Челябинская область',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg'
    },
    {
      name: 'Иваново',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg'
    },
    {
      name: 'Камчатка',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg'
    },
    {
      name: 'Холмогорский район',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg'
    },
    {
      name: 'Байкал',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg'
    },
    {
      name: 'Нургуш',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/khrebet-nurgush.jpg'
    },
    {
      name: 'Тулиновка',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/tulinovka.jpg'
    },
    {
      name: 'Остров Желтухина',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/zheltukhin-island.jpg'
    },
    {
      name: 'Владивосток',
      link: 'https://pictures.s3.yandex.net/frontend-developer/cards-compressed/vladivostok.jpg'
    }
  ];  

//редактирование профиля
const buttonUserEdit = document.querySelector('.user-info__editButton'); //кнопка Edit
const popupUserEdit = document.querySelector('#userInfoEdit'); //попап с формой редактирования Имени/Работы юзера

//добавление карточки
const buttonAddCard = document.querySelector('#newCardButton'); //кнопка -
const popupCardmaker = document.querySelector('#cardmaker'); //попап с формой добавления карточки
const cardList = document.querySelector('.places-list'); //контейнер для хранения всех карточек
const buttonSaveCard =document.querySelector('#saveCardButton'); //кнопка добавить карточки

//формы
const formNewCard = document.forms.newCard;
const placeName =  formNewCard.elements[0];
const placeLink = formNewCard.elements[1];
const placeSubmit = formNewCard.elements[2];
const formUserInfo = document.forms.userInfoEdit;

//попап по нажатию на картинку
const popupIncreaseImage = document.querySelector('#increaseImage');

// **** СЛУШАТЕЛИ ****
//откроем форму добавления карточки при нажатии на кнопку +
buttonAddCard.addEventListener('click', function(){
  popupCardmaker.classList.add('popup_is-opened');  
}); 


//откроем форму редактирования профиля при нажатии на кнопку Edit
buttonUserEdit.addEventListener('click', function(event){
  formUserInfo.userName.value = document.querySelector('.user-info__name').textContent;
  formUserInfo.userJob.value = document.querySelector('.user-info__job').textContent;

  //очистка полей формы от ошибок на случай оставшихся
  document.querySelector(`.popup__input_userName`).classList.remove('popup__invalid');  
  document.querySelector(`.popup__input_userJob`).classList.remove('popup__invalid');  
  document.getElementById(`error-userName`).textContent = '';
  document.getElementById(`error-userJob`).textContent = '';
  
  //// Проверка на заполненность полей формы при открытии формы
  if (formUserInfo.userJob.value && formUserInfo.userName.value) {
    formUserInfo.querySelector('.popup__button').classList.add('activate-button');
    formUserInfo.querySelector('.popup__button').removeAttribute("disabled");
  }
  
  popupUserEdit.classList.add('popup_is-opened');
})

//общий слушатель на документ для настройки работы с карточками - лайк/удаление, увеличенный попап, закрытие попапа
document.addEventListener('click', function(event){
  //закроем любую открытую попап форму, если нажимаем на "крестик"
  if (event.target.classList.contains('popup__close')) {
    event.target.closest('.popup').classList.remove('popup_is-opened');

    // ВОЗМОЖНО ЛИШНЕЕ
    //отдельно случай закрытия попапа с увеличенной картинкой
    if (popupIncreaseImage.classList.contains('place-card__image-popup')){
      popupIncreaseImage.classList.remove('place-card__image-popup');
    }



  }
  //вызовем попап с увеличенной картинкой
  if (event.target.classList.contains('place-card__image')){
    popupimage(event);
  }
  //лайк карточки
  if (event.target.classList.contains('place-card__like-icon')) {
    event.target.classList.toggle('place-card__like-icon_liked');
  }
  //удаление карточки
  if (event.target.classList.contains('place-card__delete-icon')) {
    document.querySelector('.places-list').removeChild(event.target.parentElement.parentElement);    
  }  
})

//слушатель на ввод в форму нового места
formNewCard.addEventListener('input', function(event){
  event.preventDefault();
  handleValidate(event);
})

// добавление карточки при нажатии на submit
formNewCard.addEventListener('submit', function(event){
  event.preventDefault();
  const name = event.currentTarget.elements.placeName.value;
  const link = event.currentTarget.elements.placeLink.value;
  cardMaker(name, link);  
  document.querySelector('#cardmaker').classList.remove('popup_is-opened');  
})

//Форма редактирования инфо о юзере
formUserInfo.addEventListener('input', function(event){  
  event.preventDefault();
  handleValidate(event);
})

//Редактирование инфо о юзере при нажатии на Сохранить
formUserInfo.addEventListener('submit', function(event){
  event.preventDefault();  
  const userName = document.forms.userInfoEdit.userName.value;
  const userJob = document.forms.userInfoEdit.userJob.value;
  renameUser(userName, userJob);
  document.querySelector('#userInfoEdit').classList.remove('popup_is-opened'); 
})

// ***** ФУНКЦИИ *****

function handleValidate(event) {    
  resetError(event.target);
  validate(event.target);
}

function validate(element) {
  const errorElement = document.querySelector(`#error-${element.name}`);
  if ( !(element.parentNode.elements[0].checkValidity()) || !(element.parentNode.elements[1].checkValidity()) ) {    
    // ////пропишем типы сообщений об ошибках в зависимости от формы
    // //форма нового места
    // if (element.parentNode.id === formNewCard.id) { 
    //   if (element.validity.valueMissing) {
    //     errorElement.textContent = 'Это обязательное поле';
    //   } 
    //   if (element.parentNode.elements[0].validity.tooLong || element.parentNode.elements[0].validity.tooShort)
    //     errorElement.textContent = 'Должно быть от 2 до 30 символов';
    //   } 
    //   if (!(element.parentNode.elements[1].validity.patternMismatch)){
    //     errorElement.textContent = 'Здесь должна быть ссылка';
    //   } 
    // } else if (element.parentNode.id === formUserInfo.id) { //форма с редактированием инфо о юзере
      if (element.validity.valueMissing) {
        errorElement.textContent = 'Это обязательное поле';
      } else if (element.validity.tooLong || element.validity.tooShort){
        errorElement.textContent = 'Должно быть от 2 до 30 символов';
      }     
      /*
        Можно лучше: для валидации ссылки можно в html задавать тип полю ввода url
        <input type="url" и проверять валидность поля с помощью атрибута validity.typeMismatch
        Подробнее здасть https://developer.mozilla.org/ru/docs/Learn/HTML/Forms/%D0%92%D0%B0%D0%BB%D0%B8%D0%B4%D0%B0%D1%86%D0%B8%D1%8F_%D1%84%D0%BE%D1%80%D0%BC%D1%8B
      */

        // else if (element.type === 'url' && element.validity.typeMismatch){
        //   errorElement.textContent = 'ссылка';
        // } 
        else {
          errorElement.textContent = element.validationMessage;      
        } 
      
      

    element.parentElement.querySelector('.popup__button').classList.remove('activate-button');    
    element.parentElement.querySelector('.popup__button').setAttribute("disabled", "disabled");
    activateError(errorElement);

  } else if (!(element.parentNode.elements[0].checkValidity())) {
    activateError(errorElement);
  } else if (!(element.parentNode.elements[1].checkValidity())) {
    activateError(errorElement);
  } else {
    element.parentElement.querySelector('.popup__button').classList.add('activate-button');
    element.parentElement.querySelector('.popup__button').removeAttribute("disabled");
  }
}

function activateError(element) {
  element.parentNode.querySelector(`.popup__input_${element.id.slice(6,)}`).classList.add('popup__invalid');
}

function resetError (element) {
  element.parentNode.querySelector(`.popup__input_${element.name}`).classList.remove('popup__invalid');  
  document.getElementById(`error-${element.name}`).textContent = '';
}

//функция создания карточки
function cardMaker(placeName, placeUrl) {
  const cardList = document.querySelector('.places-list')
  const cardItem = document.createElement('div');
  cardItem.className = 'place-card';
  cardList.appendChild(cardItem); //элемент списка карточек (карточка)
  
  const cardImage = document.createElement('div'); //иллюстрация карточки
  cardImage.className = 'place-card__image';
  cardImage.style.backgroundImage = 'url(' + placeUrl + ')';
  cardItem.appendChild(cardImage);
  
  const cardDeleteIcon = document.createElement('button');//кнопка удаления карточки
  cardDeleteIcon.className = 'place-card__delete-icon';
  cardImage.appendChild(cardDeleteIcon);
  
  const cardDescription = document.createElement('div');//описание карточки
  cardDescription.className = 'place-card__description';
  cardItem.appendChild(cardDescription);
  
  const cardName = document.createElement('h3'); //имя карточки
  cardName.className = 'place-card__name';
  cardName.textContent = placeName;
  cardDescription.appendChild(cardName);
  
  const cardLikeIcon = document.createElement('button');//кнопка лайка карточки
  cardLikeIcon.className = 'place-card__like-icon';

  cardDescription.appendChild(cardLikeIcon);//добавляем карточку в конец списка карточек
}

//функция обновления имени/работы пользователя
function renameUser(name, job){
  document.querySelector('.user-info__name').textContent = name;
  document.querySelector('.user-info__job').textContent = job;
}


// функция создания и показа попапа при нажатии на картинку
function popupimage(event) {
  popupIncreaseImage.firstElementChild.style.backgroundImage = event.target.style.backgroundImage;
  popupIncreaseImage.firstElementChild.style.backgroundSize = 'cover';
  popupIncreaseImage.firstElementChild.style.backgroundRepeat = 'no-repeat';  
  popupIncreaseImage.firstElementChild.style.maxWidth = '80vw';
  popupIncreaseImage.firstElementChild.style.maxHeight = '80vh';
  popupIncreaseImage.classList.add('place-card__image-popup');  
  popupIncreaseImage.classList.add('popup_is-opened');

  // popupIncreaseImage.style.backgroundImage = event.target.style.backgroundImage;
  // popupIncreaseImage.style.backgroundSize = 'cover';
  // popupIncreaseImage.style.backgroundRepeat = 'no-repeat';  
  // popupIncreaseImage.style.maxWidth = '80vw';
  // popupIncreaseImage.style.maxHeight = '80vh';
  // popupIncreaseImage.className = 'increaseImage';
  // popupIncreaseImage.classList.add('place-card__image-popup');  
  // popupIncreaseImage.style.marginLeft = 'auto';
  // popupIncreaseImage.style.marginRight = 'auto';

  // const popupIncreaseImage = document.createElement('div');
  // const root = document.querySelector('.root');
  // root.appendChild(popupIncreaseImage);
  // const closeImage = document.createElement('div');
  // closeImage.className = 'popup__close';
  // popupIncreaseImage.appendChild(closeImage);
  // closeImage.src = "./images/close.svg";
  // popupIncreaseImage.className = 'popup';
  // popupIncreaseImage.classList.add('place-card__image-popup'); 
  // popupIncreaseImage.classList.add('popup__content'); 
  // popupIncreaseImage.classList.add('popup_is-opened');  
  // popupIncreaseImage.style.backgroundImage = event.target.style.backgroundImage
}


// **** ВЫЗОВ ФУНКЦИЙ ****
//добавим на страницу стартовый набор карточек с иллюстрациями
for (let i=0; i< initialCards.length; i++) {
  cardMaker(initialCards[i].name, initialCards[i].link)
}

/*
  Хорошая работа, страница выглядит гораздо лучше, а валидация работает правильно
*/











/*
  Замечания с прошлого ревью исправлены, но есть ещё одна проблема, на которую я к сожаленияю
  не указал в прошлый раз: при вводе в поля формы редактирования профиля текста длиннее 30 символов
  ошибки не отображаются, а кнопка не становится неактивной.


  Все ещё есть проблемы с версткой, которые лучше исправить:
  - неправильное расположение кнопки открытия попапа добавления карточки
  - попап с картинкой должен открываться на весь экран по центру


*/


/* Отлично, что код валидации формы переиспользуется

Надо исправить: при открытии попапа редактирования профиля необходимо очищать ошибки

Также есть замечания по верстке:
Перехала кнопка добавления новой карточки, чтобы она встала на место нужно её 
вынести из контейнера user-info__data
  <div class="user-info__data">
    <h1 class="user-info__name">Jaques Causteau</h1>
    <p class="user-info__job">Sailor, Researcher</p>
  </div>
  <button class="user-info__editButton">Edit</button> 

Так же не не центрируется попап с картинкой
Следует задавать max-width: 80vw и max-height: 80vh не попапу, а самому изображению.

*/
















// **** ПРОШЛЫЕ КОММЕНТАРИИ РЕВЬЮЕРОВ ****
// function likeCard(){  
  //   const likeIcon = document.querySelectorAll('.place-card__like-icon');
  //   /*
  //   Можно лучше: можно использовать делегирование - повестить один обработчик на контейнер places-list
  //   и в обработчике проверяя на каком элементе произошел клик выполнять соответствующее действие.
  //   Проверить на каком элементе произошло событие можно с помощью проверки какой класс у event.target
  // */
  //   for (let i=0; i<likeIcon.length; i++) {
  //     likeIcon[i].addEventListener('click', function(){
  //       likeIcon[i].classList.toggle('place-card__like-icon_liked');
  //     });
  //   }
  // }

  // //удаление карточки
  // function deleteCard(){
  //   /* Здесь также можно использовать делегирование */
  //   const removeCard = document.querySelectorAll('.place-card__delete-icon');
  //   for (let i=0; i< removeCard.length; i++) {
  //     removeCard[i].addEventListener('click', function(){
  //       removeCard[i].parentElement.parentElement.parentElement.removeChild(removeCard[i].parentElement.parentElement);
  //     });  
  //   }
  // }

  //event.target.parentElement.parentElement.parentElement.removeChild(event.target.parentElement.parentElement);
  /* Можно лучше: parentElement.parentElement.parentElement - при чтении кода не очень понятно,
    также если в разметке появится дополнительный контейнер обертка такое решение 
    может перестать работать правильно
    Лучше обращаться к places-list через document.querySelector('.places-list')
    или через метод closest event.target.closest('.places-list')
    https://developer.mozilla.org/ru/docs/Web/API/Element/closest */

/*
  Теперь программа работает правильно, хорошая работа!
*/


