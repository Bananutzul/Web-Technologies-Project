/* cod recomandari */
window.onload = function () {


    let buton_recomandare = document.querySelector("button");

    buton_recomandare.addEventListener("click", function(event) {

        event.preventDefault();
        event.stopPropagation();/*prevenim trimiterea default a formularului*/

        let rec = new XMLHttpRequest();
        rec.open("GET", "filme.json", true);

        rec.onreadystatechange = function () {/*cerere AJAX pentru a prelua filmele din fisierul json*/
            if (rec.readyState == 4)
                if (rec.status == 200) {
                    let filme = JSON.parse(rec.responseText);

                    let titlu_ales = document.getElementById("titlu").value.trim().toLowerCase();
                    let an = Number(document.getElementById("an").value);

                    let filme_filtrate = filme;
                    let titlu_regex = /^[a-zA-Z0-9\s]+$/;/*regex pentru verificarea validitatii numelui introdus*/

                    if (titlu_ales && an) {
                        filme_filtrate = filme.filter(film => film.nume.toLowerCase() == titlu_ales && Number(film.an) == an);
                    } else if (titlu_ales) {

                        if (!titlu_regex.test(titlu_ales)) {
                            alert("Titlul contine caractere nepermise!");
                            return;
                        }

                        filme_filtrate = filme.filter(film => film.nume.toLowerCase() == titlu_ales);
                    } else if (an) {
                        filme_filtrate = filme.filter(film => Number(film.an) <= an);
                    }

                    if (filme_filtrate.length == 0) {
                        alert("Nu au fost gasite filme dupa cautarea dvs. Va vom oferi o alta recomandare");
                        filme_filtrate = filme;
                    }

                    let index = Math.floor(Math.random() * filme_filtrate.length);
                    let film = filme_filtrate[index];

                    let link = document.createElement("a");

                    link.innerText = film.url;
                    link.href = film.url;
                    link.target = "_blank";

                    document.getElementById("rezultat").innerText = film.nume + "       " + film.an + "       " + film.rating + "     ";

                    document.getElementById("rezultat").appendChild(link);
                } else {
                    alert("Error status: " + rec.status);
                }
        };

        rec.send();
    });



}
