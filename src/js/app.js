import '../css/style.css';
import './plugins';
import locations from "./store/locations";
import formUI from "./views/form";
import currencyUI from "./views/currency";
import ticketsUI from "./views/tickets";

// locations.init().then(res => {
//   // console.log(res);
//   console.log(locations);
//   // console.log( locations.getCitiesByCountryCode('PE') );
// });

document.addEventListener('DOMContentLoaded', () => {
  initApp();
  const form = formUI.form;

  // Events
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    onFormSubmit();
  });

  // Handlers
  async function initApp() {
    await locations.init();
    formUI.setAutocompleteData(locations.shortCities);
  }

  async function onFormSubmit() {
    // собрать данные из инпутов
    // const origin = formUI.originValue;
    const origin = locations.getCityCodeByKey(formUI.originValue);
    // const destination = formUI.destinationValue;
    const destination = locations.getCityCodeByKey(formUI.destinationValue);
    const depart_date = formUI.departDateValue;
    const return_date = formUI.returnDateValue;
    const currency = currencyUI.currencyValue;

    // Data-Format for origin and destination: CITY_CODE
    // Data-Format for depart_date and return_date, YYYY-MM
    // Formed Request-URL in axios (location.fetchTickets() -> apiService prices()):
    // https://aviasales-api.herokuapp.com/prices/cheap?origin=MOW&destination=MUC&depart_date=2020-01&return_date=2020-01&currency=USD
    // params-object: { origin: origin, destination: destination, ... }
    // Therefore variable-names are relevant for API
    // console.log(origin, destination, depart_date, return_date, currency);
    await locations.fetchTickets({
      origin,
      destination,
      depart_date,
      return_date,
      currency,
    });
    // console.log(locations.lastSearch);

    ticketsUI.renderTickets(locations.lastSearch);
  }
});
