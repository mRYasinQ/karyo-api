import { Question, QuestionSet } from 'nest-commander';

const SUPERUSER_QUESTION_KEY = 'superuser-questions';

@QuestionSet({ name: SUPERUSER_QUESTION_KEY })
class SuperuserQuestions {
  @Question({ message: 'Enter first name (optional):', name: 'firstName', default: undefined })
  parseFirstName(val: string) {
    return val || undefined;
  }

  @Question({ message: 'Enter last name (optional):', name: 'lastName', default: undefined })
  parseLastName(val: string) {
    return val || undefined;
  }

  @Question({ message: 'Enter email:', name: 'email' })
  parseEmail(val: string) {
    return val;
  }

  @Question({ message: 'Enter username (optional):', name: 'username', default: undefined })
  parseUsername(val: string) {
    return val || undefined;
  }

  @Question({ message: 'Enter password:', name: 'password', type: 'password' })
  parsePassword(val: string) {
    return val;
  }
}

export { SUPERUSER_QUESTION_KEY };
export default SuperuserQuestions;
