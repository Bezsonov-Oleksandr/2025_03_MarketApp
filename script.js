const stock = {
    items: [
        {
            name: "milk", price: 5, quantity: 50,
        },
        {
            name: "bread", price: 3, quantity: 100,
        },
        {
            name: "cheese", price: 25, quantity: 70,
        }
    ],
    totalCost: 0,
    addItem(item) {
        if (item.quantity <= 0) {
            alert('Количество должно быть положительным');
            return;
        }
        //  нужна проверка на наличие товара - тогда изменяем остаток
        //  иначе создаем новый
        const product = this.items.find(e => e.name === item.name);
        if (product) {
            product.quantity += item.quantity;
            updProductToDOM(product);
        } else {
            this.items.push(item);
            addProductToDOM(item);
        }
        this.updateTotalCost();
    },
    removeItem(itemName, itemQuantity) {
        if (itemQuantity <= 0) {
            alert('Количество должно быть положительным');
            return;
        }
        //  1.  если количество меньше остатка - вычитаем
        //  2.  если равны - удаляем товар
        //  3.  если количество больше - ругаемся
        const existItemIndex = this.items.findIndex(e => e.name === itemName);
        if (existItemIndex === -1) {
            alert('Такого товара нет на складе');
            return;
        } else if (itemQuantity > this.items[existItemIndex].quantity) {
            alert('Товара не достаточно на складе');
            return;
        } else if (itemQuantity < this.items[existItemIndex].quantity) {
            this.items[existItemIndex].quantity -= item.quantity;
        } else if (itemQuantity > this.items[existItemIndex].quantity) {
            this.items.splice(existItemIndex, 1);
        }

        this.updateTotalCost();
    },
    updateTotalCost() {
        //  обновить totalCost
        this.totalCost = this.items
            .reduce((total, item) => total + item.quantity * item.price, 0);
        console.log('Total cost = ' + stock.totalCost);
    }
}

const addBtn = document.getElementById('addBtn');
const statBtn = document.getElementById('statBtn');
const productsList = document.getElementById('productsList');
const statsList = document.getElementById('statsList');
const idName = document.getElementById('productName');
const idPrice = document.getElementById('productPrice');
const idQuantity = document.getElementById('productQuantity');

initPage();

addBtn.onclick = () => {

    if (!(idName && idPrice && idQuantity)) {
        alert('Внимание! Ошибка доступа к полям формы!');
        return;
    } else if (!idName.value.trim()) {
        alert('Введите название продукта');
        return;
    } else if (!(idPrice.value)) {
        alert('Введите цену продукта');
        return;
    } else if (!(idQuantity.value)) {
        alert('Введите количество продукта');
        return;
    }

    const newProduct = {
        name: idName.value.trim(),
        price: +idPrice.value,
        quantity: +idQuantity.value
    };
    stock.addItem(newProduct);
    idName.value = '';
    idQuantity.value = '';
    idPrice.value = '';
}
statBtn.onclick = () => {
    //      A. На основании информации о продуктах на складе получить следующие статистические данные:
    // 6. Общее кол-во товаров
    const allQuantity = stock.items.reduce((total, item) => total + item.quantity, 0);
    // 1. Минимальная цена товара
    const minPrice = stock.items.reduce((total, item) => total === 0 || item.price < total ? item.price : total, 0);
    // 2. Средняя цена товара
    let avgPrice = allQuantity ? stock.totalCost / allQuantity : 0;
    avgPrice = Math.round(avgPrice * 100) / 100;
    // 3. Максимальная цена товара
    const maxPrice = stock.items.reduce((total, item) => item.price > total ? item.price : total, 0);
    // 4. Общее кол-во позиций товаров
    // 5. Общая стоимость товаров

    //      B. Отобразить полученные статистические данные на странице
    getStatElement('stat-1').textContent = 'Минимальная цена товара : ' + minPrice;
    getStatElement('stat-2').textContent = 'Средняя цена товара : ' + avgPrice;
    getStatElement('stat-3').textContent = 'Максимальная цена товара : ' + maxPrice;
    getStatElement('stat-4').textContent = 'Общее кол-во позиций товара : ' + stock.items.length;
    getStatElement('stat-5').textContent = 'Общая стоимость товара : ' + stock.totalCost;
    getStatElement('stat-6').textContent = 'Общее кол-во товара : ' + allQuantity;
}

function addProductToDOM(item) {
    const li = document.createElement('li');
    li.id = 'product-' + item.name;
    li.classList.add("list-group-item", "mb-1", "mx-3", "border", "text-center");   /* HW 17*/
    showTheProduct(li, item);
    productsList.appendChild(li);
}
function updProductToDOM(item) {
    const li = document.getElementById('product-' + item.name);
    showTheProduct(li, item);
}
function showTheProduct(li, item) {
    // li.textContent = `${item.name} - ${item.price} (${item.quantity} шт.)`;

    const divRow = document.createElement('div');
    divRow.classList.add('row');
    li.appendChild(divRow);

    let divCol = document.createElement('div');
    divCol.classList.add('col','text-start','border-end');
    divCol.textContent = item.name;
    divRow.appendChild(divCol);
    divCol = document.createElement('div');
    divCol.classList.add('col-2','border-end');
    divCol.textContent = item.price;
    divRow.appendChild(divCol);
    divCol = document.createElement('div');
    divCol.classList.add('col-2');
    divCol.textContent = item.quantity;
    divRow.appendChild(divCol);
}
function getStatElement(id) {
    let li = document.getElementById(id);
    if (!li) {
        li = document.createElement('li');
        li.id = id;
        li.classList.add("list-group-item", "mb-1", "mx-3");   /* HW 17*/
        li.style.color = 'white';
        li.style.backgroundColor = '#6ea088';
        statsList.style.display = 'block';
        statsList.appendChild(li);
    }
    return li;
}
function initPage() {
    
    document.body.classList.add('container', 'py-3','bg-secondary','bg-gradient');
    const divElements = document.body.getElementsByTagName('div');
    if (!divElements) {
        return
    }
    const div1 = divElements[0];
    div1.classList.add('card', 'p-4', 'mb-4', 'shadow');
    div1.style.backgroundColor = '#6ea088';
    div1.style.color = 'white';

    const labelElements = div1.getElementsByTagName('label');
    for (let element of labelElements) {
        element.classList.add('label-control');
    }
    const inputElements = div1.getElementsByTagName('input');
    for (let element of inputElements) {
        element.classList.add('form-control', 'mb-2');
    }

    if (divElements.length > 1) {
        const div2 = divElements[1];
        div2.classList.add('d-flex', 'justify-content-center', 'pt-4');
    }
    addBtn.classList.add('btn', 'btn-warning', 'btn-custom');
    statBtn.classList.add('btn', 'btn-secondary', 'btn-custom');

    productsList.classList.add('list-group', 'py-2', 'mb-3', 'border', 'shadow');
    productsList.style.backgroundColor = '#e1ddab';

    statsList.classList.add('list-group', 'list-group-flush', 'mb-4', 'py-3', 'border', 'shadow', 'rounded');
    statsList.style.backgroundColor = '#6ea088';
    statsList.style.display = 'none';

    const li = document.createElement('li');
    li.classList.add("list-group-item", "mb-1", "mx-3", "border-0", "text-center");
    li.style.backgroundColor = '#e1ddab';
    productsList.appendChild(li);
    const divRow = document.createElement('div');
    divRow.classList.add('row');
    li.appendChild(divRow);
    let divCol = document.createElement('div');
    divCol.classList.add('col','text-start');
    divCol.textContent = 'Товар';
    divRow.appendChild(divCol);
    divCol = document.createElement('div');
    divCol.classList.add('col-2');
    divCol.textContent = 'Цена';
    divRow.appendChild(divCol);
    divCol = document.createElement('div');
    divCol.classList.add('col-2');
    divCol.textContent = 'Количество, шт.';
    divRow.appendChild(divCol);

    stock.updateTotalCost();
    stock.items.forEach(item => {
        addProductToDOM(item)
    });}