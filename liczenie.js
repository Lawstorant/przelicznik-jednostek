window.onload = function() {
	function obl() {
		//Dotyczy liczb całkowitych
		//Wczytuję dane i zamieniam je na typ przejściowy - Integer
		//pomijając wejście w systemie dziesiętnym
		let wej = document.getElementById("wejscie").value;
		let po = 0;

		if (wybor1 == 1) po = parseInt(wej, 2);
		else if (wybor1 == 2) po = parseInt(wej, 8);
		else if (wybor1 == 3) po = parseInt(wej, 10);
		else if (wybor1 == 4) po = parseInt(wej, 16);
		else if (wybor1 == 5 || wybor1 == 6) {
			let przed = wej.substr(0, 1); //Zapisuję MSB
			wej = wej.substr(1, wej.length - 1); //Wycinam MSB
			po = parseInt(wej, 2);

			//Jeżeli MSB wskazuje na liczbę ujemną to przeliczam
			//na kod uzupełnień
			if (przed == "1") {
				for (let i = 0; i < wej.length; ++i) {
					przed += "0";
				}
				przed = parseInt(przed, 2);
				if (wybor1 == 5) przed -= 1; //Jeżeli wejście w U1
				po -= przed;
			}
		}

		//Teraz wejście znajduje się w zmiennej "po" jako Integer
		//Przeliczamy wartość na system docelowy, pomijając dziesiętny

		if (wybor2 == 1) po = po.toString(2);
		else if (wybor2 == 2) po = po.toString(8);
		else if (wybor2 == 4) po = po.toString(16).toUpperCase();
		else if (wybor2 == 5 || wybor2 == 6) {
			let baza = +document.getElementById("baza_value").value; //Wczytuję wartość bazy
			let potrzebne = Math.pow(2, baza); //Wartość potrzebna przy obliczaniu kodu uzupełnień
			let po_test = 0;

			//Wartość bezwzględna wejścia, potrzebna do określenia
			//tego, czy baza wystarczy by zapisać daną liczbę
			if (po < 0) po_test = -po;
			else po_test = po;

			//Zależnie od wersji kodu uzupełnień, baza ma inny zakres
			if (wybor2 == 5 && potrzebne - po_test <= potrzebne / 2) po = "Zbyt mała baza!";
			else if (wybor2 == 6 && potrzebne - po_test < potrzebne / 2) po = "Zbyt mała baza!";

			//Jeżeli baza jest adekwatna, to zaczynamy zabawę!
			//Obliczanie U1 lub U2 jest teraz bardzo proste
			//Wartość dodania w U1 i U2 jest taka sama
			else if (po < 0 && wybor2 == 5) {
				po = potrzebne - 1 + po;
				po = po.toString(2);
			} else if (po < 0 && wybor2 == 6) {
				po = potrzebne + po;
				po = po.toString(2);
			} else {
				po = po.toString(2);
				let zera = "";
				for (let i = 0; i < (baza - po.length); ++i) zera += "0";
				po = zera + po;
			}
		}

		//Wypisuję podaną liczbę w systemie określonym przez drugą
		//grupę przycisków
		document.getElementById("wyjscie").value = po;
		if (po == "Zbyt mała baza!") {
			document.getElementById("wyjscie").style.color = "#B00000";
			document.getElementById("wyjscie").style.borderBottom = "3px solid #B00000";
		}

		if (po != "Zbyt mała baza!") kopiowanie = true;
	}

	//--------------------------------------------------------

	function obl2() {
		//Dotyczy ułamków
		//Wczytuję dane i zamieniam je na typ przejściowy - String
		//w systemie dziesiętnym
		let wej = document.getElementById("wejscie").value;
		let po = "";

		if (wybor1 == 8) {
			let liczba1 = wej;
			let liczba2 = 0;
			let liczba3 = 0;

			let y = liczba1.indexOf("."); //Znajduję kropkę
			if (y != -1) {
				//Dzielę liczbę na moduły
				liczba2 = liczba1.substr(y + 1); //Po kropce
				liczba1 = liczba1.substr(0, y); //Przed kropką
			}
			liczba1 = parseInt(liczba1, 2);

			//Zamieniam wartosć po kropce na dziesiętną
			//Tym razem typ zmiennoprzecinkowy nie będzie nam przeszkadzał bo
			//Wejście jest zapisane także dwójkowo co daje nam pewność że wyniki
			//dzielenia da się zapisać w postaci binarnej ze skończonym rozwinięciem
			for (let i = 0; i < liczba2.length; ++i) {
				if (liczba2[i] != "0") liczba3 += 1 / Math.pow(2, i + 1);
			}
			liczba2 = liczba1 + liczba3;
			wej = liczba2.toString();
		}

		//Teraz wejście znajduje się w zmiennej "wej" jako String w (10)
		//Przeliczamy wartość na system docelowy, pomijając dziesiętny

		if (wybor2 == 7) po = wej;
		else if (wybor2 == 8) {
			let liczba1 = wej;
			let dokladnosc = +document.getElementById("baza_value").value;
			let liczba2 = 0;
			let liczba3 = "";

			let y = liczba1.indexOf("."); //Szukam kropki
			if (y != -1) {
				//Dzielę liczbę na moduły
				liczba2 = liczba1.substr(y + 1); //Po kropce
				liczba1 = liczba1.substr(0, y); //Przed kropką
			}

			//Moduł przed kropką zamieniam na system dziesiętny
			liczba1 = parseInt(liczba1, 10);
			liczba1 = liczba1.toString(2);

			if (liczba2) {

				//Pozbywam się typu zmiennoprzecinkowego bo JS słabo go obsługuje
				let jeden = Math.pow(10, liczba2.length);
				liczba2 = parseFloat("0." + liczba2) * jeden;

				//Obliczam teraz wartość dwójkową po przecinku z podaną
				//w bazie dokładnością.
				for (let i = 0; i < dokladnosc; ++i) {
					liczba2 *= 2;
					if (liczba2 >= jeden) {
						liczba3 += "1";
						liczba2 -= jeden;
					} else liczba3 += "0";

					//Jeżeli baza jest większa niż to potrzebne,
					//to przerywam wcześniej pozbywając się nadmiaru zer
					if (liczba2 === 0) dokladnosc = 0;
					if (liczba2 !== 0 && i == dokladnosc - 1) liczba3 += "…";
				}
				po = liczba1 + "." + liczba3; //Łączę moduły
			} else po = liczba1;
		}

		//Wypisuję wartość wejściową w żądanym systemie
		document.getElementById("wyjscie").value = po;
		kopiowanie = true;
	}

	//--------------------------------------------------------

	//Sprawdzam poprawność wszystkich danych, jeżeli nic ze sobą nie koliduje
	//i na wejściu nie podano złych znaków, obliczam wyjście.
	//Liczby dziesiętne i ułamki mają osobne funkcje obliczające
	function czy() {
		kopiowanie = false;
		clearTimeout(czas);

		let styl = document.getElementById("wyjscie");
		styl.style.color = "#000";
		styl.style.borderBottom = "3px solid #009688";

		let wej = document.getElementById("wejscie").value;
		let baza_test = document.getElementById("baza_value").value;
		let pattern = /.*/;

		switch (wybor1) {
			case 1:
				//Dozwolony minus i przynajmniej jedna 1 lub 0
				pattern = /^-?[0-1]+$/;
				break;

			case 2:
				//Dozwolony minus i przynajmniej jedna cyfra z zakresu od 0 do 7
				pattern = /^-?[0-7]+$/;
				break;

			case 3:
				//Dozwolony minus i przynajmniej jedna cyfra z zakresu od 0 do 9
				pattern = /^-?[0-9]+$/;
				break;

			case 4:
				//Dozwolony minus i przynajmniej jedna cyfra z zakresu od 0 do 9 lub litera od a do f
				pattern = /^-?[0-9A-Fa-f]+$/;
				break;

			case 5:
			case 6:
				//Dozwolone przynajmniej dwie cyfry 0 lub 1
				pattern = /^[0-1]{2,}$/;
				break;

			case 7:
				//Dozwolona przynajmniej jedna cyfra z zakresu od 0 do 9,
				//możliwa kropka i przynajmniej jedna cyfra z zakresu od 0 do 9
				pattern = /^[0-9]+\.?[0-9]*$/;
				break;

			case 8:
				//Dozwolona przynajmniej jedna cyfra z zakresu od 0 do 9,
				//możliwa kropka i przynajmniej jedna cyfra z zakresu od 0 do 9
				pattern = /^[0-1]+\.?[0-1]*$/;
				break;
		}

		//Dozwolona jedna cyfra z zakresu od 2 do 9 lub
		//jedna cyfra z zakresu od 1 do 9 i przynajmniej jedna cyfra z zakresu od 0 do 9
		let pattern_baza = /^[2-9]{1}$|^([1-9]{1}[0-9]+)$/;

		let testing2 = pattern_baza.test(baza_test); //Test bazy

		let testing = 0;

		//Jeżeli wejście jest puste zmienna "testing" przyjmuje wartość 2
		//dzięki temu wszystkie testy zakończą się niepowodzeniem i
		//wyjście pozostanie puste
		if (wej.length === 0 || wybor1 === 0) testing = 2;
		else testing = pattern.test(wej);

		//Magia, wiem co tu się dzieje ale nie chce mi się dokładnie opisywać ¯\_(ツ)_/¯
		//Ogólnie chodzi o to by nie obliczać lub nie wyświetlać błędów kiedy nie potrzeba
		if (wybor1 >= 1 && wybor1 <= 6 && wybor2 >= 1 && wybor2 <= 6 && testing === true && testing2 === true) obl();
		else if ((wybor1 == 7 || wybor1 == 8) && (wybor2 == 7 || wybor2 == 8) && testing === true && testing2 === true) obl2();
		else if (wybor1 < 5 && !testing && wej[0] == "-" && wej.length == 1) document.getElementById("wyjscie").value = "";
		else if ((wybor1 == 5 || wybor1 == 6) && !testing && (wej[0] == "1" || wej[0] == "0") && wej.length == 1) {
			document.getElementById("wyjscie").value = "";
		} else if (!testing) {
			styl.value = "Niedozwolony znak!";
			styl.style.color = "#B00000";
			styl.style.borderBottom = "3px solid #B00000";
		} else if (!testing2 || baza_test < 2) {
			styl.style.color = "#B00000";
			styl.style.borderBottom = "3px solid #B00000";
			if (karta == 1) styl.value = "Błędna baza!";
			else styl.value = "Błędna dokładność!";
		} else document.getElementById("wyjscie").value = "";

		//Jezeli wyjście nie jest puste to jego cursor: pointer;
		if (kopiowanie) {
			document.getElementById("wyjscie").style.cursor = "pointer";
		} else {
			document.getElementById("wyjscie").style.cursor = "default";
		}
	}
	//--------------------------------------------------------

	//Pozbawiam przyciski systemu wejścia liczb całkowitych klasy "wciśnięty"
	function rm1() {
		for (let i = 0; i < 8; ++i) {
			button[i].classList.remove("clicked");
		}
	}

	//Pozbawiam przyciski systemu wyjścia liczb całkowitych klasy "wciśnięty"
	//Ukrywam kontrolki bazy dla kodów uzupełnień
	function rm2() {
		for (let i = 8; i < 16; ++i) {
			button[i].classList.remove("clicked");
		}
		document.getElementById("baza").style.display = "none";
	}

	//Przełączanie kart, zmienna x określa którą kartę pokazać
	// x == 0 - Karta liczb całkowitych
	// x == 1 - Karta ułamków
	//Przywracam wartości domyślne danych wejściowych
	function rm3(x) {
		rm1();
		rm2();
		clearTimeout(czas); //Jezeli wyświetla się wiadomość o kopiowaniu, ukrywam ją;
		document.getElementById("wejscie").value = "";
		document.getElementById("wyjscie").value = "";
		document.getElementById("wyjscie").style.borderBottom = "3px solid #009688";
		document.getElementById("wyjscie").style.color = "";
		document.getElementById("wyjscie").style.cursor = "default";

		//Przywracam domyślną wartość bazy i aktywuję przyciski
		document.getElementById("baza_value").value = 8;
		document.getElementById("plus").disabled = "";
		document.getElementById("minus").disabled = "";

		wybor1 = 0;
		wybor2 = 0;
		kopiowanie = false;

		//Ukrywam prziciski ułamków i pokazuję przyciski liczb całkowitych
		//Wysuwam kartę liczb całkowitych i cofam kartę ułamków
		if (x === 0) {
			for (let i = 0; i < button.length; ++i) {
				if (i == 6 || i == 7 || i == 14 || i == 15) button[i].style.display = "none";
				else button[i].style.display = "block";
			}
			document.getElementById("karta1").classList.remove("tyl1");
			document.getElementById("karta2").classList.add("tyl2");
			document.getElementById("baza_tekst").innerHTML = "Baza:";
			karta = 1;
		}

		//Ukrywam prziciski liczb całkowitych i pokazuję przyciski ułamków
		//Wysuwam kartę ułamków i cofam kartę liczb całkowitych
		else {
			for (let i = 0; i < button.length; ++i) {
				if (i == 6 || i == 7 || i == 14 || i == 15) button[i].style.display = "block";
				else button[i].style.display = "none";
			}
			document.getElementById("karta1").classList.add("tyl1");
			document.getElementById("karta2").classList.remove("tyl2");
			document.getElementById("baza_tekst").innerHTML = "Dokładność:";
			karta = 2;
		}
	}

	//Poniższa funckcja odpowiada za zmianę koloru tła przyciśniętego przycisku,
	//określenie wyboru systemów i sprawdzenie poprawności danych
	function klik(przycisk) {
		if (przycisk <= 7) {
			rm1();
			wybor1 = przycisk + 1;
		} else {
			rm2();
			wybor2 = przycisk - 7;
		}

		//Pokazywanie bazy/dokładności przy odpowiednich systemach wyjścia
		if (wybor2 == 5 || wybor2 == 6 || wybor2 == 8) document.getElementById("baza").style.display = "block";
		button[przycisk].classList.add("clicked"); //Kolorowanie przycisku
		czy(); //Sprawdzenie danych
	}

	//------------------------------------------------------------
	//Część globalna. Działania na zmiennych globalnych są szybsze

	let button = document.getElementsByClassName("bt"); //Wczytuję przyciski
	let wybor1 = 0; //Wybór systemu na wejściu
	let wybor2 = 0; //Wybór systemu na wyjściu
	let min = 2; //Minimalna wartość bazy U1, U2 i ułamka binarnego
	let czas; //Do Informacji o schowku
	let karta = 1; //informacje o tym, która karta jest aktualnie wyświetlana
	let kopiowanie = false; //Informacja o możliwości kopiowania

	//Obsługa przycisków systemów liczbowych
	for (let i = 0; i < 16; ++i) {
		button[i].onclick = function() {
			klik(i);
		};
	}

	//Obsługa kart
	document.getElementById("karta1").onclick = function() {
		rm3(0);
	};
	document.getElementById("karta2").onclick = function() {
		rm3(1);
	};

	//Obsługa wartości bazy i sprawdzanie poprawności danych
	document.getElementById("minus").onclick = function() {
		let val = +document.getElementById("baza_value").value;

		//Jeżeli wartość bazy jest większa od minimalnej, pozwalam na jej obniżenie
		if (val > min) document.getElementById("baza_value").value = val - 1;

		//Jeżeli wartość bazy po zmniejszeniu jest równa wartości minimalnej,
		//blokuję przycisk obniżania wartości bazy
		if (val - 1 == min) document.getElementById("minus").disabled = "disabled";
		czy();
	};

	document.getElementById("plus").onclick = function() {
		let val = +document.getElementById("baza_value").value;
		document.getElementById("baza_value").value = val + 1; //Podnoszę wartość bazy

		//Jeżeli wartość bazy po zwiększeniu jest większa od wartości minimalnej,
		//odblokowuję przycisk obniżania wartości bazy
		if (val + 1 > min) document.getElementById("minus").disabled = "";
		czy();
	};

	//Przy ręcznym wprowadzaniu danych sprawdzam ich poprawność
	document.getElementById("baza_value").oninput = function() {
		let val = document.getElementById("baza_value").value;

		val = parseInt(val, 10);

		//Jeżeli podana baza nie jest liczbą to blokuję przyciski
		if (isNaN(val)) {
			document.getElementById("minus").disabled = "disabled";
			document.getElementById("plus").disabled = "disabled";
		} else if (val <= min) {
			document.getElementById("minus").disabled = "disabled";
		}

		//Jeżeli podana baza jest liczbą to odblokowuję przyciski
		if (isNaN(val) === false) {
			if (val > min) document.getElementById("minus").disabled = "";
			document.getElementById("plus").disabled = "";
		}
		czy();
	};
	//Koniec obsługi bazy

	//Na bieżąco sprawdzam wartość wejścia przy jego podawaniu
	document.getElementById("wejscie").oninput = function() {
		czy();
	};

	//Kopiowanie zawartości pola "wyjście" po jego kliknięciu
	document.getElementById("wyjscie").onclick = function() {
		let val = this.value;
		let dl = val.length;
		if (kopiowanie) {
			if (val[dl - 1] == "…") this.value = val.substr(0, val.length - 1);
			this.style.userSelect = "initial";
			this.select();
			let kopiuj = document.execCommand("copy", false);
			this.style.userSelect = "none";
			document.getElementById("glowny").focus();

			//Informacja znika po dwóch sekundach
			if (kopiuj) {
				this.value = "Skopiowano do schowka!";
				let kursor = this.style.cursor;
				let kop = kopiowanie;
				this.style.cursor = "default";
				kopiowanie = false;
				czas = setTimeout(function() {
					document.getElementById("wyjscie").value = val;
					document.getElementById("wyjscie").style.cursor = kursor;
					kopiowanie = kop;
				}, 2000);
			}
		}
	};
};
