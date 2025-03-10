async function getData() 
{
    const countryName = document.getElementById("country-inp").value.trim();
    
    if (countryName === "") 
        {
        alert("Please enter your desired country");
        return;
    }

    const url=`https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

    try {
        const response = await fetch(url);
        if (!response.ok) 
            {
            throw new Error(`${countryName} information could not be fetched: ${response.status}`);
        }

        const json = await response.json();
        const country = json[0]; 
 
        const capital= country.capital ? country.capital[0] : "N/A";
        const population = country.population.toLocaleString();
        const region = country.region;
        const flag = country.flags.png;
        const borders = country.borders || [];

        document.getElementById("country-info").innerHTML = `
            <h2>Country Information</h2>
            <h3>${country.name.common}</h3>
            <p><strong>Capital:</strong> ${capital}</p>
            <p><strong>Population:</strong> ${population}</p>
            <p><strong>Region:</strong> ${region}</p>
            <img src="${flag}" alt="Flag of ${country.name.common}">
        `;

        const bordersSection = document.getElementById("bordering-countries");
        bordersSection.innerHTML = "<h2>Bordering Countries</h2>";

        if (borders.length > 0) 
            {
            const borderResponse =await fetch(`https://restcountries.com/v3.1/alpha?codes=${borders.join(",")}`);
            const borderData = await borderResponse.json();

            borderData.forEach(borderCountry => {
                const borderName = borderCountry.name.common;
                const borderFlag = borderCountry.flags.png;
                bordersSection.innerHTML += `
                    <p>${borderName}</p>
                    <img src="${borderFlag}" alt="Flag of ${borderName}">
                `;
            });
        } else {
            bordersSection.innerHTML += "<p>No bordering countries.</p>";
        }
    } catch (error) {
        document.getElementById("country-info").innerHTML = `<h2>Country Information</h2><p style="color: red;">${error.message}</p>`;
        document.getElementById("bordering-countries").innerHTML = "<h2>Bordering Countries</h2>";
    }
    
}


document.getElementById("search-btn").addEventListener("click", getData);
window.onload = function() {
    document.getElementById('country-inp').value = '';
};
