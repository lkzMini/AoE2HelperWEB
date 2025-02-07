document.addEventListener('DOMContentLoaded', () => {
  const selectCivilizacion = document.getElementById('civilizacion-select');
  const infoBox = document.getElementById('informacion-civilizacion');

  // Cargar los datos de civilizaciones
  fetch('/data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // Ordenar el array de civilizaciones alfabéticamente
      data.sort((a, b) => a.civilizacion.localeCompare(b.civilizacion, 'es'));

      // Rellenar el menú desplegable con las civilizaciones ordenadas
      data.forEach(civ => {
        const option = document.createElement('option');
        option.value = civ.civilizacion;
        option.textContent = civ.civilizacion;
        selectCivilizacion.appendChild(option);
      });

      // Mostrar la información al seleccionar una civilización
      selectCivilizacion.addEventListener('change', () => {
        const selectedCiv = selectCivilizacion.value;

        if (!selectedCiv) {
          infoBox.innerHTML = '<p>Selecciona una civilización para ver sus estrategias.</p>';
          return;
        }

        const civData = data.find(civ => civ.civilizacion === selectedCiv);

        if (civData) {
          infoBox.innerHTML = `
            <h2>${civData.civilizacion}</h2>
            <p><strong>Feudal:</strong> ${civData.estrategias.feudal}</p>
            <p><strong>Castillos:</strong> ${civData.estrategias.castillos}</p>
            <p><strong>Imperial:</strong> ${civData.estrategias.imperial}</p>
            <p><strong>Respuesta:</strong> ${civData.respuesta}</p>
          `;
        }
      });
    })
    .catch(error => {
      console.error('Error específico al cargar data.json:', error);
      infoBox.innerHTML = '<p>Error al cargar las civilizaciones.</p>';
    });

  // Agregar manejo de pestañas
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  const selectBuild = document.getElementById('build-select');
  const infoBoxBuild = document.getElementById('informacion-build');

  // Manejo de pestañas
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.dataset.tab;
      
      // Actualizar botones
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Actualizar contenido
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === tabId) {
          content.classList.add('active');
        }
      });
    });
  });

  // Cargar datos de build orders
  fetch('/build-orders.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      data.forEach(build => {
        const option = document.createElement('option');
        option.value = build.nombre;
        option.textContent = build.nombre;
        selectBuild.appendChild(option);
      });

      selectBuild.addEventListener('change', () => {
        const selectedBuild = selectBuild.value;

        if (!selectedBuild) {
          infoBoxBuild.innerHTML = '<p>Selecciona un Build Order para ver los pasos.</p>';
          return;
        }

        const buildData = data.find(build => build.nombre === selectedBuild);

        if (buildData) {
          infoBoxBuild.innerHTML = `
            <h2>${buildData.nombre}</h2>
            <p>${buildData.descripcion}</p>
            <ol class="build-steps">
              ${buildData.pasos.map(paso => `<li>${paso}</li>`).join('')}
            </ol>
            <div class="build-notes">
              <strong>Notas:</strong> ${buildData.notas}
            </div>
          `;
        }
      });
    })
    .catch(error => {
      console.error('Error específico al cargar build-orders.json:', error);
      infoBoxBuild.innerHTML = '<p>Error al cargar los build orders.</p>';
    });
});
