import axios from 'axios';

export default class PictureApi {
  constructor() {
    this.searchValue = '';
    this.page = 1;
    this.perPage = 40;
    this.totalHits = 0;
  }

  async fetchCards() {
    const BASE_URL = 'https://pixabay.com/api/';
    const KEY = '29487770-8dc2fdfd5dc3a60dbabe08fd9';
    const url = `${BASE_URL}?key=${KEY}&q=${this.searchValue}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.perPage}`;

    try {
      const response = await axios.get(url);
      const arrayOfObjects = response.data.hits;
      const totalHits = response.data.totalHits;
      this.incrementPage();
      this.totalHits = totalHits;

      return arrayOfObjects;
    } catch (error) {
      console.log('ERROR: ', console.log(error));
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get data() {
    return this.searchValue;
  }

  set data(newData) {
    this.searchValue = newData;
  }
}
