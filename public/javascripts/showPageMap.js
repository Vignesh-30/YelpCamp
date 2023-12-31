mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: campground.geometry.coordinates,
    zoom: 10,
});

new mapboxgl.Marker({
    color: "grey",
}).setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h3>${campground.title}</h3><p>${campground.location}</p>`)
    )
    .addTo(map);



map.addControl( new mapboxgl.NavigationControl(), 'top-right');

