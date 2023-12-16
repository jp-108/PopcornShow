// Debounce Function
export function debounce(func, delay) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

//   Langauge converter function
export function languageNames(langaugeCode) {
  const languageName = new Intl.DisplayNames("en", { type: "language" });
  return languageName.of(langaugeCode);
}

// useFetch hook

export function useFetch(url, params){
  console.log(url)

}