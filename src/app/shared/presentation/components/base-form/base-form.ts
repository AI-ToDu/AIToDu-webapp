import { FormGroup } from '@angular/forms';

export class BaseForm {
  // Verifica si un campo específico es inválido y ya fue manipulado
  protected isInvalidControl(form: FormGroup, controlName: string): boolean {
    return form.controls[controlName].invalid && form.controls[controlName].touched;
  }

  // Diccionario interno de mensajes de error
  #errorMessageForControl(controlName: string, errorKey: string): string {
    switch (errorKey) {
      case 'required':
        return `El campo es obligatorio.`;
      case 'email':
        return `El formato del correo electrónico no es válido.`;
      case 'minlength':
        return `El texto ingresado es demasiado corto.`;
      case 'min':
        return `El valor numérico es menor al permitido.`;
      default:
        return `El campo contiene información inválida.`;
    }
  }

  // Expone los mensajes de error formateados para la vista HTML
  protected errorMessagesForControl(form: FormGroup, controlName: string): string {
    const control = form.controls[controlName];
    let errorMessages = '';
    const errors = control.errors;

    if (!errors) return errorMessages;

    Object.keys(errors).forEach(
      (errorKey) => (errorMessages += this.#errorMessageForControl(controlName, errorKey) + ' '),
    );

    return errorMessages.trim();
  }
}
