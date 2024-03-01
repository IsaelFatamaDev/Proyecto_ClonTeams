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

var apiKey = 'AIzaSyDnWjAbEwleOjTecK8wD8ifbasGkx7LONE';
var url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${hoja}?key=${apiKey}`;

fetch(url)
	.then(response => response.json())
	.then(data => {
		var newsHTML = '';
		if (data.values && data.values.length > 0) {
			for (var i = 1; i < data.values.length; i++) {
				var fila = data.values[i];
				var titulo = fila[0];
				var descripcion = fila[1];
				var fechaCompleta = fila[2];
				var categoria = fila[4];
				var fecha = fechaCompleta ? fechaCompleta.split(',')[0].trim() : '';
				var indexCodigo = descripcion.indexOf('Código');
				if (indexCodigo !== -1) {
					descripcion = descripcion.substring(0, indexCodigo);
				}

				descripcion = descripcion.replace(/\*{2}(.*?)\*{2}/g, '<strong>$1</strong>');
				descripcion = descripcion.replace(/\* (.*?)\n/g, '<li class="listas">$1</li>');
				descripcion = `<ul>${descripcion}</ul>`;

				newsHTML += `<tr>
                <td>${i}</td> <!-- Número de fila aumentado en 1 -->
                <td>${titulo}</td>
                <td>${fecha}</td> <!-- Mostrar solo la fecha -->
                <td>${categoria}</td>
                <td>
                    ${descripcion}
                </td>
            </tr>`;
			}
		} else {
			newsHTML = '<p>No se encontraron resultados.</p>';
		}
		document.getElementById('newsContainer').innerHTML = newsHTML;
	})
	.catch(error => console.error('Error al obtener los datos:', error));
