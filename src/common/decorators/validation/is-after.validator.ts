import type {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraintInterface,
} from "class-validator";
import {
  ValidatorConstraint,
  registerDecorator,
} from "class-validator";
import { isAfter } from "date-fns";

@ValidatorConstraint({ async: true })
class IsAfterConstraint implements ValidatorConstraintInterface {
  async validate(value: string, arguments_: ValidationArguments) {
    const [relatedPropertyName] = arguments_.constraints;
    const relatedValue = (arguments_.object)[relatedPropertyName] as string | Date;

    return isAfter(new Date(value), new Date(relatedValue));
  }

  defaultMessage(arguments_: ValidationArguments) {
    const property = arguments_.property;
    const [relatedPropertyName] = arguments_.constraints;

    return `${property} should be after ${relatedPropertyName}`;
  }
}

export const IsAfter = (
  property: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator => {
  return function (object: Record<string, any>, propertyName: string | symbol) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName as string,
      options: validationOptions,
      constraints: [property],
      validator: IsAfterConstraint,
    });
  };
};


// // add typesafe property string

// export const IsAfterField = <T>(property: keyof T, validationOptions?: ValidationOptions) => {
//   return applyDecorators(
//     IsNotEmpty({
//       message: validationI18nMessage("validation.isNotEmpty"),
//     }),
//     IsAfter(String(property), validationOptions),
//   );
// };
