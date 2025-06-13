// Configuração dos gráficos
document.addEventListener('DOMContentLoaded', function() {
    // Atualizar data e hora
    function updateDateTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        document.querySelector('.date-time').textContent = now.toLocaleDateString('pt-BR', options);
    }
    updateDateTime();
    setInterval(updateDateTime, 60000);

    // Gráfico de Transações por Hora
    const transactionsCtx = document.getElementById('transactionsChart').getContext('2d');
    new Chart(transactionsCtx, {
        type: 'line',
        data: {
            labels: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
            datasets: [{
                label: 'Transações',
                data: [12, 19, 3, 5, 2, 3, 20, 33],
                borderColor: '#6c5ce7',
                backgroundColor: 'rgba(108, 92, 231, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(108, 92, 231, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // Gráfico de Tipos de Fraude
    const fraudCtx = document.getElementById('fraudTypesChart').getContext('2d');
    new Chart(fraudCtx, {
        type: 'doughnut',
        data: {
            labels: [
                'Cartão Clonado (35%)',
                'Conta Hackeada (25%)',
                'Chargeback (20%)',
                'Multi-Contas (10%)',
                'VPN Suspeita (5%)',
                'Outros (5%)'
            ],
            datasets: [{
                data: [35, 25, 20, 10, 5, 5],
                backgroundColor: [
                    '#6c5ce7',
                    '#a29bfe',
                    '#00cec9',
                    '#00b894',
                    '#fdcb6e',
                    '#e17055'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        padding: 20,
                        font: {
                            size: 12,
                            family: 'Tektur, sans-serif'
                        },
                        color: '#fff'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw}%`;
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });

    // Filtros de Transações
    const statusFilter = document.getElementById('statusFilter');
    const riskFilter = document.getElementById('riskFilter');
    const exportBtn = document.querySelector('.export-btn');

    statusFilter.addEventListener('change', filterTransactions);
    riskFilter.addEventListener('change', filterTransactions);

    function filterTransactions() {
        const status = statusFilter.value;
        const risk = riskFilter.value;
        const rows = document.querySelectorAll('tbody tr');

        rows.forEach(row => {
            const rowStatus = row.querySelector('.status').textContent.toLowerCase();
            const rowRisk = row.querySelector('.risk').textContent.toLowerCase();
            
            const statusMatch = status === 'all' || rowStatus === status;
            const riskMatch = risk === 'all' || rowRisk === risk;
            
            row.style.display = statusMatch && riskMatch ? '' : 'none';
        });
    }

    // Exportar dados
    exportBtn.addEventListener('click', function() {
        const table = document.querySelector('table');
        const rows = Array.from(table.querySelectorAll('tr'));
        const csvContent = rows.map(row => {
            const cells = Array.from(row.querySelectorAll('th, td'));
            return cells.map(cell => cell.textContent.trim()).join(',');
        }).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'transacoes_gameswap.csv';
        link.click();
    });

    // Ações nas transações
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.dataset.action;
            const transactionId = this.closest('tr').dataset.id;
            
            switch(action) {
                case 'view':
                    viewTransactionDetails(transactionId);
                    break;
                case 'block':
                    blockTransaction(transactionId);
                    break;
                case 'approve':
                    approveTransaction(transactionId);
                    break;
            }
        });
    });

    function viewTransactionDetails(id) {
        // Simular carregamento de detalhes
        console.log(`Visualizando detalhes da transação ${id}`);
    }

    function blockTransaction(id) {
        if (confirm('Tem certeza que deseja bloquear esta transação?')) {
            const row = document.querySelector(`tr[data-id="${id}"]`);
            row.classList.add('suspicious');
            row.querySelector('.status').textContent = 'Bloqueada';
            row.querySelector('.status').classList.remove('pending', 'completed');
            row.querySelector('.status').classList.add('blocked');
        }
    }

    function approveTransaction(id) {
        const row = document.querySelector(`tr[data-id="${id}"]`);
        row.querySelector('.status').textContent = 'Aprovada';
        row.querySelector('.status').classList.remove('pending');
        row.querySelector('.status').classList.add('completed');
    }

    // Sistema de Notificações
    const notificationIcon = document.querySelector('.notifications i');
    let notificationCount = 0;

    function addNotification(message, type = 'info') {
        notificationCount++;
        const badge = document.createElement('span');
        badge.className = 'notification-badge';
        badge.textContent = notificationCount;
        notificationIcon.parentNode.appendChild(badge);

        // Criar notificação
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="close-notification">&times;</button>
        `;

        document.body.appendChild(notification);

        // Remover notificação após 5 segundos
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Exemplo de notificação
    setInterval(() => {
        const messages = [
            'Nova transação suspeita detectada',
            'Padrão de comportamento anormal identificado',
            'Tentativa de login suspeita bloqueada'
        ];
        const types = ['warning', 'info', 'danger'];
        const randomIndex = Math.floor(Math.random() * messages.length);
        addNotification(messages[randomIndex], types[randomIndex]);
    }, 30000);

    // Menu responsivo
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    // Logout
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Tem certeza que deseja sair?')) {
                // Simular logout
                window.location.href = '/login.html';
            }
        });
    }
}); 