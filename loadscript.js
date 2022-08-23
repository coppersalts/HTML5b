const script = document.getElementById('5bscript');
script.src = localStorage.getItem('script') || '5b.min.js';

document.onreadystatechange = () => {
    if (localStorage.getItem('script') && localStorage.getItem('script') != '5b.js') {
        document.getElementById('resetmod').style.visibility = 'visible';
    }
}