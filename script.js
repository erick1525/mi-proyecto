// Función para mostrar la pantalla de inicio
function showHomePage() {
    document.getElementById('main-content').innerHTML = `
        <div class="home-page">
            <h2>Bienvenido a Variedades San Ángel</h2>
            <p>Seleccione una opción del menú para comenzar.</p>
        </div>
    `;
}

// Funciones relacionadas con el inventario

// Función para cargar productos desde localStorage
function loadProducts() {
    return JSON.parse(localStorage.getItem('products')) || [];
}

// Función para guardar productos en localStorage
function saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
}

// Función para agregar productos al inventario
function openAddProduct() {
    document.getElementById('main-content').innerHTML = `
        <h2>Ingresar Producto</h2>
        <form id="add-product-form">
            <label for="product-name">Nombre del Producto:</label>
            <input type="text" id="product-name" required>
            <label for="product-code">Código del Producto:</label>
            <input type="text" id="product-code" required>
            <label for="product-price">Precio del Producto:</label>
            <input type="number" id="product-price" step="0.01" required>
            <label for="product-quantity">Cantidad del Producto:</label>
            <input type="number" id="product-quantity" required>
            <button type="submit">Agregar Producto</button>
        </form>
    `;

    document.getElementById('add-product-form').addEventListener('submit', addProduct);
}

// Función para agregar un producto al inventario
function addProduct(event) {
    event.preventDefault();

    const name = document.getElementById('product-name').value;
    const code = document.getElementById('product-code').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const quantity = parseInt(document.getElementById('product-quantity').value);

    let products = loadProducts();

    const productIndex = products.findIndex(product => product.code === code);

    if (productIndex !== -1) {
        products[productIndex].quantity += quantity;
        products[productIndex].price = price;
    } else {
        products.push({ name, code, price, quantity });
    }

    saveProducts(products);

    alert('Producto agregado/actualizado en el inventario');
    openInventory();
}

// Función para abrir la vista del inventario
function openInventory() {
    console.log('Abriendo inventario...'); // Mensaje de depuración
    const products = loadProducts();
    const inventoryTable = document.createElement('table');
    inventoryTable.id = 'inventory-table';
    inventoryTable.innerHTML = `
        <tr>
            <th>Nombre del Producto</th>
            <th>Código</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Acciones</th>
        </tr>
    `;

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.code}</td>
            <td>${product.price.toFixed(2)}</td>
            <td>${product.quantity}</td>
            <td>
                <button onclick="openEditProduct('${product.code}')">Editar</button>
            </td>
        `;
        inventoryTable.appendChild(row);
    });

    // Limpiar el contenido de main-content antes de agregar la nueva tabla
    document.getElementById('main-content').innerHTML = '';

    // Agregar la tabla al contenido principal
    document.getElementById('main-content').appendChild(inventoryTable);
}

// Función para abrir el formulario de edición de un producto
function openEditProduct(code) {
    const products = loadProducts();
    const product = products.find(product => product.code === code);

    if (!product) {
        alert('No se encontró el producto');
        return;
    }

    document.getElementById('main-content').innerHTML = `
        <h2>Editar Producto</h2>
        <form id="edit-product-form">
            <label for="edit-product-name">Nombre del Producto:</label>
            <input type="text" id="edit-product-name" value="${product.name}" required>
            <label for="edit-product-code">Código del Producto:</label>
            <input type="text" id="edit-product-code" value="${product.code}" readonly>
            <label for="edit-product-price">Precio del Producto:</label>
            <input type="number" id="edit-product-price" step="0.01" value="${product.price}" required>
            <label for="edit-product-quantity">Cantidad del Producto:</label>
            <input type="number" id="edit-product-quantity" value="${product.quantity}" required>
            <button type="submit">Guardar Cambios</button>
        </form>
    `;

    document.getElementById('edit-product-form').addEventListener('submit', function(event) {
        event.preventDefault();
        saveEditedProduct(code);
    });
}

// Función para guardar los cambios realizados en un producto
function saveEditedProduct(code) {
    const name = document.getElementById('edit-product-name').value;
    const price = parseFloat(document.getElementById('edit-product-price').value);
    const quantity = parseInt(document.getElementById('edit-product-quantity').value);

    let products = loadProducts();

    const productIndex = products.findIndex(product => product.code === code);

    if (productIndex !== -1) {
        products[productIndex].name = name;
        products[productIndex].price = price;
        products[productIndex].quantity = quantity;
        saveProducts(products);
        alert('Producto actualizado correctamente');
        openInventory(); // Actualizar la vista del inventario después de guardar los cambios
    } else {
        alert('No se encontró el producto');
    }
}

// Resto de funciones relacionadas con el inventario...

// Funciones relacionadas con las facturas

// Función para cargar facturas desde localStorage
function loadInvoices() {
    return JSON.parse(localStorage.getItem('invoices')) || [];
}

// Función para guardar facturas en localStorage
function saveInvoices(invoices) {
    localStorage.setItem('invoices', JSON.stringify(invoices));
}

// Funciones relacionadas con las ventas

// Función para cargar ventas desde localStorage
function loadSales() {
    return JSON.parse(localStorage.getItem('sales')) || [];
}

// Función para guardar ventas en localStorage
function saveSales(sales) {
    localStorage.setItem('sales', JSON.stringify(sales));
}

// Facturación
function openInvoices() {
    document.getElementById('main-content').innerHTML = `
        <h2>Crear Factura</h2>
        <table id="invoice-table">
            <thead>
                <tr>
                    <th>Nombre del Producto</th>
                    <th>Código</th>
                    <th>Precio Unitario</th>
                    <th>Cantidad</th>
                    <th>Precio Total</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><input type="text" class="invoice-product-name" oninput="fillInvoiceFields(this
                    <td><input type="text" class="invoice-product-code" oninput="fillInvoiceFields(this, 'code')"></td>
                    <td><input type="number" class="invoice-product-price" step="0.01" readonly></td>
                    <td><input type="number" class="invoice-product-quantity" oninput="updateInvoiceTotal(this)"></td>
                    <td><input type="number" class="invoice-product-total" step="0.01" readonly></td>
                    <td><button onclick="removeInvoiceItem(this)">Eliminar</button></td>
                </tr>
            </tbody>
        </table>
        <button onclick="addInvoiceRow()">Agregar Producto</button>
        <button onclick="saveInvoice()">Guardar Factura</button>
        <h3>Total de la Factura: <span id="invoice-total">0.00</span></h3>
        <div id="invoice-history"></div>
    `;

    document.getElementById('invoice-product-quantity').addEventListener('input', updateInvoiceTotal);

    // Cargar historial de facturas
    loadInvoiceHistory();
}

let currentInvoice = [];

// Función para llenar los campos de la factura
function fillInvoiceFields(element, field) {
    const row = element.closest('tr');
    const code = row.querySelector('.invoice-product-code').value;
    const name = row.querySelector('.invoice-product-name').value;

    const product = findProductByCodeOrName(field === 'code' ? code : name, field === 'name' ? name : code);

    if (product) {
        row.querySelector('.invoice-product-name').value = product.name;
        row.querySelector('.invoice-product-code').value = product.code;
        row.querySelector('.invoice-product-price').value = product.price;
        updateInvoiceTotal(row);
    } else {
        row.querySelector('.invoice-product-price').value = '';
    }
}

// Función para añadir una fila a la factura
function addInvoiceRow() {
    const invoiceTableBody = document.getElementById('invoice-table').querySelector('tbody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td><input type="text" class="invoice-product-name" oninput="fillInvoiceFields(this, 'name')"></td>
        <td><input type="text" class="invoice-product-code" oninput="fillInvoiceFields(this, 'code')"></td>
        <td><input type="number" class="invoice-product-price" step="0.01" readonly></td>
        <td><input type="number" class="invoice-product-quantity" oninput="updateInvoiceTotal(this)"></td>
        <td><input type="number" class="invoice-product-total" step="0.01" readonly></td>
        <td><button onclick="removeInvoiceItem(this)">Eliminar</button></td>
    `;

    invoiceTableBody.appendChild(newRow);
}

// Función para eliminar un producto de la factura
function removeInvoiceItem(button) {
    const row = button.closest('tr');
    row.remove();
    updateInvoiceDisplay();
}

// Función para actualizar el total de una fila de la factura
function updateInvoiceTotal(element) {
    const row = element.closest('tr');
    const price = parseFloat(row.querySelector('.invoice-product-price').value) || 0;
    const quantity = parseInt(row.querySelector('.invoice-product-quantity').value) || 0;
    const total = price * quantity;

    row.querySelector('.invoice-product-total').value = total.toFixed(2);
    updateInvoiceDisplay();
}

// Función para actualizar el total de la factura
function updateInvoiceDisplay() {
    let total = 0;
    document.querySelectorAll('.invoice-product-total').forEach(totalField => {
        total += parseFloat(totalField.value) || 0;
    });
    document.getElementById('invoice-total').textContent = total.toFixed(2);
}

// Función para encontrar un producto por código o nombre
function findProductByCodeOrName(code, name) {
    const products = loadProducts();
    return products.find(product => product.code === code || product.name === name);
}

// Función para guardar una factura
function saveInvoice() {
    const invoiceRows = document.querySelectorAll('#invoice-table tbody tr');
    const newInvoice = [];

    invoiceRows.forEach(row => {
        const name = row.querySelector('.invoice-product-name').value;
        const code = row.querySelector('.invoice-product-code').value;
        const price = parseFloat(row.querySelector('.invoice-product-price').value);
        const quantity = parseInt(row.querySelector('.invoice-product-quantity').value);
        const total = parseFloat(row.querySelector('.invoice-product-total').value);

        if (code && quantity > 0) {
            newInvoice.push({ name, code, price, quantity, total });
        }
    });

    if (newInvoice.length === 0) {
        alert('No hay productos en la factura');
        return;
    }

    const invoices = loadInvoices();
    invoices.push(newInvoice);
    saveInvoices(invoices);

    const products = loadProducts();
    const sales = loadSales();

    newInvoice.forEach(item => {
        const productIndex = products.findIndex(product => product.code === item.code);
        if (productIndex !== -1) {
            products[productIndex].quantity -= item.quantity;
        }
        sales.push(item);
    });

    saveProducts(products);
    saveSales(sales);

    alert('Factura guardada y el inventario actualizado');
    openInvoices();
}

// Función para cargar el historial de facturas
function loadInvoiceHistory() {
    const invoices = loadInvoices();
    const invoiceHistory = document.getElementById('invoice-history');

    invoiceHistory.innerHTML = '<h3>Historial de Facturas</h3>';

    invoices.forEach((invoice, index) => {
        let invoiceTotal = 0;

        invoiceHistory.innerHTML += `<h4>Factura ${index + 1}</h4>`;
        invoiceHistory.innerHTML += `
            <table>
                <tr>
                    <th>Nombre del Producto</th>
                    <th>Código</th>
                    <th>Precio Unitario</th>
                    <th>Cantidad</th>
                    <th>Precio Total</th>
                </tr>
        `;

        invoice.forEach(item => {
            invoiceHistory.innerHTML += `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.code}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>${item.quantity}</td>
                    <td>${item.total.toFixed(2)}</td>
                </tr>
            `;
            invoiceTotal += item.total;
        });

        invoiceHistory.innerHTML += `
                <tr>
                    <td colspan="4"><strong>Total</strong></td>
                    <td><strong>${invoiceTotal.toFixed(2)}</strong></td>
                </tr>
            </table>
            <br>
        `;
    });
}

// Función para abrir la vista del historial de ventas
function openSales() {
    const sales = loadSales();
    document.getElementById('main-content').innerHTML = `
        <h2>Historial de Ventas</h2>
        <table id="sales-table">
            <tr>
                <th>Nombre del Producto</th>
                <th>Código</th>
                <th>Precio Unitario</th>
                <th>Cantidad</th>
                <th>Precio Total</th>
            </tr>
        </table>
    `;

    const salesTable = document.getElementById('sales-table');

    sales.forEach(sale => {
        salesTable.innerHTML += `
            <tr>
                <td>${sale.name}</td>
                <td>${sale.code}</td>
                <td>${sale.price.toFixed(2)}</td>
                <td>${sale.quantity}</td>
                <td>${sale.total.toFixed(2)}</td>
            </tr>
        `;
    });
}

// Navegación
document.getElementById('home').addEventListener('click', showHomePage);
document.getElementById('create-invoice').addEventListener('click', openInvoices);
document.getElementById('view-inventory').addEventListener('click', openInventory);
document.getElementById('add-product').addEventListener('click', openAddProduct);
document.getElementById('view-sales').addEventListener('click', openSales);

// Mostrar la pantalla de inicio por defecto
showHomePage();
