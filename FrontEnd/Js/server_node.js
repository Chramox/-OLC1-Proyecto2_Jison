//COMUNICACION CON LA GRAMATICA PARA QUE DEVUELVA EL AST
//TODO: CONFIGURAR BIEN LA PINCHE COMUNICACION
async function enviarData(txt) {
    url = "http://localhost:3000/parser";
    const data = { text: txt };
    const ast = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .catch((error) => console.error("Error:", error))
      .then((response) => {
        console.log("Success:", response.message);
        return response.AST;
      });
    return ast;
  }