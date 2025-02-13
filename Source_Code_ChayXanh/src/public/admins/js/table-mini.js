function renderTable_mini(data, columns, showAction) {
    const table = document.querySelector('#table-mini');

    if (table) {
        table.innerHTML = '';

        let thead = table.querySelector('thead');
        if (!thead) {
            thead = document.createElement('thead');
            table.appendChild(thead);

            const headerRow = document.createElement('tr');
            columns.forEach((column, index) => {
                const th = document.createElement('th');
                th.textContent = column.title;
                if (column.width) {
                    th.style.width = column.width;
                }
                headerRow.appendChild(th);
            });

            if (showAction) {
                const th = document.createElement('th');
                th.textContent = 'Hành động';
                headerRow.appendChild(th);
            }

            thead.appendChild(headerRow);
        }

        let tbody = table.querySelector('tbody');
        if (!tbody) {
            tbody = document.createElement('tbody');
            table.appendChild(tbody);
        }

        const VND = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        });

        const rowsHTML = data.map((rowData, rowIndex) => {
            const cellsHTML = columns.map((column, colIndex) => {
                const field = column.field;
                if (field === 'index') {
                    return `<td style="width: ${column.width}">${
                        rowIndex + 1
                    }</td>`;
                } else if (column.type === 'format') {
                    return `<td style="width: ${column.width}; text-align:${
                        column.align
                    }">
                                ${VND.format(rowData[field])}
                            </td>`;
                } else if (column.type === 'img') {
                    return `<td style="width: ${column.width}; text-align:${column.align}">
                        <img class="img-table-mini" src="/storages_image/${rowData[field]}" alt="image">
                </td>`;
                } else if (column.type === 'date') {
                    const dateWithTimezone = new Date(rowData[field]);

                    const dateUTC = new Date(dateWithTimezone.toISOString());

                    const formattedDate = dateUTC.toLocaleString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        timeZone: 'UTC',
                    });
                    return `<td style="width: ${column.width}; text-align:${column.align}">
                                ${formattedDate}
                            </td>`;
                } else {
                    return `<td style="width: ${column.width}; text-align:${column.align}">
                                ${rowData[field]}
                            </td>`;
                }
            });

            if (showAction) {
                cellsHTML.push(`
                        <td>
                            <button class="btn btn_delete" onclick="handleDeleteMini(${rowData.id})">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </td>
                    `);
            }

            return `<tr>${cellsHTML.join('')}</tr>`;
        });
        tbody.innerHTML = rowsHTML.join('');
    }
}
