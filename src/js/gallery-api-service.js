import axios from 'axios';

const API_KEY = 'key=23901512-731f3652ce829a0e5db3ff14f';
const BASE_URL = 'https://pixabay.com/api/';

export default class GalleryApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  fetchCards() {
    const url = `${BASE_URL}?${API_KEY}&q=${this.searchQuery}&image_type=photo&per_page=40&page=${this.page}&orientation=horizontal&safesearch=true`;

    return axios.get(url).then(response => {
      this.incrementPage();
      return response;
    });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
