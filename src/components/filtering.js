import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);
export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
   Object.keys(indexes)                                    // Получаем ключи из объекта
      .forEach((elementName) => {                        // Перебираем по именам
        elements[elementName].append(                    // в каждый элемент добавляем опции
            ...Object.values(indexes[elementName])        // формируем массив имён, значений опций
                      .map(name => {                        // используйте name как значение и текстовое содержимое
       const optionElement = document.createElement('option'); // "Моя заметка: 6 спринт, тема 6.5, урок 2 "Создание и добавление элементов""                                                 // @todo: создать и вернуть тег опции
           optionElement.value = name;
          optionElement.textContent = name;
          return optionElement;            
        })
        )
     })

return (data, state, action) => {
                                                   // Проверила действие и сделала очистку поля
        if (action?.type === 'clear') {
            const fieldName = action.field;
            if (fieldName && state) {
                // Сбрасываем значение в state
                state[fieldName] = '';
                
                // нашла инпут input и сброс его значение
                const input = document.querySelector(`input[data-name="${fieldName}"]`);
                if (input) {
                    input.value = '';
                }
            }
        }

        
        // @todo: #4.2 — обработать очистку поля
  
        // @todo: #4.5 — отфильтровать данные используя компаратор
        
        return data.filter(row => compare(row, state));
    }
}
