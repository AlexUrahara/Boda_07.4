// ============================================
// SCRIPT COMPLETO - INVITACIÓN DE BODA
// ============================================

document.addEventListener('DOMContentLoaded', function () {
  // ----- NAVBAR Y SCROLL -----
  const navbar = document.getElementById('mainNavbar');
  const hero = document.querySelector('header');
  const offcanvasElement = document.getElementById('offcanvasNavbar');
  const backToTop = document.getElementById('backToTop');

  function updateNavbar() {
    // Ajusta el umbral según la altura de tu hero (puedes modificar 730)
    if (window.scrollY > 730) {
      navbar.classList.add('bg-white');
      navbar.classList.remove('bg-transparent');
    } else {
      navbar.classList.add('bg-transparent');
      navbar.classList.remove('bg-white');
    }
  }

  function toggleBackToTop() {
    if (window.scrollY > 300) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  // Estado inicial
  navbar.classList.add('bg-transparent');
  updateNavbar();
  toggleBackToTop();

  window.addEventListener('scroll', function () {
    updateNavbar();
    toggleBackToTop();
  });

  // Cerrar offcanvas al hacer clic en enlaces
  const navLinks = document.querySelectorAll('.offcanvas-body .nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function () {
      const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasElement);
      if (offcanvasInstance) {
        offcanvasInstance.hide();
      }
    });
  });

  // Botón volver arriba
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ----- PARTÍCULAS DEL HÉROE -----
  initParticles();

  // ----- CONTADOR REGRESIVO -----
  iniciarContador();

  // ----- REPRODUCTOR DE MÚSICA -----
  initMusica();

  // ----- OBSERVADOR PARA LA IMAGEN DE HISTORIA -----
  (function () {
    const imagenHistoria = document.getElementById('historiaImagen');
    if (imagenHistoria) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          } else {
            entry.target.classList.remove('visible');
          }
        });
      }, { threshold: 0.7 });
      observer.observe(imagenHistoria);
    }
  })();

  // ----- LIGHTBOX PARA VESTIMENTA -----
  initLightbox();

  // ----- OBSERVADOR PARA ITINERARIO (TIMELINE) -----
  initTimelineObserver();

  // ----- CARRUSEL DE ITINERARIO (FOTOS FLOTANTES) -----
  initCarruselItinerario();

  // ----- FLOTACIÓN DE IMÁGENES EN MESA DE REGALOS -----
  initFloatImages();

  // ----- CARRUSEL DE FOTOS CON FRASE (SECCIÓN FINAL) -----
  initCarruselFrase();

  // ----- FORMULARIO RSVP POR WHATSAPP -----
  initRSVPForm();

  // ----- OBSERVADOR PARA SECCIÓN NOVIOS -----
  initNoviosObserver();   // <--- ESTA LÍNEA ES LA QUE FALTABA

  // ----- OBSERVADOR PARA SECCIÓN PADRINOS -----
  initPadrinosObserver();

  console.log('✨ Todos los módulos cargados correctamente');
});

// ============================================
// FUNCIONES ESPECÍFICAS
// ============================================

// ---------- PARTÍCULAS ----------
function initParticles() {
  const particlesContainer = document.getElementById('particles');
  if (!particlesContainer) return;

  const particleCount = 36;
  particlesContainer.innerHTML = '';

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const size = Math.random() * 12 + 3;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const duration = Math.random() * 10 + 14;
    const delay = -Math.random() * 8;

    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${posX}%;
      top: ${posY}%;
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
      opacity: ${Math.random() * 0.5 + 0.3};
      background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3});
    `;

    particlesContainer.appendChild(particle);
  }
}

// ---------- CONTADOR REGRESIVO ----------
function iniciarContador() {
  // ⬇️⬇️⬇️ CAMBIA LA FECHA DE LA BODA AQUÍ (formato ISO: AAAA-MM-DDTHH:MM:SS) ⬇️⬇️⬇️
  const fechaBoda = new Date('2027-06-29T00:00:00').getTime(); // Ejemplo: 29 de junio de 2027

  function actualizarContador() {
    const ahora = new Date().getTime();
    const distancia = fechaBoda - ahora;

    if (distancia < 0) {
      document.getElementById('dias').innerText = '00';
      document.getElementById('horas').innerText = '00';
      document.getElementById('minutos').innerText = '00';
      document.getElementById('segundos').innerText = '00';
      return;
    }

    const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

    document.getElementById('dias').innerText = dias < 10 ? '0' + dias : dias;
    document.getElementById('horas').innerText = horas < 10 ? '0' + horas : horas;
    document.getElementById('minutos').innerText = minutos < 10 ? '0' + minutos : minutos;
    document.getElementById('segundos').innerText = segundos < 10 ? '0' + segundos : segundos;
  }

  actualizarContador();
  setInterval(actualizarContador, 1000);
}

// ---------- REPRODUCTOR DE MÚSICA ----------
function initMusica() {
  const playlist = [
    'musicas/paulyudin wedding valentines day.mp3',
    'musicas/paulyudin wedding.mp3',
    'musicas/the mountain wedding.mp3'
  ];

  let currentIndex = 0;
  let isPlaying = false;
  const audio = new Audio(playlist[currentIndex]);
  audio.loop = false;
  audio.preload = 'auto';

  const playPauseBtn = document.getElementById('musicaPlayPause');
  const prevBtn = document.getElementById('musicaPrev');
  const nextBtn = document.getElementById('musicaNext');
  const icon = playPauseBtn.querySelector('i');
  const cancionSpan = document.getElementById('musicaCancionActual');
  const tiempoActualSpan = document.getElementById('musicaTiempoActual');
  const duracionSpan = document.getElementById('musicaDuracion');
  const barraProgreso = document.getElementById('musicaBarra');
  const progresoDiv = document.getElementById('musicaProgreso');

  function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function updateSongName() {
    const nombreArchivo = playlist[currentIndex].split('/').pop().replace('.mp3', '');
    const nombreLegible = nombreArchivo.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    cancionSpan.textContent = nombreLegible;
  }
  updateSongName();

  audio.addEventListener('loadedmetadata', () => {
    duracionSpan.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      const porcentaje = (audio.currentTime / audio.duration) * 100;
      progresoDiv.style.width = `${porcentaje}%`;
      tiempoActualSpan.textContent = formatTime(audio.currentTime);
    }
  });

  audio.addEventListener('ended', nextSong);

  function togglePlay() {
    if (isPlaying) {
      audio.pause();
      icon.className = 'bi bi-play-circle';
    } else {
      audio.play().catch(e => console.log('Error al reproducir:', e));
      icon.className = 'bi bi-pause-circle';
    }
    isPlaying = !isPlaying;
  }

  function nextSong() {
    currentIndex = (currentIndex + 1) % playlist.length;
    audio.src = playlist[currentIndex];
    audio.load();
    updateSongName();
    if (isPlaying) {
      audio.play().catch(e => console.log('Error al reproducir:', e));
    }
    progresoDiv.style.width = '0%';
    tiempoActualSpan.textContent = '0:00';
  }

  function prevSong() {
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    audio.src = playlist[currentIndex];
    audio.load();
    updateSongName();
    if (isPlaying) {
      audio.play().catch(e => console.log('Error al reproducir:', e));
    }
    progresoDiv.style.width = '0%';
    tiempoActualSpan.textContent = '0:00';
  }

  barraProgreso.addEventListener('click', (e) => {
    const rect = barraProgreso.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const porcentaje = (clickX / width) * 100;
    if (audio.duration) {
      audio.currentTime = (porcentaje / 100) * audio.duration;
    }
  });

  playPauseBtn.addEventListener('click', togglePlay);
  nextBtn.addEventListener('click', nextSong);
  prevBtn.addEventListener('click', prevSong);

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !e.target.matches('input, textarea, button')) {
      e.preventDefault();
      togglePlay();
    }
  });

  window.addEventListener('beforeunload', () => {
    audio.pause();
  });

  // Intento de reproducción automática (silenciosa si el navegador lo bloquea) 
// audio.play().then(() => {
//   isPlaying = true;
//   icon.className = 'bi bi-pause-circle';
// }).catch(() => {
//   console.log('Autoplay bloqueado, esperando interacción del usuario');
//   const startOnInteraction = () => {
//     audio.play().then(() => {
//       isPlaying = true;
//       icon.className = 'bi bi-pause-circle';
//     }).catch(e => console.log('Error al reproducir:', e));
//     document.removeEventListener('click', startOnInteraction);
//     document.removeEventListener('touchstart', startOnInteraction);
//   };
//   document.addEventListener('click', startOnInteraction, { once: true });
//   document.addEventListener('touchstart', startOnInteraction, { once: true });
// });
}

// ---------- LIGHTBOX PARA VESTIMENTA ----------
function initLightbox() {
  const galerias = {
    caballeros: [
      'imagenes/vestimenta/hombre01.png',
      'imagenes/vestimenta/hombre02.png',
      'imagenes/vestimenta/hombre03.png',
      'imagenes/vestimenta/hombre04.png'
    ],
    damas: [
      'imagenes/vestimenta/mujer01.png',
      'imagenes/vestimenta/mujer02.png',
      'imagenes/vestimenta/mujer03.png',
      'imagenes/vestimenta/mujer04.png'
    ]
  };

  const modal = document.getElementById('lightboxModal');
  const overlay = document.querySelector('.lightbox-overlay');
  const imagen = document.getElementById('lightboxImagen');
  const btnCerrar = document.getElementById('lightboxCerrar');
  const btnPrev = document.getElementById('lightboxPrev');
  const btnNext = document.getElementById('lightboxNext');

  let currentGallery = [];
  let currentIndex = 0;

  function abrirLightbox(gallery, index) {
    currentGallery = gallery;
    currentIndex = index;
    imagen.src = currentGallery[currentIndex];
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function cerrarLightbox() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function cambiarImagen(direccion) {
    imagen.classList.add('fade-out');
    setTimeout(() => {
      currentIndex += direccion;
      if (currentIndex < 0) currentIndex = currentGallery.length - 1;
      if (currentIndex >= currentGallery.length) currentIndex = 0;
      imagen.src = currentGallery[currentIndex];
      setTimeout(() => {
        imagen.classList.remove('fade-out');
      }, 50);
    }, 150);
  }

  const botonesEjemplo = document.querySelectorAll('.btn-ejemplo');
  botonesEjemplo.forEach((btn, idx) => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const esCaballeros = idx === 0;
      const gallery = esCaballeros ? galerias.caballeros : galerias.damas;
      abrirLightbox(gallery, 0);
    });
  });

  btnCerrar.addEventListener('click', cerrarLightbox);
  overlay.addEventListener('click', cerrarLightbox);
  btnPrev.addEventListener('click', () => cambiarImagen(-1));
  btnNext.addEventListener('click', () => cambiarImagen(1));

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      cerrarLightbox();
    }
  });
}

// ---------- OBSERVADOR PARA TIMELINE (ITINERARIO) ----------
function initTimelineObserver() {
  const items = document.querySelectorAll('.timeline-item');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, { threshold: 0.9, rootMargin: '0px 0px 0px 0px' });

  items.forEach(item => observer.observe(item));
}

// ---------- CARRUSEL DE ITINERARIO ----------
function initCarruselItinerario() {
  const carrusel = document.querySelector('.carrusel-flotante');
  if (!carrusel) return;

  const fotos = document.querySelectorAll('.foto-carrusel');
  let index = 0;

  function cambiarFoto() {
    fotos.forEach(foto => foto.classList.remove('active'));
    index = (index + 1) % fotos.length;
    fotos[index].classList.add('active');
  }

  setInterval(cambiarFoto, 4000);
}

// ---------- FLOTACIÓN DE IMÁGENES EN MESA DE REGALOS ----------
function initFloatImages() {
  const images = document.querySelectorAll('.mesa-imagen');
  if (!images.length) return;

  images.forEach(img => {
    img.style.animation = 'none';
    void img.offsetWidth;
    const delay = Math.random() * 2;
    const duration = 2.5 + Math.random() * 1;
    img.style.animation = `float ${duration}s ease-in-out infinite ${delay}s`;
  });
}

// ---------- CARRUSEL DE FOTOS CON FRASE (SECCIÓN FINAL) ----------
function initCarruselFrase() {
  const imagenes = document.querySelectorAll('.foto-frase-img');
  if (!imagenes.length) return;

  let index = 0;

  function cambiarImagen() {
    imagenes.forEach(img => img.classList.remove('active'));
    index = (index + 1) % imagenes.length;
    imagenes[index].classList.add('active');
  }

  setInterval(cambiarImagen, 4000);
}

// ---------- FORMULARIO RSVP POR WHATSAPP ----------
function initRSVPForm() {
  const form = document.getElementById('rsvp-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const confirmacion = document.getElementById('confirmacion').value;
    const asistentes = document.getElementById('asistentes').value;

    if (!nombre || !apellidos || !confirmacion || !asistentes) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    // Construir mensaje
    const mensaje = `Hola soy, ${nombre} ${apellidos}, *${confirmacion}* a la fiesta de celebración en el local, iré con ${asistentes} ${asistentes === '1' ? 'persona' : 'personas'} a celebrar con ustedes!`;

    // Número de WhatsApp (código de país 52 para México)
    const numero = '5544705244';
    const url = `https://wa.me/52${numero}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, '_blank');
  });
}

// ---------- OBSERVADOR PARA SECCIÓN NOVIOS ----------
function initNoviosObserver() {
  const bloques = document.querySelectorAll('.novios-bloque');
  if (!bloques.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        // Si quieres que se oculten al salir, mantén esta línea
        entry.target.classList.remove('visible');
      }
    });
  }, { 
    threshold: 0.2,        // Se activa cuando el 20% del bloque es visible
    rootMargin: '50px'      // Se activa 50px antes de llegar
  });

  bloques.forEach(bloque => observer.observe(bloque));

  // Verificar si algún bloque ya es visible al cargar la página
  bloques.forEach(bloque => {
    const rect = bloque.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      bloque.classList.add('visible');
    }
  });
}

// ---------- OBSERVADOR PARA SECCIÓN PADRINOS ----------
function initPadrinosObserver() {
  const padrinosCards = document.querySelectorAll('.padrino-card');
  if (!padrinosCards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }  
    });
  }, { threshold: 0.3, rootMargin: '0px' });

  padrinosCards.forEach(card => observer.observe(card));
}