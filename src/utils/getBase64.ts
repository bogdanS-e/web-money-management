function getBase64(file: File, cb: (base64: string) => void) {
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    if (typeof reader.result === 'string') {
      cb(reader.result);
    }
  };
  reader.onerror = function (error) {
    console.log('Error: ', error);
  };
}

export default getBase64;