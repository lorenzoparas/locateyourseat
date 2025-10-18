// Main application logic
class SeatingChartApp {
    constructor() {
        this.seatingData = seatingData;
        this.highlightedTable = null;
        this.init();
    }

    init() {
        this.renderSeatingChart();
        this.renderGuestList();
        this.setupEventListeners();
        this.populateTableFilter();
    }

    setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');
        const tableFilter = document.getElementById('tableFilter');

        // Search on button click
        searchButton.addEventListener('click', () => this.handleSearch());

        // Search on Enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });

        // Live search as user types (debounced)
        let debounceTimer;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                if (e.target.value.length >= 2) {
                    this.handleSearch();
                } else if (e.target.value.length === 0) {
                    this.clearSearch();
                }
            }, 300);
        });

        // Table filter
        tableFilter.addEventListener('change', (e) => {
            this.filterGuestList(e.target.value);
        });
    }

    handleSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchTerm = searchInput.value.trim().toLowerCase();
        const resultsDiv = document.getElementById('searchResults');

        if (searchTerm === '') {
            resultsDiv.classList.add('hidden');
            return;
        }

        // Find matching guests
        const matches = this.seatingData.guests.filter(guest =>
            guest.name.toLowerCase().includes(searchTerm)
        );

        if (matches.length === 0) {
            resultsDiv.innerHTML = '<div class="no-results">No guests found with that name.</div>';
            resultsDiv.classList.remove('hidden');
            this.clearHighlight();
            return;
        }

        // Display results
        let resultsHTML = '';
        matches.forEach(guest => {
            const table = this.seatingData.tables.find(t => t.number === guest.table);
            resultsHTML += `
                <div class="result-card">
                    <h3>${guest.name}</h3>
                    <p><strong>Table Number:</strong> ${guest.table}</p>
                    <p><strong>Table Capacity:</strong> ${table ? table.capacity : 'N/A'} seats</p>
                </div>
            `;
        });

        resultsDiv.innerHTML = resultsHTML;
        resultsDiv.classList.remove('hidden');

        // Highlight the table(s)
        if (matches.length > 0) {
            this.highlightTable(matches[0].table);
        }
    }

    clearSearch() {
        const resultsDiv = document.getElementById('searchResults');
        resultsDiv.classList.add('hidden');
        this.clearHighlight();
    }

    highlightTable(tableNumber) {
        this.clearHighlight();
        this.highlightedTable = tableNumber;
        
        const tableElement = document.querySelector(`[data-table="${tableNumber}"]`);
        if (tableElement) {
            tableElement.classList.add('highlighted');
            tableElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    clearHighlight() {
        const highlighted = document.querySelectorAll('.table-item.highlighted');
        highlighted.forEach(el => el.classList.remove('highlighted'));
        this.highlightedTable = null;
    }

    renderSeatingChart() {
        const chartDiv = document.getElementById('seatingChart');
        chartDiv.innerHTML = '';

        this.seatingData.tables.forEach(table => {
            const tableElement = document.createElement('div');
            tableElement.className = 'table-item';
            tableElement.setAttribute('data-table', table.number);
            
            const guestsAtTable = this.seatingData.guests.filter(g => g.table === table.number);
            
            tableElement.innerHTML = `
                <div class="table-number">Table ${table.number}</div>
                <div class="table-capacity">${guestsAtTable.length}/${table.capacity} seats</div>
            `;

            tableElement.addEventListener('click', () => {
                this.showTableGuests(table.number);
            });

            chartDiv.appendChild(tableElement);
        });
    }

    showTableGuests(tableNumber) {
        const guests = this.seatingData.guests.filter(g => g.table === tableNumber);
        const resultsDiv = document.getElementById('searchResults');
        
        if (guests.length === 0) {
            resultsDiv.innerHTML = `<div class="result-card">
                <h3>Table ${tableNumber}</h3>
                <p>No guests assigned to this table yet.</p>
            </div>`;
        } else {
            const guestNames = guests.map(g => g.name).join(', ');
            resultsDiv.innerHTML = `<div class="result-card">
                <h3>Table ${tableNumber}</h3>
                <p><strong>Guests:</strong></p>
                <p>${guestNames}</p>
            </div>`;
        }

        resultsDiv.classList.remove('hidden');
        this.highlightTable(tableNumber);
        
        // Scroll to results
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    populateTableFilter() {
        const filterSelect = document.getElementById('tableFilter');
        
        // Get unique table numbers
        const tables = [...new Set(this.seatingData.guests.map(g => g.table))].sort((a, b) => a - b);
        
        tables.forEach(tableNum => {
            const option = document.createElement('option');
            option.value = tableNum;
            option.textContent = `Table ${tableNum}`;
            filterSelect.appendChild(option);
        });
    }

    renderGuestList(filterTable = 'all') {
        const guestListDiv = document.getElementById('guestList');
        guestListDiv.innerHTML = '';

        let guests = this.seatingData.guests;
        
        // Filter if needed
        if (filterTable !== 'all') {
            guests = guests.filter(g => g.table === parseInt(filterTable, 10));
        }

        // Sort by table number, then by name
        guests.sort((a, b) => {
            if (a.table !== b.table) {
                return a.table - b.table;
            }
            return a.name.localeCompare(b.name);
        });

        guests.forEach(guest => {
            const guestCard = document.createElement('div');
            guestCard.className = 'guest-card';
            guestCard.innerHTML = `
                <div class="guest-name">${guest.name}</div>
                <div class="guest-table">Table ${guest.table}</div>
            `;
            
            guestCard.addEventListener('click', () => {
                this.highlightTable(guest.table);
                document.getElementById('searchInput').value = guest.name;
                this.handleSearch();
            });

            guestListDiv.appendChild(guestCard);
        });
    }

    filterGuestList(tableNumber) {
        this.renderGuestList(tableNumber);
    }
}

// Initialize the app when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SeatingChartApp();
});
