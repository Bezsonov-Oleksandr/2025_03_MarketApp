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
            updProductInDOM(product);
        } else {
            this.items.push(item);
            addProductToDOM(item);
        }
        this.updateTotalCost();
    },
    addQuantity(itemName, itemQuantity) {
        if (itemQuantity <= 0 || !itemName.trim()) {
            alert('Проверьте вводимую информацию про кол-во удаляемых товаров');
            return;
        }
        const existItemIndex = this.items.findIndex((e) => itemName === e.name);
        if (existItemIndex === -1) {
            alert('Товара, нет на складе, либо вы вводите некорректное кол-во');
            return;
        } else {
            this.items[existItemIndex].quantity += itemQuantity;
            updProductInDOM(this.items[existItemIndex]);
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
            this.items[existItemIndex].quantity -= itemQuantity;
            updProductInDOM(this.items[existItemIndex]);
        } else if (itemQuantity >= this.items[existItemIndex].quantity) {
            this.items.splice(existItemIndex, 1);
            delProductFromDom(itemName);
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
    getStatElement('stat-1').innerHTML = 'Минимальная цена товара : <strong>' + minPrice+'</strong>';
    getStatElement('stat-2').innerHTML = 'Средняя цена товара :  <strong>' + avgPrice+'</strong>';
    getStatElement('stat-3').innerHTML = 'Максимальная цена товара :  <strong>' + maxPrice+'</strong>';
    getStatElement('stat-4').innerHTML = 'Общее кол-во позиций товара :  <strong>' + stock.items.length+'</strong>';
    getStatElement('stat-5').innerHTML = 'Общая стоимость товара :  <strong>' + stock.totalCost+'</strong>';
    getStatElement('stat-6').innerHTML = 'Общее кол-во товара :  <strong>' + allQuantity+'</strong>';

    document.getElementById("headerStat").style.display = 'block';
}

function addProductToDOM(item) {
    const li = document.createElement('li');
    li.id = 'product-' + item.name;
    li.classList.add("list-group-item", "mb-1", "mx-3", "border", "text-center");   /* HW 17*/
    showTheProduct(li, item);
    productsList.appendChild(li);
}
function updProductInDOM(item) {
    const li = document.getElementById('product-' + item.name);
    li.innerHTML = '';
    showTheProduct(li, item);
}
function delProductFromDom(itemName) {
    const li = document.getElementById(`product-${itemName}`);
    li.remove();
}

function showTheProduct(li, item) {
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
    divCol.classList.add('col-2','border-end');
    divCol.textContent = item.quantity;
    divRow.appendChild(divCol);
    divCol = document.createElement('span');
    divCol.classList.add('col-4');
    divCol.innerHTML = `
    <button class="btn btn-primary me-2"
        style="width: fit-content; margin: 0 auto;" 
        onclick="stock.addQuantity('${item.name}',1)">
        +1</button>
    <button class="btn btn-primary me-2" 
        style="width: fit-content; margin: 0 auto;" 
        onclick="stock.removeItem('${item.name}',1)">
        -1</button>
    <button class="btn btn-danger" 
        id="deleteBtn-${item.name}"
        style="width: fit-content; margin: 0 auto;">
        Delete</button>
    `;
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

    if (divElements.length > 1) {
        const div2 = divElements[1];
        div2.classList.add('d-flex', 'justify-content-center', 'pt-4');
    }
    addBtn.classList.add('btn', 'btn-warning', 'btn-custom');
    statBtn.classList.add('btn', 'btn-primary', 'btn-custom');

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
    divCol.textContent = 'Кол-во, шт.';
    divRow.appendChild(divCol);
    divCol = document.createElement('div');
    divCol.classList.add('col-4');
    divRow.appendChild(divCol);

    stock.updateTotalCost();
    stock.items.forEach(item => {
        addProductToDOM(item)
    });}