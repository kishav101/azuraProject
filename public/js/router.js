import { setupAddVehicleHandler } from './captureVehicleForm.js';
import { fetchAndDisplayVehicles } from './displayVehicleForm.js'
import { setupSearchHandler } from './displayVehicleForm.js'


document.addEventListener('click', (e) => {
    const { target } = e;
    if (!target.matches('nav a')) return;
    e.preventDefault();
    urlRoute(e);
});

const setActiveNav = () => {
    const currentPath = window.location.pathname;
    document.querySelectorAll('nav a').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
};

const urlRoutes = {
    404: {
        template: "/templates/404.html",
        title: "",
        description: ""
    },
    "/": {
        template: "/templates/Home/home.html",
        title: "",
        description: ""
    },
    "/viewVehicles": {
        template: "/templates/ViewVehicles/viewVehicles.html",
        title: "",
        description: "",
    },

}

const urlRoute = (event) => {
    event.preventDefault();
    const path = event.target.getAttribute('href');
    const currentPath = window.location.pathname;
    const forceReload = event.target.dataset.reload === "true";

    if (path === currentPath && forceReload) {
        urlLocationHandler();
    } else if (path !== currentPath) {
        window.history.pushState({}, "", path);
        urlLocationHandler();
    }
};



const urlLocationHandler = async () => {
    let location = window.location.pathname;
    if (location.length == 0) {
        location = "/"
    }

    const route = urlRoutes[location] || urlRoutes[404];
    const html = await fetch(route.template).then((response) => response.text());
    document.getElementById('content').innerHTML = html;

    if (location === '/') {
        setupAddVehicleHandler();
    }
    if (location === "/viewVehicles") {
        fetchAndDisplayVehicles();
        setupSearchHandler();
    }

    setActiveNav();
};

window.onpopstate = urlLocationHandler;
window.route = urlRoute;

urlLocationHandler();

