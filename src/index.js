import './sass/main.scss';
import 'material-icons/iconfont/two-tone.css';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import GalleryApiService from './js/gallery-api-service';
import cardsTemplate from './templates/cards-grid.hbs';
import 'animate.css';

const refs = {
  searchForm: document.querySelector('.input-group'),
  cardsContainer: document.querySelector('.gallery'),
  loadMore: document.querySelector('#load-more'),
};

const message = {
  emptyString: 'Please, type your search query',
  noMatchesFound: 'Sorry, there are no images matching your search query. Please try again.',
  endOfSearchResults: "We're sorry, but you've reached the end of search results.",
  error: 'Something goes wrong.',
};
////////   CLASSES    ///////

const galleryApiService = new GalleryApiService();

//////// EVENT LISTENERS  //////

refs.searchForm.addEventListener('submit', onSearch);

//////// FUNCTIONS //////////

function onSearch(e) {
  e.preventDefault();

  galleryApiService.query = e.target.elements.searchQuery.value.trim();

  if (galleryApiService.query === '') {
    Notify.info(message.emptyString);
    clearCardsContainer();
    return;
  }

  loadContent();
}

function loadContent() {
  galleryApiService.resetPage();
  clearCardsContainer();
  fetchMarkup();
}

async function fetchMarkup() {
  try {
    const { data, hasNextPage } = await galleryApiService.fetchCards();

    if (!hasDataMatches(data)) {
      Notify.failure(message.noMatchesFound);
      return;
    }

    renderContent(data);

    if (!hasNextPage) {
      Notify.info(message.endOfSearchResults);
      observer.disconnect();
      return;
    }

    observer.observe(refs.loadMore);
  } catch (error) {
    Notify.failure(message.error);
    console.log(error);
  }
}

function renderContent(data) {
  appendCardsMarkup(data);
  const lightBox = new SimpleLightbox('.card-img-area');
  lightBox.refresh();
}

function appendCardsMarkup(data) {
  refs.cardsContainer.insertAdjacentHTML('beforeend', cardsTemplate({ ...data.hits }));
}

function clearCardsContainer() {
  refs.cardsContainer.innerHTML = '';
}

function hasDataMatches(data) {
  if (data.total === 0) {
    return false;
  }
  return true;
}

function onEntry(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting && galleryApiService.query !== '') {
      fetchMarkup();
    }
  });
}

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '150px',
});
