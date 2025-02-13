function formatDate(date) {
    const dobDate = new Date(date);
    const formattedDate = dobDate.toISOString().split('T')[0];

    return formattedDate;
}
