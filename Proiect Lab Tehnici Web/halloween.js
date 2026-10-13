window.onload = function () {

    let recenzii_lasate = JSON.parse(localStorage.getItem("recenzii_lasate")) || [];
    let sesiune = JSON.parse(localStorage.getItem("sesiune")) || null;

    desen_bara("#f5c518");

    let buton_recenzii = document.getElementById("submit");
    let buton_afisare = document.getElementById("lista_recenzii");
    let text_recenzie = document.getElementById("recenzie")
    let numar_stele = document.getElementById("stele");
    let container = document.getElementById("container");

    for (let i = 0; i < recenzii_lasate.length; i++) { /*afisarea recenziilor recente la incarcarea paginii*/
        let sectiune = document.createElement("section");
        let nr_stele = document.createElement("p");
        let paragraf = document.createElement("p");
        let autor = document.createElement("p");
        let buton_delete = document.createElement("button");
        let id_del = recenzii_lasate[i].id;

        nr_stele.textContent = "⭐".repeat(recenzii_lasate[i].stele);
        paragraf.textContent = recenzii_lasate[i].text;
        autor.textContent = recenzii_lasate[i].user;

        sectiune.classList.add("rec_proprii");

        buton_delete.innerText = "Sterge";

        buton_delete.onclick = function () {/*logica buton delete recenzii (pentru butonul aplicat recenziilor afisate dupa reincarcarea paginii*/
            if (!sesiune || !sesiune.username) {
                alert("Trebuie sa fii logat pentru a face asta!");
                return;
            }
            if (recenzii_lasate[i].user !== sesiune.username || recenzii_lasate[i].parola !== sesiune.parola) {
                alert("Ai voie sa stergi doar propriile tale recenzii!");
                return;
            }

            sectiune.remove();

            let id_delete = recenzii_lasate[i].id;
            recenzii_lasate = recenzii_lasate.filter(el => el.id !== id_del);
            localStorage.setItem("recenzii_lasate", JSON.stringify(recenzii_lasate));

            desen_bara("#f5c518");
        }

        sectiune.appendChild(autor);
        sectiune.appendChild(nr_stele);
        sectiune.appendChild(paragraf);
        sectiune.appendChild(buton_delete);
        container.appendChild(sectiune);
    }

    buton_recenzii.onclick = function () {/*logica buton submit/creare recenzii*/

        let nr_st = Number(numar_stele.value);

        if (text_recenzie.value.trim() == "" || isNaN(nr_st) || nr_st < 1 || nr_st > 5) {
            alert("Eroare: Va rugam introduceti o recenzie valida");
            return;
        }

        let recenzie = document.createElement("section");
        let stele = document.createElement("p");
        let paragraf_recenzie = document.createElement("p");
        let buton_delete = document.createElement("button");
        let autor = document.createElement("p");
        let id_recenzie = Date.now();

        buton_delete.innerText = "Sterge";

        buton_delete.onclick = function () {

            let r = recenzii_lasate.find(el => el.id == id_recenzie);

            if (!sesiune || !sesiune.username) {
                alert("Trebuie sa fii logat pentru a face asta!");
                return;
            }

            if (sesiune.username !== autor.textContent || r.parola !== sesiune.parola) {
                alert("Ai voie sa stergi doar propriile recenzii!");
                return;
            }

            recenzie.remove();

            recenzii_lasate = recenzii_lasate.filter(el => el.id !== id_recenzie);
            localStorage.setItem("recenzii_lasate", JSON.stringify(recenzii_lasate));

            desen_bara("#f5c518");
        }

        stele.textContent = "⭐".repeat(Number(numar_stele.value));
        paragraf_recenzie.textContent = text_recenzie.value;
        autor.textContent = sesiune.username;

        recenzie.appendChild(autor);
        recenzie.appendChild(stele);
        recenzie.appendChild(paragraf_recenzie);
        recenzie.appendChild(buton_delete);
        container.appendChild(recenzie);

        recenzie.classList.add("rec_proprii");

        recenzii_lasate.push({ id: id_recenzie, user: sesiune.username, parola: sesiune.parola, stele: Number(numar_stele.value), text: text_recenzie.value });

        localStorage.setItem("recenzii_lasate", JSON.stringify(recenzii_lasate));

        alert("Recenzie incarcata cu succes");

        desen_bara("#f5c518");
    }

    /*logica pt submit recenzii cu tasta Enter*/

    text_recenzie.addEventListener("keydown", function(event){
        if(event.key == "Enter") {
            event.preventDefault();
            buton_recenzii.click();
        }
    });

    numar_stele.addEventListener("keydown", function(event){
        if(event.key == "Enter") {
            event.preventDefault();
            buton_recenzii.click();
        }
    });

    buton_afisare.onclick = function () {/*logica buton ascundere/afisare recenzii recente*/

        let lista = document.getElementsByClassName("rec_proprii");

        if (lista.length == 0) return;
        let ascunse = window.getComputedStyle(lista[0]).display == "none";

        for (let i = 0; i < lista.length; i++)
            lista[i].style.display = ascunse ? "block" : "none";

        buton_afisare.innerText = !ascunse ? "Vezi recenziile" : "Ascunde recenziile";
    }

    /* cod recenzii   /\     */
    /*                ||     */


    /* cod login */
    let feedback = document.getElementById("feedback");
    let buton_login = document.getElementById("buton_login");
    let buton_logout = document.getElementById("buton_logout");
    let login = document.getElementById("login");

    function update() {/*functie care seteaza vizibilitatea sectiunii corespunzatoare bazate pe starea sesiunii*/
        if (sesiune && sesiune.username) {
            feedback.style.display = "flex";
            login.style.display = "none";
            buton_recenzii.style.display = "inline-block";
        } else {
            feedback.style.display = "none";
            login.style.display = "flex";
            buton_recenzii.style.display = "none";
        }
    }

    buton_login.onclick = function () {
        let username = document.getElementById("username").value.trim();
        let parola = document.getElementById("parola").value.trim();

        if (username === "" || parola === "") {
            alert("Informatiile introduse sunt invalide!")
            return;
        }

        sesiune = {
            username: username,
            parola: parola,
            loggedIn: true
        };

        localStorage.setItem("sesiune", JSON.stringify(sesiune));

        alert("Autentificat cu succes!");

        update();

    }

    buton_logout.onclick = function () {
        localStorage.removeItem("sesiune");
        sesiune = null;
        update();
    }

    update();

    /* cod bara rating */

    function rating_medie() {/*calculul rating-ului mediu bazat pe recenziile lasate*/
        if (recenzii_lasate.length == 0) return 18 / 4;
        let total = 18;

        for (let i = 0; i < recenzii_lasate.length; i++) {
            total += recenzii_lasate[i].stele;
        }

        return total / (recenzii_lasate.length + 4);
    }

    function desen_bara(culoare) {/*desenarea barii de rating*/
        let canvas = document.getElementById("bara_rating");
        let ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let avg = rating_medie();
        let procent = avg / 5;

        ctx.fillStyle = "#ccc";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = culoare;
        ctx.fillRect(0, 0, canvas.width * procent, canvas.height);


        ctx.fillStyle = "#000";
        ctx.font = "16px Arial";
        ctx.fillText(avg.toFixed(2) + " / 5", canvas.width / 2 - 25, canvas.height - 6);
    }

    let buton_culoare = document.getElementById("culoare");
    let interval = null;

    buton_culoare.onclick = function() {/*interval pentru schimbarea culorii barii de rating*/
        if (!interval) {
            buton_culoare.textContent = "Opreste schimbarea culorii";
            
            interval = setInterval(function() {
                let culoare = culoare_random();
                desen_bara(culoare);
            }, 2500);
        }else {
            clearInterval(interval);
            buton_culoare.textContent = "Schimba culoarea barii!";
            desen_bara("#f5c518");
            interval = null;
        }
    }

    function culoare_random() {/*alegerea culorii barii de rating*/
        let red = Math.floor(Math.random() * 256);
        let green = Math.floor(Math.random() * 256);
        let blue = Math.floor(Math.random() * 256);

        return `rgb(${red}, ${green}, ${blue})`
    }
}