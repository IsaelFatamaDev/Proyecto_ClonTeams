var spreadsheetId = '1kWeQK5xRP1Fry9POiGagId8TFm2xqxwwwdZn2baulJI', hoja = 'vallegrande';

function extractDriveImageUrl(cellValue) {
    var imageRegex = /https:\/\/drive\.google\.com\/open\?id=([\w-]+)/;
    var videoRegex = /https:\/\/drive\.google\.com\/file\/d\/([\w-]+)\/view/;
    var imageMatches = cellValue.match(imageRegex);
    var videoMatches = cellValue.match(videoRegex);
    if (imageMatches && imageMatches.length > 1) {
        var imageId = imageMatches[1];
        return `https://drive.google.com/file/d/${imageId}/preview`; // Cambio aquí
    }
    if (videoMatches && videoMatches.length > 1) {
        var videoId = videoMatches[1];
        return `https://drive.google.com/file/d/${videoId}/preview`;
    }
    return '';
}
var apiKey = 'AIzaSyDnWjAbEwleOjTecK8wD8ifbasGkx7LONE', url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${hoja}?key=${apiKey}`;

fetch(url)
    .then(response => response.json())
    .then(data => {
        var newsHTML = '';
        if (data.values && data.values.length > 0) {
            for (var i = 1; i < data.values.length; i++) {
                var fila = data.values[i];
                var titulo = fila[0];
                var descripcion = fila[1];
                var hora = fila[2];
                var usuario = fila[3];
                var categoria = fila[4];

                newsHTML += `<tr>
                <td>${titulo}</td>
                <td>${hora}</td>
                <td>${usuario}</td>
                <td>${categoria}</td>
                <td>
                    <textarea class="form-control" rows="3" readonly>${descripcion}</textarea>
                </td>
            </tr>`;
            }
        } else {
            newsHTML = '<p>No se encontraron resultados.</p>';
        }
        document.getElementById('newsContainer').innerHTML = newsHTML;
    })
    .catch(error => console.error('Error al obtener los datos:', error));