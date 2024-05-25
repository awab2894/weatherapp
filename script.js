const weatherForm = document.querySelector('.inserts');
const cityInput = document.querySelector('#city');
const card = document.querySelector('.card');
const apikey = '33e00b2a29c681282bb32e2b69c08479';

weatherForm.addEventListener('submit', async e => {
    card.textContent = '';
    const loading = document.createElement('img');
    loading.src = 'images/loading.svg';
    loading.classList.add('loading');
    card.appendChild(loading);
    e.preventDefault();
    const city = cityInput.value;

    if(city){

        try{
            const WeatherData = await getWeatherData(city);
            displayWeatherInfo(WeatherData);
        }
        catch(err){
            displayError(err);
        }

    }else{
        displayError("لم يتم إدخال مدينة");
    }
});

async function getWeatherData(city){
    
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&lang=ar`;
    
    const response = await fetch(apiUrl);

    if(!response.ok){
        if(response.status == 404){
            console.clear();
            throw new Error('لم يتم العثور على المدينة');
        }else{
            throw new Error('لا يمكن الحصول على بيانات الطقس!');
        }
    }

    return await response.json(); 

}

function displayWeatherInfo(data){
    const { name: city,
        main: {temp, humidity},
        weather: [{description, id}] } = data;
        card.textContent = '';
        card.style.display = 'flex';

        const cityDisplay = document.createElement('h1');
        const tempDisplay = document.createElement('p');
        const descriptionDisplay = document.createElement('p');
        const humidityDisplay = document.createElement('p');
        const emojiDisplay = document.createElement('p');

        tempDisplay.classList.add('temp');
        descriptionDisplay.classList.add('description');
        humidityDisplay.classList.add('humidity');
        emojiDisplay.classList.add('emoji');

        cityDisplay.textContent = city;
        tempDisplay.textContent = `${(temp - 273.5).toFixed(1)}° م`;
        humidityDisplay.textContent = `الرطوبة: ${humidity}%`;
        descriptionDisplay.textContent = description;
        emojiDisplay.textContent = getWeatherEmoji(id);

        card.appendChild(cityDisplay);
        card.appendChild(tempDisplay);
        card.appendChild(humidityDisplay);
        card.appendChild(descriptionDisplay);
        card.appendChild(emojiDisplay);

    }

function getWeatherEmoji(id){
    switch(true){
        case (id >= 200 && id < 300):
            return '⛈';
        case (id >= 300 && id < 400):
            return '🌧';
        case (id >= 500 && id < 600):
            return '🌦';
        case (id >= 600 && id < 700):
            return '❄';
        case (id >= 700 && id < 800):
            return '🌫';
        case (id == 800):
            return '🌞';
        case (id > 800 && id < 810):
            return '⛅';
        default:
            return '❔';
    }
}

function displayError(msg){
    const errorDisplay = document.createElement('h2');
    errorDisplay.textContent = msg;
    errorDisplay.classList.add('errorDisplay');

    card.textContent = '';
    card.style.display = 'flex';
    card.appendChild(errorDisplay);
}