document.addEventListener('DOMContentLoaded', function () {
    const dogBar = document.querySelector('#dog-bar');
    const dogInfo = document.querySelector('#dog-info');
    const filterButton = document.querySelector('#good-dog-filter');
    let filter = false;

    function fetchDogs() {
        fetch('http://localhost:3000/pups')
            .then(response => response.json())
            .then(dogs => {
                dogBar.innerHTML = '';
                dogs.forEach(dog => {
                    if (!filter || dog.isGoodDog) {
                        addDogToBar(dog);
                    }
                });
            });
    }

    function addDogToBar(dog) {
        const span = document.createElement('span');
        span.textContent = dog.name;
        span.addEventListener('click', () => showDogInfo(dog));
        dogBar.appendChild(span);
    }

    function showDogInfo(dog) {
        dogInfo.innerHTML = `
            <img src="${dog.image}" />
            <h2>${dog.name}</h2>
            <button>${dog.isGoodDog ? 'Good Dog!' : 'Bad Dog!'}</button>
        `;

        const button = dogInfo.querySelector('button');
        button.addEventListener('click', () => toggleGoodDog(dog));
    }

    function toggleGoodDog(dog) {
        fetch(`http://localhost:3000/pups/${dog.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                isGoodDog: !dog.isGoodDog,
            }),
        })
            .then(response => response.json())
            .then(fetchDogs);
    }

    filterButton.addEventListener('click', function () {
        filter = !filter;
        filterButton.textContent = `Filter good dogs: ${filter ? 'ON' : 'OFF'}`;
        fetchDogs();
    });

    fetchDogs();
});
