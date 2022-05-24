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
    // console.log('body', body);
    // console.log('url', url);

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
        'Required at least one number (0-9), uppercase and lowercase letters (a-Z) and at least one special character (!@#$%^&*-)'
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

  function validateField(element) {
    var fieldValidation = validations[element.id];
    var result = { valid: true, element: element, message: '' };

    if (element.id === 'password') {
      localStorage.setItem('pass1', element.value);
    }
    if (element.id === 'password2') {
      localStorage.setItem('pass2', element.value);
    }

    if (fieldValidation) {
      var pass1 = localStorage.getItem('pass1') || '';
      var pass2 = localStorage.getItem('pass2') || '';

      if (pass2 !== pass1 && element.id === 'password2') {
        result.valid = false;
        result.message = 'Must be to equal to password';
      }
      for (var i = 0, len = fieldValidation.length; i < len; i++) {
        var validationFunction = fieldValidation[i];

        var answer = validationFunction(element.value);

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
      toggleError(e.target, validateField(e.target).message);
    }
  }

  function nextBtnFunction(e) {
    var counter = 0;
    var allInputs = Array.from(
      document.querySelectorAll('[data-validation]')
    ).slice(0, -1);

    var changeActiveStep = this.parentNode.parentNode.children[0].children;
    var openHiddenBtn = this.parentNode.children;

    for (var i = 0; i < allInputs.length; i++) {
      var element = allInputs[i];
      toggleError(element, validateField(element).message);
      validateField(element).valid ? counter++ : counter--;

      if (counter === allInputs.length) {
        changeActiveStep[0].classList.remove('step_active');
        changeActiveStep[1].classList.add('step_active');
        helper(openHiddenBtn);
      }
    }
  }

  function prevBtnFunction() {
    var prevBtn = this.parentNode.children;
    var changeActiveStepBack = this.parentNode.parentNode.children[0].children;
    changeActiveStepBack[1].classList.remove('step_active');
    changeActiveStepBack[0].classList.add('step_active');

    helper(prevBtn, changeActiveStepBack);
  }

  function helper(elements) {
    for (var i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (element.classList.contains('control_hide')) {
        element.classList.remove('control_hide');
      } else if (!element.classList.contains('control_hide')) {
        element.classList.add('control_hide');
      }
    }
  }

  function checkZip(e) {
    e.preventDefault();
    let formToWorkOn = document.getElementById('mainForm');
    const formData = new FormData();

    formData.append('zip', document.getElementById('zip').value);

    console.log('formData');
    ajax({
      url: '../api/geoStatus.php',
      body: formData,
      success: function (result) {
        alert(result);
      },
      error: function (result) {
        alert(result);
      },
    });
  }
  /*
   * Listeners
   * */
  document.getElementById('mainForm').addEventListener('change', formOnchange);
  document
    .querySelector('[data-next]')
    .addEventListener('click', nextBtnFunction);
  document
    .querySelector('[data-prev]')
    .addEventListener('click', prevBtnFunction);
  document.querySelector('[data-submit]').addEventListener('click', checkZip);
})();
