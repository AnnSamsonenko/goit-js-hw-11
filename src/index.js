import './sass/main.scss';
import 'material-icons/iconfont/two-tone.css';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import GalleryApiService from './js/gallery-api-service';
import cardsTemplate from './templates/cards-grid.hbs';
import LoadMoreBtn from './js/components/load-more-btn';

const refs = {
  searchForm: document.querySelector('.input-group'),
  cardsContainer: document.querySelector('.gallery'),
};

const message = {
  emptyString: 'Please, type your search query',
  noMatchesFound: 'Sorry, there are no images matching your search query. Please try again.',
};
////////   CLASSES    ///////
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});
const galleryApiService = new GalleryApiService();
//////// EVENT LISTENERS  //////
refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchMarkup);

function onSearch(e) {
  e.preventDefault();

  galleryApiService.query = e.target.elements.searchQuery.value.trim();

  if (galleryApiService.query === '') {
    Notify.info(message.emptyString);
    loadMoreBtn.hide();
    clearCardsContainer();
    return;
  }
  loadMoreBtn.show();
  loadMoreBtn.disable();
  galleryApiService.resetPage();
  clearCardsContainer();
  fetchMarkup();
}

function fetchMarkup() {
  galleryApiService.fetchCards().then(cards => {
    if (!hasDataMatches(cards)) {
      Notify.info(message.noMatchesFound);
      loadMoreBtn.hide();
      return;
    }

    loadMoreBtn.show();
    loadMoreBtn.disable();
    appendCardsMarkup(cards);
    loadMoreBtn.enable();
    loadMoreBtn.show();
  });
}

function appendCardsMarkup({ data }) {
  console.log(data);
  refs.cardsContainer.insertAdjacentHTML('beforeend', cardsTemplate({ ...data.hits }));
}

function clearCardsContainer() {
  refs.cardsContainer.innerHTML = '';
}

function hasDataMatches({ data }) {
  if (data.total === 0) {
    return false;
  }
  return true;
}
