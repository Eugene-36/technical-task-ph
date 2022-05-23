(function () {
  /*
   * Secondary functions
   * */
  function ajax(params) {
    var xhr = new XMLHttpRequest();
    var url = params.url || '';
    var body = params.body || '';
    var success = params.success;
    var error = params.error;

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(body);
    xhr.onload = function () {
      if (
        xhr.readyState === 4 &&
        xhr.status === 200 &&
        typeof success === 'function'
      ) {
        success(xhr.response);
      } else if (
        xhr.readyState === 4 &&
        xhr.status !== 200 &&
        typeof error === 'function'
      ) {
        error(xhr.response);
      }
    };
    xhr.onerror = error || null;
  }

  /*
   * Validation
   * */
  function checkRegExp(pattern, message, value) {
    // console.log('message', message);
    // console.log('pattern', pattern);
    // console.log('value', value);

    return pattern.test(value) ? true : message;
  }

  var validations = {
    firstName: [
      checkRegExp.bind(
        null,
        /^[A-Zа-я]{2,}$/i,
        'Field may contain only letters and not be less than 2 letters'
      ),
      checkRegExp.bind(
        null,
        /^[A-Zа-я]{2,64}$/i,
        'Field may contain only letters and not be more than 64 letters'
      ),
    ],
    lastName: [
      checkRegExp.bind(
        null,
        /^[A-Zа-я]{2,}$/i,
        'Field may contain only letters and not be less than 2 letters'
      ),
      checkRegExp.bind(
        null,
        /^[A-Zа-я]{2,64}$/i,
        'Field may contain only letters and not be more than 64 letters'
      ),
    ],
    email: [
      checkRegExp.bind(
        null,
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please enter valid email'
      ),
    ],
    phone: [
      checkRegExp.bind(null, /^[0-9]{8}$/, 'Field may contain only 8 digits'),
    ],
    password: [
      checkRegExp.bind(
        null,
        /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\!\@\#\$\%\^\&\*\-])/,
        'Required at least one number (0-9), uppercase and lowercase letters (a-Z) and at least one special character (!@#$%^&*-)'
      ),
    ],
    password2: [
      checkRegExp.bind(
        null,
        /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\!\@\#\$\%\^\&\*\-])/,
        'Must be equale to password'
      ),
    ],
    zip: [
      checkRegExp.bind(
        null,
        /^[0-9]{5}$/,
        'Field must include 5 digits and only consist of numeric values'
      ),
    ],
  };

  //   console.log('validations', validations.password2.value);

  function validateField(element) {
    console.log('element', validations[element.id]);
    // console.log('element', element.id === 'password2');
    // console.log('element', element.id === 'password');

    var fieldValidation = validations[element.id];

    var result = { valid: true, element: element, message: '' };
    if (fieldValidation) {
      for (var i = 0, len = fieldValidation.length; i < len; i++) {
        var validationFunction = fieldValidation[i];
        console.log('i', fieldValidation[i]);
        var answer = validationFunction(element.value);
        console.log('validationFunction', validationFunction);
        console.log('element', element.value);
        console.log('element', element.id === 'password');

        // if (element.id === 'password2') {
        //   console.log('elment.value', element.value);
        // }
        if (typeof answer === 'string') {
          result.valid = false;
          result.message = answer;
          break;
        }
      }
    }
    return result;
  }

  /*
   * Other function
   * */
  function toggleError(element, message) {
    var errorMessageElement =
      element.nextElementSibling &&
      element.nextElementSibling.classList.contains('field-error')
        ? element.nextElementSibling
        : null;
    errorMessageElement && message && (errorMessageElement.innerHTML = message);
    errorMessageElement && !message && (errorMessageElement.innerHTML = '');
  }
  function formOnchange(e) {
    if (e.target.dataset && e.target.dataset.validation !== undefined) {
      console.log('e.target', e.target.id.value);

      toggleError(e.target, validateField(e.target).message);
    }
  }

  /*
   * Listeners
   * */
  document.getElementById('mainForm').addEventListener('change', formOnchange);
})();
