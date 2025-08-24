import FormFieldAutoCompleteSelect from './Controlled/FormFieldAutoCompleteSelect/FormFieldAutoCompleteSelect';
import FormFieldCheckbox from './Controlled/FormFieldCheckbox/FormFieldCheckbox';
import FormFieldImageloader from './Controlled/FormFieldImageloader/FormFieldImageloader';
import FormFieldNumber from './Controlled/FormFieldNumber/FormFieldNumber';
import FormFieldPassword from './Controlled/FormFieldPassword/FormFieldPassword';
import FormFieldSelect from './Controlled/FormFieldSelect/FormFieldSelect';
import FormFieldText from './Controlled/FormFieldText/FormFieldText';

import FormFieldAutoCompleteSelectUncontrolled from './Uncontrolled/FormFieldAutoCompleteSelect/FormFieldAutoCompleteSelect';
import FormFieldCheckboxUncontrolled from './Uncontrolled/FormFieldCheckbox/FormFieldCheckbox';
import FormFieldImageloaderUncontrolled from './Uncontrolled/FormFieldImageloader/FormFieldImageloader';
import FormFieldNumberUncontrolled from './Uncontrolled/FormFieldNumber/FormFieldNumber';
import FormFieldPasswordUncontrolled from './Uncontrolled/FormFieldPassword/FormFieldPassword';
import FormFieldSelectUncontrolled from './Uncontrolled/FormFieldSelect/FormFieldSelect';
import FormFieldTextUncontrolled from './Uncontrolled/FormFieldText/FormFieldText';

export const Controlled = {
  TextInput: FormFieldText,
  PasswordInput: FormFieldPassword,
  Select: FormFieldSelect,
  Checkbox: FormFieldCheckbox,
  NumberInput: FormFieldNumber,
  AutoCompleteSelect: FormFieldAutoCompleteSelect,
  Imageloader: FormFieldImageloader,
};

export const Uncontrolled = {
  TextInput: FormFieldTextUncontrolled,
  PasswordInput: FormFieldPasswordUncontrolled,
  Select: FormFieldSelectUncontrolled,
  Checkbox: FormFieldCheckboxUncontrolled,
  NumberInput: FormFieldNumberUncontrolled,
  AutoCompleteSelect: FormFieldAutoCompleteSelectUncontrolled,
  Imageloader: FormFieldImageloaderUncontrolled,
};
