import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import countriesListTemplate from './templates/countries-list.hbs';
import countryCardTemplate from './templates/country-card.hbs';
import CountriesApiService from './js/countries-api-service';
