const hum = document.getElementById('hum-opacity');
const wind = document.getElementById('wind-opacity');
const searchHeader = document.getElementById('search-header');
const errorText = document.getElementById('error-text');
const errNameEl = document.getElementById('err-name');
const cityText = document.getElementById('city-text');
const errStatusEl = document.getElementById('err-status');
const countryText = document.getElementById('country');
const time = document.getElementById('time');

if (searchHeader) {
    searchHeader.style.display = 'none'
}

const searchButton = document.getElementById('search-svg');

searchButton.addEventListener('click', () => {
    getWeather();
})

//https://api.openweathermap.org/data/2.5/weather?q=voronezh&appid=3729038340fd67a495f3fb602d7deb11
function GetMonthName(month) {

    let monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return monthList[month];

}

async function getWeather() {
    let searchContainer = document.getElementById('search-container'),

        weatherContainer = document.getElementById('weather'),

        tempElem = document.getElementById('temp'),

        weatherNameElem = document.getElementById('weather-name'),

        humidityEl = document.getElementById('humid'),

        windEl = document.getElementById('windy'),

        sunEl = document.getElementById('sun'),

        cloudElem = document.getElementById('cloud'),

        cloudElem2 = document.getElementById('clouded'),

        rainElem = document.getElementById('rain'),

        visibCount = document.getElementById('visib'),

        infoDec = document.getElementById('info'),

        inputValue = document.getElementById('cityInput'),

        trueValue = inputValue.value,

        API = "3729038340fd67a495f3fb602d7deb11",

        url = `https://api.openweathermap.org/data/2.5/weather?q=${trueValue}&appid=${API}`;

    try {
        let responce = await fetch(url);
    //nowDate: Date = new Date();

    if (sunEl && rainElem && cloudElem && cloudElem2) {

        sunEl.style.display = 'none';

        rainElem.style.display = 'none';

        cloudElem.style.display = 'none'

        cloudElem2.style.display = 'none'
    }

    if (!inputValue || responce.status == 400) {

        if (errNameEl && errorText && errStatusEl) {

            errorText.style.display = 'block';
            errNameEl.innerText = `Вы ничего не ввели!`;
            errStatusEl.innerHTML = `${responce.status}`;

        }

        throw new Error(`Вы ничего не ввели!\nСтатус ошибки: ${responce.status}`);

    } else {

        if (responce.ok) {

            console.log(1);
            

            if (searchHeader) {
                searchHeader.style.display = 'block';

                searchHeader.onclick = () => {
                    searchContainer.style.display = 'flex';
                    weatherContainer.style.display = 'none';
                    searchHeader.style.display = 'none';
                }
            }
            errorText.style.display = 'none';

            searchContainer ? searchContainer.style.display = 'none' : null;

            weatherContainer ? weatherContainer.style.display = 'flex' : null;

            let json = await responce.json(),   

                nowDate = new Date(),

                monthID = nowDate.getMonth(), // месяц в цифре

                day = nowDate.getDay(),

                hours = nowDate.getHours(),

                minutes = String(nowDate.getMinutes()).padStart('2',0),

                monthName = GetMonthName(monthID), // имя месяца

                mainInfo = json.weather[0].main, // Имя явления

                //descInfo = json.weather[0].description,// Описание явления

                visibility = (json.visibility / 1000).toFixed(1), // видимость

                windSpeed = (json.wind.speed).toFixed(1), // скорость ветра

                temp = Math.round(json.main.temp - 273), // Температура в градусах Цельсия

                //feelsTemp = Math.round(json.main.feels_like - 273), // Чувстуется как(в градусах цельсия)

                humidity = json.main.humidity; //Влажность 

                time.innerHTML = `<br>${monthName} ${day},${hours}:${minutes}`

            cityText.innerText = json.name;
            countryText.innerText = json.sys.country;
            console.log(json)

            if (mainInfo === 'Clear') {

                if (sunEl && cloudElem && cloudElem2 && infoDec) {

                    sunEl.style.display = 'flex';

                    cloudElem.style.display = 'flex';

                    cloudElem2.style.display = 'none';

                    infoDec.classList.remove('rain-bg');
                }

            } else if (mainInfo === 'Clouds') {

                if (cloudElem2 && infoDec) {

                    cloudElem2.style.display = 'flex'

                    infoDec.classList.add('rain-bg')

                }

            } else if (mainInfo === 'Rain' || mainInfo === 'Drizzle') {

                if (infoDec && cloudElem2 && rainElem) {

                    infoDec.classList.add('rain-bg')

                    cloudElem2.style.display = 'block';

                    rainElem.style.display = 'block'

                }

            }

            if (tempElem && weatherNameElem && humidityEl && windEl && visibCount) {

                tempElem.innerText = temp + '°C';

                weatherNameElem.innerText = mainInfo;

                humidityEl.innerText = humidity;

                windEl.innerText = windSpeed;

                visibCount.innerText = visibility

            }

        } else {

            if (responce.status == 404) {
                if (errNameEl && errorText && errStatusEl) {
                    errorText.style.marginTop = '350px';
                    errorText.style.display = 'block';
                    errNameEl.innerText = `Такой город не найден`;
                    errStatusEl.innerHTML = `404`;
                    resizeWindow();
                }

            }

        }}

    }
    catch(e) {
        console.log(e);
        
        if(e == 'TypeError: NetworkError when attempting to fetch resource.') {
                errorText.style.display = 'block';
                errorText.innerText = 'Извините, Попробуйте позже'
        }
    }
}

window.onload = function () {

    const menuEl = document.getElementById('menu-el');
    const closeAsideEl = document.getElementById('close-aside');
    const aside = document.getElementById('aside');

    closeAsideEl?.addEventListener('click', () => {
        if (aside) {
            aside.classList.add('aside-close');
            aside.classList.remove('aside-open');
            setTimeout(() => {
                aside.style.marginLeft = '-1000px'
            }, 400)
        }
    })

    menuEl?.addEventListener('click', () => {

        if (aside) {
            aside.style.display = 'none';
        }

        if (aside?.style.display == 'none') {
            aside.classList.add('aside-open');
            aside.style.display = 'block';
            aside.classList.remove('aside-close')
            setTimeout(() => {
                aside.style.marginLeft = '0'
            }, 300)
        }
    })
    resizeWindow();
}

function resizeWindow() {
    let windX = window.innerWidth,
        windY = window.innerHeight,
        errorText = document.getElementById('error-text');

    if (windX <= 700 && windY <= 770) {

        const mainTextEl = document.getElementById('main-text');
        const spanCity = document.getElementById('span-city'),
            brEl = document.getElementById('br-hide'),
            brEL2 = document.getElementById('br-hide1');

        if (mainTextEl) {
            mainTextEl.classList.remove("text-7xl");
            mainTextEl.classList.add('text-5xl');
            spanCity.style.height = '50px';
            errorText.style.marginTop = '700px';
            spanCity.style.width = '100px'

            if (brEl && brEL2) {
                brEl.style.display = 'block';
                brEL2.style.display = 'block'
            }

        }
    }
}
