const API_KEY = 'f4fbe61a8ada46bc9e492503261408';

async function getWeatherData(city) {
    try {
        const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=6&aqi=no`);
        const data = await res.json();

        if(data.error) {
            alert("المدينة غير موجودة، تأكد من الاسم!");
            return;
        }

        
        document.getElementById('city-name').textContent = `${data.location.name}, ${data.location.country}`;
        document.getElementById('current-temp').innerHTML = `<span class="number-pop text-[80px] md:text-[110px] leading-none font-bold">${Math.round(data.current.temp_c)}°</span><span class="text-4xl md:text-[45px] align-top ml-1 text-gray-300 font-medium mt-4 inline-block">C</span>`;
        document.getElementById('current-condition').textContent = data.current.condition.text;

        const today = data.forecast.forecastday[0].day;
        document.getElementById('high-temp').textContent = `H: ${Math.round(today.maxtemp_c)}°`;
        document.getElementById('low-temp').textContent = `L: ${Math.round(today.mintemp_c)}°`;

        document.getElementById('humidity').textContent = `${data.current.humidity}%`;
        document.getElementById('wind').innerHTML = `${data.current.wind_kph} <span class="text-sm text-on-surface-variant">km/h</span>`;
        document.getElementById('feels-like').textContent = `${Math.round(data.current.feelslike_c)}°`;
        document.getElementById('pressure').innerHTML = `${data.current.pressure_mb} <span class="text-sm text-on-surface-variant">hPa</span>`;

        document.getElementById('main-icon').textContent = getMaterialIcon(data.current.condition.text, data.current.is_day);

        let currentHourIndex = new Date().getHours();
        let hourlyHTML = '';
        
        for(let i = 0; i < 6; i++) {
            let targetHour = currentHourIndex + i;
            let dayIndex = 0;
            if(targetHour > 23) {
                targetHour -= 24;
                dayIndex = 1;
            }
            
            const hourData = data.forecast.forecastday[dayIndex].hour[targetHour];
            const timeLabel = i === 0 ? 'Now' : `${targetHour}:00`;
            const icon = getMaterialIcon(hourData.condition.text, hourData.is_day);
            const iconColor = hourData.is_day ? 'text-yellow-400' : 'text-blue-200';

            hourlyHTML += `
            <div class="min-w-[80px] flex flex-col items-center gap-3 p-4 rounded-xl bg-black/20 border border-white/10 hover:bg-black/40 transition-colors snap-center shadow-md">
                <span class="text-label-caps font-label-caps text-on-surface-variant font-bold">${timeLabel}</span>
                <span class="material-symbols-outlined filled text-[28px] ${iconColor} drop-shadow-md">${icon}</span>
                <span class="text-stat-value font-stat-value number-pop text-xl">${Math.round(hourData.temp_c)}°</span>
            </div>`;
        }
        document.getElementById('hourly-forecast').innerHTML = hourlyHTML;

        
        let dailyHTML = '';
        const daysArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        for(let i = 1; i <= 5; i++) {
            const dayData = data.forecast.forecastday[i];
            if(!dayData) continue; 

            const dateObj = new Date(dayData.date);
            const dayName = daysArr[dateObj.getDay()];
            const icon = getMaterialIcon(dayData.day.condition.text, 1); 

            dailyHTML += `
            <div class="flex items-center justify-between p-3 rounded-xl hover:bg-black/20 transition-colors cursor-pointer group">
                <span class="text-body-lg font-body-lg w-12 font-bold text-white">${dayName}</span>
                <div class="flex items-center justify-center flex-1">
                    <span class="material-symbols-outlined filled text-[32px] group-hover:scale-110 transition-transform text-yellow-400 drop-shadow-md">${icon}</span>
                </div>
                <div class="flex items-center gap-4 w-24 justify-end">
                    <span class="text-body-md font-body-md text-on-surface-variant font-bold">${Math.round(dayData.day.mintemp_c)}°</span>
                    <span class="text-stat-value font-stat-value number-pop text-xl">${Math.round(dayData.day.maxtemp_c)}°</span>
                </div>
            </div>
            ${i !== 5 ? '<div class="h-px w-full bg-white/10 my-1"></div>' : ''}
            `;
        }
        document.getElementById('daily-forecast').innerHTML = dailyHTML;

    } catch(e) {
        console.error('Error fetching data:', e);
    }
}

function getMaterialIcon(condition, isDay) {
    let text = condition.toLowerCase();
    if(text.includes('sun') || text.includes('clear')) return isDay ? 'light_mode' : 'dark_mode';
    if(text.includes('cloud') || text.includes('overcast')) return 'cloud';
    if(text.includes('rain') || text.includes('drizzle')) return 'rainy';
    if(text.includes('thunder') || text.includes('storm')) return 'thunderstorm';
    if(text.includes('snow') || text.includes('ice')) return 'ac_unit';
    return isDay ? 'partly_cloudy_day' : 'partly_cloudy_night';
}

document.getElementById('search-input').addEventListener('keypress', (e) => {
    if(e.key === 'Enter' && e.target.value.trim() !== '') {
        getWeatherData(e.target.value);
        e.target.value = '';
    }
});

getWeatherData('Cairo');