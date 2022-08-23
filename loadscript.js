if (!localStorage.getItem('fork')) localStorage.setItem('fork', '');

const script = document.getElementById('5bscript');
script.src = localStorage.getItem('fork') + '5b.min.js';

document.onreadystatechange = () => {
    if (localStorage.getItem('fork')) {
        document.getElementById('resetmod').style.visibility = 'visible';
    }
}
