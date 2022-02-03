import React, { useState, useEffect} from 'react';
import axios from 'axios';
function Weather() {

  const day = ["Monday" , "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const [latitude, setLatitude] = useState(50);
  const [longitude, setLongitude] = useState(0);
  const [place, setPlace] = useState("");
  const [results, setResults] = useState([]);
  
  const apiKey = '7bdea45f8538f75f68f20d0d04d718a8';
  const handleChange = ()=>{
    axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${place}&appid=${apiKey}`)
    .then(res=>{
      setLatitude(res.data[0].lat)
      setLongitude(res.data[0].lon)
    })
    .catch(err=>{
      console.log(err);
    })
  }
  useEffect(()=>{
    const setPosition = position =>{
      setLatitude(position.coords.latitude);      
      setLongitude(position.coords.longitude);      

    }
    navigator.geolocation.getCurrentPosition(setPosition);
  },[])
  useEffect(()=>{
      axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely,alerts,current&units=metric&appid=${apiKey}`)
      .then(res=>{
        setResults(res.data.daily)
      })
      .catch(err=>{
        console.log(err);
      })
    },[latitude, longitude])
  return (
      <div>
          <label htmlFor="place">Enter the name of the place</label><br />
          <input type="text" value={place} onChange={e=>{setPlace(e.target.value)}}/> <br/> 
          <button type="submit" className='btn' onClick={handleChange}>Submit</button>
          <div className='report'>
            {
              results.map(obj => {
                var d = new Date();
                d.setTime(obj.dt*1000);
                var bg;
                if(obj.weather[0].main === "Rain"){
                  bg = "../image/rainy-weather.jpg";
                }
                else if(obj.weather[0].main === 'Clouds')
                {
                  bg = "../image/cloudy-weather.jpg";
                }
                else{
                  bg = "../image/clear-weather.jpg";
                }
                return(
                  <div key={obj.dt}  style = {{ background: `url(${bg}) center center/cover no-repeat`, backgroundSize: '100% 100%', color: 'white' }} >
                    <h1>{d.getDate()} {month[d.getMonth()]} {d.getFullYear()}-{day[d.getDay()]}</h1>
                    <br />
                    <p>min Temp: {obj.temp.min} &#8451;</p>                  
                    <p>max Temp: {obj.temp.max} &#8451;</p>                  
                    <p>{obj.weather[0].main}</p>
                    <p>{obj.weather[0].description}</p>
                  </div>
                  )})
                }
          </div>
      </div>
  );
}

export default Weather;
