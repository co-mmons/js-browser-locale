declare var INTL_DEFAULT_LOCALE: string;
declare var INTL_SUPPORTED_LOCALE: string[] | string;
declare var INTL_LOCALE_URL_PATH: boolean;
declare var INTL_LOCALE_URL_PARAM: string;

var INTL_LOCALE = function (): string {

    if (typeof window === "undefined" || typeof window.navigator === "undefined") {
        return INTL_DEFAULT_LOCALE;
    }

    let browserLocale: string = window.navigator["languages"] ? window.navigator["languages"][0] : undefined;
    browserLocale = browserLocale || window.navigator.language || window.navigator["browserLanguage"] || window.navigator["userLanguage"];
    browserLocale = browserLocale ? browserLocale.toLowerCase() : undefined;

    let urlLocale = INTL_LOCALE_URL_PATH ? window.location.pathname.split("/")[1] : undefined;
    if (urlLocale && urlLocale.match(/^\W+$/g)) {
        urlLocale = undefined;
    }

    if (!urlLocale) {
        let queryLocaleMatch = new RegExp('[?&]' + INTL_LOCALE_URL_PARAM + '=([^&]*)').exec(window.location.search);
        urlLocale = queryLocaleMatch && decodeURIComponent(queryLocaleMatch[1].replace(/\+/g, ' ')).toLowerCase();
    }

    let bestLocale: string;

    if (browserLocale || urlLocale) {

        let bestLocaleRanking: number;
        let supported = INTL_SUPPORTED_LOCALE;

        for (let l of (typeof supported == "string" ? supported.split(",") : supported)) {
            let s = l.toLowerCase();

            if (s == urlLocale) {
                return l;

            } else if (s == browserLocale) {
                bestLocale = l;
                bestLocaleRanking = 20;

            } else if (urlLocale && (!bestLocale || bestLocaleRanking < 30) && (s.indexOf(urlLocale) === 0 || urlLocale.indexOf(s) === 0)) {
                bestLocale = l;
                bestLocaleRanking = 30;

            } else if (browserLocale && (!bestLocale || bestLocaleRanking < 10) && (s.indexOf(browserLocale) === 0 || browserLocale.indexOf(s) === 0)) {
                bestLocale = l;
                bestLocaleRanking = 10;
            }
        }
    }

    if (!bestLocale) {
        return INTL_DEFAULT_LOCALE;
    }

    return bestLocale;
}();
