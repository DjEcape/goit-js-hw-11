import Notiflix from 'notiflix';
import PictureApi from '../src/js/pictureApi.js';
import Lodash from 'lodash.debounce';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const DEBOUNCE_DELAY = 300;

const refs = {
  formEl: document.querySelector('.search-form'),
  galleryBlockEl: document.querySelector('.gallery'),
  loadMoreBtnEl: document.querySelector('.load-more'),
  loadBtnContainerEl: document.querySelector('.button-container'),
};

const pixabayApi = new PictureApi();
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
  close: false,
  showCounter: false,
  animationSpeed: 200,
});

refs.formEl.addEventListener('submit', onFormSubmit);
refs.loadMoreBtnEl.addEventListener(
  'click',
  Lodash(onLoadMoreClick, DEBOUNCE_DELAY)
);

refs.loadBtnContainerEl.classList.add('visually-hidden');

function onFormSubmit(e) {
  e.preventDefault();
  clearRequestedInfo();

  pixabayApi.data = e.currentTarget.elements.searchQuery.value.trim();
  if (pixabayApi.data === '') {
    return Notiflix.Notify.failure('❌ Please, enter some text.');
  }

  pixabayApi.resetPage();
  pixabayApi.fetchCards().then(array => {
    if (array.length === 0) {
      // refs.loadBtnContainerEl.classList.add('visually-hidden');
      return Notiflix.Notify.failure(
        '❌ Sorry, there are no images matching your search query. Please try again.'
      );
    }

    renderCards(array);
    if (pixabayApi.page === 2) {
      Notiflix.Notify.success(
        `✅ Hooray! We found ${pixabayApi.totalHits} images.`
      );
    }

    if (array.length < 40) {
      refs.loadBtnContainerEl.classList.add('visually-hidden');
      Notiflix.Notify.info(
        "❌ We're sorry, but you've reached to the end of search results."
      );
    }
  });
}


function renderCards(arrayOfObjects) {
  const markup = arrayOfObjects
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a href="${largeImageURL}" class="gallery-link">
        <div class="photo-card">
   <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b> 
      <span class="quantity">${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span class="quantity">${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span class="quantity">${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span class="quantity">${downloads}</span>
    </p>
  </div>
</div>
</a>`;
      }
    )
    .join('');
  refs.galleryBlockEl.insertAdjacentHTML('beforeend', markup);
  refs.loadBtnContainerEl.classList.remove('visually-hidden');
}

function onLoadMoreClick() {
  pixabayApi.fetchCards().then(array => {
    renderCards(array);

    this.perPage += array.length;
    if (this.perPage === pixabayApi.totalHits) {
      refs.loadBtnContainerEl.classList.add('visually-hidden');
      Notiflix.Notify.info(
        "❌ We're sorry, but you've reached the end of search results."
      );
    }
    lightbox.refresh();
  });
}

function clearRequestedInfo() {
  refs.galleryBlockEl.innerHTML = '';
}


