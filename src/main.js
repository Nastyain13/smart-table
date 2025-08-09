import "./fonts/ys-display/fonts.css";
import "./style.css";

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initSearching } from "./components/searching.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initPagination } from "./components/pagination.js";

// @todo: подключение

// Исходные данные используемые в render()
//const {data, ...indexes} = initData(sourceData);
const api = initData(sourceData);
/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
  const state = processFormData(new FormData(sampleTable.container));
  const rowsPerPage = parseInt(state.rowsPerPage); // приведём количество страниц к числу
  const page = parseInt(state.page ?? 1); // номер страницы по умолчанию 1 и тоже число

  return {
    ...state,
    rowsPerPage,
    page,
  };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
async function render(action) {
  //сделала асинхронной
  let state = collectState(); // состояние полей из таблицы

  let query = {}; // 1 заменила вместо let result
  query = applySorting(query, state, action); // result заменяем на query
  query = applySearching(query, state, action); // result заменяем на query
  query = applyFiltering(query, state, action); // result заменяем на query
  query = applyPagination(query, state, action); // обновляем query
  const { total, items } = await api.getRecords(query); // получение данных 2.1

  updatePagination(total, query); // перерисовываем пагинатор
  sampleTable.render(items); // 2.2 items вместо result
}

const sampleTable = initTable(
  {
    tableTemplate: "table",
    rowTemplate: "row",
    before: ["search", "header", "filter"],
    after: ["pagination"],
  },
  render
);

// @todo: инициализация

const searchElement = sampleTable.search.elements.search; //  у меня конкретный элемент search из SampleTable
const applySearching = initSearching(searchElement.name); // атрибут нейм этого поля

const applySorting = initSorting([
  // Нам нужно передать сюда массив элементов, которые вызывают сортировку, чтобы изменять их визуальное представление
  sampleTable.header.elements.sortByDate,
  sampleTable.header.elements.sortByTotal,
]);
const { applyFiltering, updateIndexes } = initFiltering(
  sampleTable.filter.elements
); // передаём элементы фильтра

const { applyPagination, updatePagination } = initPagination(
  sampleTable.pagination.elements, // передаём сюда элементы пагинации, найденные в шаблоне
  (el, page, isCurrent) => {
    // и колбэк, чтобы заполнять кнопки страниц данными
    const input = el.querySelector("input");
    const label = el.querySelector("span");
    input.value = page;
    input.checked = isCurrent;
    label.textContent = page;
    return el;
  }
);

const appRoot = document.querySelector("#app");
appRoot.appendChild(sampleTable.container);

async function init() {
  const indexes = await api.getIndexes();

  updateIndexes(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers,
  });
}

init().then(render);
