// script.js

// Inicializando o armazenamento local
const salesHistoryBody = document.getElementById("sales-history-body");
const vehicleTypeFilter = document.getElementById("vehicle-type");
const vehicleModelInput = document.getElementById("vehicle-model");
const vehicleTypeSellSelect = document.getElementById("vehicle-type-sell");
const saleValueInput = document.getElementById("sale-value");
const monthlyProfitSpan = document.getElementById("monthly-profit");
const vehicleModelRegister = document.getElementById("vehicle-model-register");
const vehicleBrand = document.getElementById("vehicle-brand");
const vehicleYear = document.getElementById("vehicle-year");
const vehicleQuantity = document.getElementById("vehicle-quantity");
const filterMonthInput = document.getElementById("filter-month");

let sales = JSON.parse(localStorage.getItem('sales')) || [];
let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];

// Função para registrar um veículo no estoque
const registerVehicle = () => {
    const model = vehicleModelRegister.value.trim();
    const brand = vehicleBrand.value.trim();
    const year = parseInt(vehicleYear.value);
    const quantity = parseInt(vehicleQuantity.value);
    const type = document.getElementById("vehicle-type-register").value;

    // Validação
    if (!model || !brand || !year || isNaN(quantity) || quantity < 1) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    const existingVehicle = vehicles.find(v => v.model === model && v.type === type);
    if (existingVehicle) {
        // Se o veículo já existir, apenas incrementa a quantidade
        existingVehicle.quantity += quantity;
    } else {
        // Se o veículo não existir, adiciona um novo
        const vehicle = {
            model,
            brand,
            year,
            quantity,
            type
        };
        vehicles.push(vehicle);
    }

    // Salvar veículos no localStorage
    localStorage.setItem('vehicles', JSON.stringify(vehicles));
    alert("Veículo cadastrado com sucesso!");
    clearVehicleFields();
    updateVehicleStock();
};

// Função para limpar campos após cadastrar veículo
const clearVehicleFields = () => {
    vehicleModelRegister.value = "";
    vehicleBrand.value = "";
    vehicleYear.value = "";
    vehicleQuantity.value = "";
};

// Função para registrar uma venda
const registerSale = () => {
    const model = vehicleModelInput.value.trim();
    const type = vehicleTypeSellSelect.value;
    const value = parseFloat(saleValueInput.value);

    if (!model || !value || isNaN(value)) {
        alert("Por favor, preencha todos os campos corretamente.");
        return;
    }

    const vehicle = vehicles.find(v => v.model === model && v.type === type);
    
    if (!vehicle || vehicle.quantity < 1) {
        alert("Este veículo não está disponível em estoque.");
        return;
    }

    // Realizar a venda
    vehicle.quantity -= 1; // Diminuir a quantidade em estoque
    const sale = {
        model,
        type,
        value,
        date: new Date().toLocaleDateString()
    };

    sales.push(sale);
    localStorage.setItem('sales', JSON.stringify(sales));
    localStorage.setItem('vehicles', JSON.stringify(vehicles));
    updateSalesHistory();
    updateMonthlyProfit();
    updateVehicleStock();
    clearSaleFields();
};

// Função para limpar campos após registrar venda
const clearSaleFields = () => {
    vehicleModelInput.value = "";
    saleValueInput.value = "";
};

// Função para atualizar o histórico de vendas
const updateSalesHistory = () => {
    salesHistoryBody.innerHTML = "";

    const filteredSales = filterMonthInput.value
        ? sales.filter(sale => new Date(sale.date).toLocaleString().includes(filterMonthInput.value))
        : sales;

    filteredSales.forEach(sale => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${sale.date}</td>
            <td>${sale.model}</td>
            <td>${sale.type}</td>
            <td>R$ ${sale.value.toFixed(2)}</td>
        `;
        salesHistoryBody.appendChild(row);
    });
};

// Função para calcular o lucro mensal
const updateMonthlyProfit = () => {
    const currentMonth = new Date().getMonth();
    const monthlySales = sales.filter(sale => new Date(sale.date).getMonth() === currentMonth);
    const totalProfit = monthlySales.reduce((sum, sale) => sum + sale.value, 0);
    monthlyProfitSpan.textContent = `R$ ${totalProfit.toFixed(2)}`;
};

// Função para atualizar o estoque de veículos
const updateVehicleStock = () => {
    const vehicleStockContainer = document.getElementById("vehicle-stock-list");
    vehicleStockContainer.innerHTML = "";

    vehicles.forEach(vehicle => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${vehicle.model}</td>
            <td>${vehicle.type}</td>
            <td>${vehicle.quantity}</td>
        `;
        vehicleStockContainer.appendChild(row);
    });
};

// Evento de registrar venda
document.getElementById("register-sale").addEventListener("click", registerSale);

// Evento de registrar veículo
document.getElementById("register-vehicle").addEventListener("click", registerVehicle);

// Inicializar a página
updateSalesHistory();
updateMonthlyProfit();
updateVehicleStock();
