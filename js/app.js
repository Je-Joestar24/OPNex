document.addEventListener('DOMContentLoaded', () => {
    const fruitContainer = document.querySelector('.fruit-container');

    // Sample data for Devil Fruits
    const fruits = [
        { name: 'Gomu Gomu no Mi', description: 'A rubber fruit that grants the user rubber-like properties.' },
        { name: 'Mera Mera no Mi', description: 'A fire fruit that allows the user to control fire.' },
        // Add more fruits as needed
    ];

    // Function to render fruits
    const renderFruits = () => {
        fruits.forEach(fruit => {
            const fruitCard = document.createElement('div');
            fruitCard.classList.add('fruit-card');
            fruitCard.innerHTML = `<h3>${fruit.name}</h3><p>${fruit.description}</p>`;
            fruitContainer.appendChild(fruitCard);
        });
    };

    renderFruits();
});
