document.addEventListener('DOMContentLoaded', function() {
    // Tabs switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Pizza row click functionality
    const pizzaRows = document.querySelectorAll('.pizza-row');
    let currentlyOpenDetail = null;

    pizzaRows.forEach(row => {
        row.addEventListener('click', function() {
            const pizzaId = this.getAttribute('data-pizza');
            const detailRow = document.querySelector(`.detail-row[data-pizza="${pizzaId}"]`);
            
            if (!detailRow) return;

            // Remove active state from all pizza rows
            pizzaRows.forEach(r => r.classList.remove('active'));
            
            // If clicking the same row that's already open, close it
            if (currentlyOpenDetail === detailRow && detailRow.classList.contains('show')) {
                closeDetailRow(detailRow);
                currentlyOpenDetail = null;
                return;
            }

            // Close any currently open detail row
            if (currentlyOpenDetail && currentlyOpenDetail !== detailRow) {
                closeDetailRow(currentlyOpenDetail);
            }

            // Open the clicked detail row
            openDetailRow(detailRow);
            this.classList.add('active');
            currentlyOpenDetail = detailRow;

            // Flash animation on phone number
            const phone = document.querySelector('.phone');
            if (phone) {
                phone.style.animation = 'none';
                setTimeout(() => {
                    phone.style.animation = 'pulse 2s infinite';
                }, 10);
            }

            // Smooth scroll to the detail row
            setTimeout(() => {
                detailRow.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest' 
                });
            }, 200);
        });

        // Add hover effects
        row.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                const prices = this.querySelectorAll('.price-col');
                prices.forEach(price => {
                    price.style.transform = 'scale(1.1)';
                    price.style.transition = 'transform 0.3s ease';
                });
            }
        });
        
        row.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                const prices = this.querySelectorAll('.price-col');
                prices.forEach(price => {
                    price.style.transform = 'scale(1)';
                });
            }
        });
    });

    function openDetailRow(detailRow) {
        detailRow.style.display = 'table-row';
        // Force reflow
        detailRow.offsetHeight;
        detailRow.classList.add('show');
        detailRow.classList.remove('hide');
    }

    function closeDetailRow(detailRow) {
        detailRow.classList.add('hide');
        detailRow.classList.remove('show');
        
        setTimeout(() => {
            detailRow.style.display = 'none';
            detailRow.classList.remove('hide');
        }, 300);
    }

    // Close detail rows when switching tabs
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (currentlyOpenDetail) {
                closeDetailRow(currentlyOpenDetail);
                currentlyOpenDetail = null;
            }
            pizzaRows.forEach(r => r.classList.remove('active'));
        });
    });

    // Add click indicator to pizza rows
    pizzaRows.forEach(row => {
        const indicator = document.createElement('div');
        indicator.className = 'click-indicator';
        indicator.innerHTML = '▼';
        indicator.style.cssText = `
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: #ff5733;
            font-size: 12px;
            opacity: 0;
            transition: all 0.3s ease;
        `;
        row.style.position = 'relative';
        row.appendChild(indicator);

        row.addEventListener('mouseenter', () => {
            indicator.style.opacity = '0.7';
        });

        row.addEventListener('mouseleave', () => {
            if (!row.classList.contains('active')) {
                indicator.style.opacity = '0';
            }
        });
    });
});

// Hover animation for menu items (prices scale)
const menuItems = document.querySelectorAll('.menu-table tr.menu-item');
menuItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        const prices = this.querySelectorAll('.price-col');
        prices.forEach(price => {
            price.style.transform = 'scale(1.1)';
            price.style.transition = 'transform 0.3s ease';
        });
    });
    
    item.addEventListener('mouseleave', function() {
        const prices = this.querySelectorAll('.price-col');
        prices.forEach(price => {
            price.style.transform = 'scale(1)';
        });
    });
});

// Click effect to highlight selected pizza and toggle details row
menuItems.forEach(item => {
    item.addEventListener('click', function() {
        // Remove highlight from all items
        menuItems.forEach(i => i.style.backgroundColor = '');
        
        // Highlight this item
        this.style.backgroundColor = 'rgba(255, 87, 51, 0.2)';
        this.style.transition = 'background-color 0.3s ease';

        // Flash animation on phone number
        const phone = document.querySelector('.phone');
        if (phone) {
            phone.style.animation = 'none';
            setTimeout(() => {
                phone.style.animation = 'pulse 2s infinite';
            }, 10);
        }

        // Toggle the detail row
        const nextRow = this.nextElementSibling;
        if (nextRow && nextRow.classList.contains('pizza-details-row')) {
            const isVisible = nextRow.style.display === 'table-row';
            // Hide all other detail rows first
            document.querySelectorAll('pizza-details-row').forEach(row => {
                row.style.display = 'none';
            });
            // Toggle clicked one
            nextRow.style.display = isVisible ? 'none' : 'table-row';
        }
    });
});
