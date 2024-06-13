async translate(text) {
    let res = await axios.post(`https://translation.googleapis.com/language/translate/v2?key=$AIzaSyAAA0VNdOevLNCj781gGkycuP7fxKO_u7o`,
    { q: text, target: "tr" }  );
    let translation = res.data.data.translations[0].translatedText;  
    return translation;
}