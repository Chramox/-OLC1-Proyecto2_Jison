package main

import(
	"fmt"
	"net/http"
	"html/template"
)

func index(w http.ResponseWriter, r *http.Request)  {
	template, err := template.ParseFiles("../FrontEnd/Interfaz.html")
	if err != nil {
		fmt.Fprintf(w, "PAGINA NO ENCONTRADA")
	}else{
		template.Execute(w,nil)
	}
}

func main()  {
	http.HandleFunc("/", index)
	fmt.Println("HOla mundo")
	http.ListenAndServe(":8080",nil)
}