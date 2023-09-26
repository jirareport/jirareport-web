import ptBr from './pt_BR'
import en from './en'

import LocalStoreService from "services/LocalStoreService";

const langs = {
    'pt_BR':ptBr,
    'en': en
}

function _accessByString(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1');
    s = s.replace(/^\./, '');
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}

function t(key) {
    const lang = langs[LocalStoreService.getI18n() || 'en']
    const result = _accessByString(lang, key)
    if (result) {
        return result
    }
    return `{${key}}`;
}

export default t