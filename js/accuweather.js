var apikey = 'tqJu3kLI7pbXRMGwjbCDAd5igpazX6nz';
var citySearchEndpoint = 'http://dataservice.accuweather.com/locations/v1/cities/search';
var forecastEndpoint = 'http://dataservice.accuweather.com/forecasts/v1/daily/5day/';



$(document).ready(function () {
	
	setEventHandlers();

});


function setEventHandlers() {

	$(document).on("click", ".city-submit", function() { updateCityDropdown(this); });
	$(document).on("click", ".forecast-submit", function() { forecastSubmitClick(this); });
	//$(document).on('keydown', '.city-text-input', function() { updateCountryDropdown(this); });
		 
}

function forecastSubmitClick(obj) {

	var cityKey = $('.city-dropdown').val();

	if (!cityKey) {
		alertMessage('Please select a city');
		return;
	}

	var url = forecastEndpoint + cityKey;
	var data = {apikey: apikey, details: 'true', metric: 'true'};

	$.ajax({
	    url: url,
		data: data,
	    success: function (data) { populateForecast(data); },
		error: function (e, x, settings, exception) { alertMessage('The allowed number of requests has been exceeded.'); }
	});

}

function populateForecast(data) {

	var $container = $('.output-container');
	$container.empty();

	populateSummaryData(data);

	//add values from ajax call
	$.each(data.DailyForecasts, function (key, val) {

		var $forecastElement = getForecastDayElement(val);
		$container.append($forecastElement);

	});

}

function populateSummaryData(data) {
	
	var startDate = new Date(data.DailyForecasts[0].Date);
	var endDate = new Date(data.DailyForecasts[data.DailyForecasts.length - 1].Date);

	var dateRange = startDate.getUTCDate() + ' ' + getMonthName(startDate);
	dateRange += ' to ' + endDate.getUTCDate() + ' ' + getMonthName(endDate);

	$('.output-title-container .date-range').text(dateRange);
	$('.output-title-container .summary').text(data.Headline.Text);

}

function getForecastDayElement(val) {

	//clone element and populate data
	var $forecastElement = $('.forecast-day-item.clone').clone().removeClass('clone');

	var forecastDate = new Date(val.Date);
	$forecastElement.find('.forecast-day-date .dow').text(getDayofWeek(forecastDate));
	$forecastElement.find('.forecast-day-date .sub').text(getShortDate(forecastDate));
	
	$forecastElement.find('.forecast-day-icon img').attr('src', 'https://www.accuweather.com/images/weathericons/' + val.Day.Icon + '.svg');
	
	$forecastElement.find('.forecast-day-temp .high').text(Math.round(val.Temperature.Maximum.Value) + '°');
	$forecastElement.find('.forecast-day-temp .low').text('/' + Math.round(val.Temperature.Minimum.Value) + '°');

	$forecastElement.find('.forecast-day-precipitation .value').text(val.Day.PrecipitationProbability + '%');

	$forecastElement.find('.forecast-day-summary').text(val.Day.LongPhrase);
	
	$forecastElement.find('.forecast-day-realfeel .value').text(Math.round(val.RealFeelTemperature.Maximum.Value) + '°');
	$forecastElement.find('.forecast-day-realfeel-shade .value').text(Math.round(val.RealFeelTemperatureShade.Maximum.Value) + '°');

	var uvIndexValue = val.AirAndPollen.find(item => item.Name === 'UVIndex').Value;
	var uvIndexCategory = val.AirAndPollen.find(item => item.Name === 'UVIndex').Category;
	$forecastElement.find('.forecast-day-uvindex .value').text(uvIndexValue + ' ' + uvIndexCategory);

	var windData = val.Day.Wind;
	var windText = windData.Direction.Localized + ' ' + Math.round(windData.Speed.Value) + windData.Speed.Unit;
	$forecastElement.find('.forecast-day-wind .value').text(windText);

	return $forecastElement;

}

function updateCityDropdown(obj) {

	var cityText = $('.city-text-input').val();
	var $selectList = $('.city-dropdown');
	var cities = getCitiesFromText(cityText, $selectList);

}



function getCitiesFromText(cityText, $selectList) {		 

	var url = citySearchEndpoint;
	var data = {apikey: apikey, q: cityText};

	$.ajax({
	    url: url,
		data: data,
	    success: function (data) { populateCitySelectList(data, $selectList) },
		error: function (e, x, settings, exception) { alertMessage('The allowed number of requests has been exceeded.'); }
	});
}

function populateCitySelectList(data, $selectList) {		 

	$selectList.empty();

	if (!data) {
		alertMessage('No cities match your search');
	}

	//add values from ajax call
	$.each(data, function (key, val) {
		var label = val.LocalizedName + ', ' + val.AdministrativeArea.LocalizedName + ', ' + val.Country.LocalizedName;
		$selectList.append($('<option>', { value: val.Key}).text(label));
	});

}

function alertMessage(text) {
		 
		$('.alert .alert-inner').text(text);
		$('.alert').show();
		$('.alert').delay(10000).fadeOut('slow');

}

function getShortDate(date) 
{
	var day = date.getUTCDate()
	var month = date.getUTCMonth() + 1;

	return shortDate = day.toString().padStart(2,"0") + '/' + month.toString().padStart(2,"0");
} 

function getDayofWeek(date) {

	const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	return day = weekday[date.getDay()].slice(0, 3);

}

function getMonthName(date) {
	const monthNames = ["January", "February", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December"];

	return month = monthNames[date.getMonth()];
}