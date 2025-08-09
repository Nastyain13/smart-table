import {rules, createComparison} from "../lib/compare.js";


export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
 const compare = createComparison(
        rules.skipEmptyTargetValues, rules.searchMultipleFields (searchField, ['date', 'customer', 'seller'], false))
        // @todo: #5.2 — применить компаратор
     
    return (data, state, action) => {
        // Фильтрация данных с учетом состояния поиска
        return data.filter(row => compare(row, state));
    };
}