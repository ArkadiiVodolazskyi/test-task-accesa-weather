export default class LanguageService {
  constructor() {
    this.browserLanguage = navigator.language;
  }

  get language() {
    return this.browserLanguage.slice(0, 2);
  }
}
