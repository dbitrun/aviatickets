import api from "../services/apiService";
import { formatDate } from "../helpers/date";

class Locations {
  constructor(api, helpers) {
    this.api = api;
    this.countries = null;
    this.cities = null;
    this.shortCities = {};
    this.lastSearch = {};
    this.airlines = {};
    this.formatDate = helpers.formatDate;
  }

  async init() {
    const response = await Promise.all([
      this.api.countries(),
      this.api.cities(),
      this.api.airlines()
    ]);
    const [countries, cities, airlines] = response;
    // this.countries = countries;
    this.countries = this.serializeCountries(countries);
    // this.cities = cities;
    this.cities = this.serializeCities(cities);
    this.shortCities = this.createShortCities(this.cities);
    this.airlines = this.serializeAirlines(airlines);
    // console.log(this.cities);

    return response;
  }

  getCityCodeByKey(value) {
    // return this.cities[value].code;
    const city = Object.values(this.cities).find((item) => item.full_name === value);
    return city.code;
  }

  getCityNameByCode(code) {
    return this.cities[code].name;
  }

  getAirlineLogoByCode(code) {
    return this.airlines[code] ? this.airlines[code].logo : '';
  }

  getAirlineNameByCode(code) {
    return this.airlines[code] ? this.airlines[code].name : '';
  }

  createShortCities(cities) {
    // { 'City, Country': null }    // Необходимый формат данных для autocomplete
    // Object.entries(cities) returns [key, value] // cities это объект объектов (not array)
    return Object.entries(cities).reduce((acc, [key, city]) => {
      // acc[key] = null;
      acc[city.full_name] = null;
      return acc;
    }, {});
  }

  serializeCountries(countries) {
    // {'Country code': {...} }
    return countries.reduce((acc, country) => {
      acc[country.code] = country;
      return acc;
    }, {});
  }

  serializeCities(cities) {
    // { 'City name, Country name': {...} }
    return cities.reduce((acc, city) => {
      const country_name = this.getCountryNameByCode(city.country_code);
      const city_name = city.name || city.name_translations.en;
      const full_name = `${city_name},${country_name}`;
      acc[city.code] = {
        ...city,
        country_name,
        full_name,
      };
      return acc;
    }, {});
  }

  // serializeCities(cities) {
  //   return cities.reduce((acc, city) => {
  //     const country_name = this.countries[city.country_code].name;
  //     const key = `${city.name},${country_name}`;
  //     acc[key] = {
  //       ...city,
  //       country_name,
  //     };
  //     return acc;
  //   }, {});
  // }

  serializeAirlines(airlines) {
    return airlines.reduce((acc, item) => {
      item.logo = `http://pics.avs.io/200/200/${item.code}.png`;
      item.name = item.name || item.name_translations.en;
      acc[item.code] = item;
      return acc;
    });
  }


  getCountryNameByCode(code) {
    // {'Country code': {...} }
    return this.countries[code].name || this.countries[code].translations.en;
  }

  // getCitiesByCountryCode(code) {
  //   return this.cities.filter(city => city.country_code === code);
  // }

  async fetchTickets(params) {
    const response = await this.api.prices(params);
    // console.log(response);
    // this.lastSearch = response.data;
    // серилизовать поиск так, чтобы внутри были названия города и страны
    this.lastSearch = this.serializeTickets(response.data);
    // console.log(this.lastSearch);

  }

  serializeTickets(tickets) {
    return Object.values(tickets).map(ticket => {
      // console.log(ticket);
      return {
        ...ticket,
        origin_name: this.getCityNameByCode(ticket.origin),
        destination_name: this.getCityNameByCode(ticket.destination),
        airline_logo: this.getAirlineLogoByCode(ticket.airline),
        airline_name: this.getAirlineNameByCode(ticket.airline),
        departure_at: this.formatDate(ticket.departure_at, 'dd MMM yyyy hh:mm'),
        return_at: this.formatDate(ticket.return_at, 'dd MMM yyyy hh:mm'),
      }
    });
  }

}

const locations = new Locations(api, { formatDate });
export default locations;

// { 'City, Country': null }    // Необходимый формат данных для autocomplete
// [ {}, {} ]                   // Получаемые даные с сервера в виде массива с городами и странами
// { 'City': {...} } -> cities[code] // желательно преоброзовать данные городов из массвов в объекты, чтобы удубнее было доставать города по коду
