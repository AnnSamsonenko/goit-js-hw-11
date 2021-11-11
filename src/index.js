import './sass/main.scss';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import GalleryApiService from './js/gallery-api-service';
import cardsTemplate from './templates/cards-grid.hbs';
import LoadMoreBtn from './js/components/load-more-btn';

const refs = {
  searchForm: document.querySelector('#search-form'),
  cardsContainer: document.querySelector('.gallery'),
};

console.log(refs.cardsContainer);

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

const galleryApiService = new GalleryApiService();

refs.searchForm.addEventListener('input', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchMarkup);

function onSearch(e) {
  e.preventDefault();

  galleryApiService.query = e.target.value;

  if (galleryApiService.query === '') {
    Notify.failure('------');
    return;
  }

  loadMoreBtn.show();
  galleryApiService.resetPage();
  clearCardsContainer();
  fetchMarkup();
}

function fetchMarkup() {
  loadMoreBtn.disable();
  galleryApiService.fetchCards().then(cards => {
    console.log(cards);
    appendCardsMarkup(cards);
    loadMoreBtn.enable();
  });
}

function appendCardsMarkup(cards) {
  refs.cardsContainer.insertAdjacentHTML('beforeend', cardsTemplate({ ...cards.hits }));
}

function clearCardsContainer() {
  refs.cardsContainer.innerHTML = '';
}
